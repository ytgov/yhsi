import { body, ValidationChain } from 'express-validator';

/**
 * Strict parsing / formatting / validation for geographic coordinates.
 *
 * Server-side counterpart to `web/src/utils/coordinates.js` — the two must stay
 * in step. Decimal degrees is the canonical stored form; the Place tables hold
 * it as nvarchar, the newer tables as float, so `normalizeCoordinate` returns a
 * canonical string that is safe for both.
 *
 * Parsing accepts decimal degrees (DD), degrees-decimal-minutes (DDM) and
 * degrees-minutes-seconds (DMS). Anything else is an error rather than a
 * best-effort guess — a silently mis-parsed coordinate puts a heritage site in
 * the wrong place.
 */

export type CoordinateAxis = 'latitude' | 'longitude';

interface AxisConfig {
	label: string;
	max: number;
	positive: string;
	negative: string;
}

export const AXES: Record<CoordinateAxis, AxisConfig> = {
	latitude: { label: 'Latitude', max: 90, positive: 'N', negative: 'S' },
	longitude: { label: 'Longitude', max: 180, positive: 'E', negative: 'W' },
};

export const DEFAULT_PRECISION = 6;

/**
 * Every record in this system is in the Yukon, which is entirely west of
 * Greenwich, so a stored longitude is always negative. Downstream consumers
 * (the CSW feed in particular) reject records where the sign varies, so an
 * unsigned longitude is read as west rather than passed through, and an
 * explicitly eastern one is an error.
 */
export const WESTERN_LONGITUDE_ONLY = true;

export interface CoordinateParseResult {
	ok: boolean;
	empty: boolean;
	value: number | null;
	error: string | null;
}

function failure(error: string): CoordinateParseResult {
	return { ok: false, empty: false, value: null, error };
}

function success(value: number): CoordinateParseResult {
	return { ok: true, empty: false, value, error: null };
}

const EMPTY: CoordinateParseResult = { ok: true, empty: true, value: null, error: null };

/**
 * Force longitudes into the western hemisphere. An unsigned value is read as
 * west; a value explicitly marked east is rejected rather than silently
 * flipped, since that is a transposition or a typo, not a Yukon site.
 */
function applyHemisphereRule(
	value: number,
	axis: CoordinateAxis,
	signExplicit: boolean
): CoordinateParseResult {
	if (!WESTERN_LONGITUDE_ONLY || axis !== 'longitude' || value <= 0) {
		return success(value);
	}

	if (signExplicit) {
		return failure('Longitude must be west of Greenwich (negative)');
	}

	return success(-value);
}

/**
 * Replace the unicode variants clients paste in (from Word, ArcGIS, Google
 * Maps) with their ascii equivalents so the tokenizer only sees one spelling.
 */
function canonicalize(text: string): string {
	return text
		.replace(/[′‘’]/g, "'")
		.replace(/[″“”]/g, '"')
		.replace(/[º°˚]/g, '°')
		.replace(/[‐-―−]/g, '-')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Parse a coordinate in DD, DDM or DMS into decimal degrees. Blank input is
 * `empty` and `ok` — required-ness is a separate concern.
 */
export function parseCoordinate(input: unknown, axis: CoordinateAxis): CoordinateParseResult {
	const { label, max, positive, negative } = AXES[axis];

	if (input === null || input === undefined) return EMPTY;

	if (typeof input === 'number') {
		if (!Number.isFinite(input)) return failure(`${label} must be a number`);
		if (Math.abs(input) > max) return failure(`${label} must be between -${max} and ${max}`);
		// A bare number carries no explicit sign intent, so it is subject to the
		// western-longitude rule the same way unsigned text is.
		return applyHemisphereRule(input, axis, false);
	}

	if (typeof input !== 'string') return failure(`${label} must be a number`);

	let text = canonicalize(input);
	if (text === '') return EMPTY;

	// Hemisphere letter, leading or trailing. Reject the wrong axis outright:
	// "60 W" as a latitude is a transposed pair, not a coordinate.
	let hemisphere: string | null = null;
	const hemisphereMatch = text.match(/^([nsew])\s*|\s*([nsew])$/i);
	if (hemisphereMatch) {
		hemisphere = (hemisphereMatch[1] || hemisphereMatch[2]).toUpperCase();
		text = text.replace(hemisphereMatch[0], '').trim();
		if (hemisphere !== positive && hemisphere !== negative) {
			return failure(`${label} must use ${positive} or ${negative}, not ${hemisphere}`);
		}
	}

	// A second hemisphere letter means two coordinates arrived in one field.
	if (/[nsew]/i.test(text)) {
		return failure(`Expected a single ${label.toLowerCase()} value`);
	}

	let negativeSign = false;
	if (text.startsWith('-')) {
		negativeSign = true;
		text = text.slice(1).trim();
	} else if (text.startsWith('+')) {
		text = text.slice(1).trim();
	}

	if (negativeSign && hemisphere) {
		return failure(`Use either a minus sign or ${hemisphere}, not both`);
	}

	// Degree/minute/second marks are separators; everything else must be digits.
	const tokens = text
		.replace(/[°'"]/g, ' ')
		.trim()
		.split(/\s+/)
		.filter((token) => token !== '');

	if (tokens.length === 0 || tokens.length > 3) {
		return failure(`${label} is not a recognized coordinate`);
	}

	for (let i = 0; i < tokens.length; i += 1) {
		// Only the smallest unit may be fractional — "60.5 30 00" is nonsense.
		const pattern = i === tokens.length - 1 ? /^\d+(\.\d+)?$/ : /^\d+$/;
		if (!pattern.test(tokens[i])) {
			return failure(`${label} is not a recognized coordinate`);
		}
	}

	const [degrees, minutes = 0, seconds = 0] = tokens.map(Number);

	if (tokens.length > 1 && minutes >= 60) return failure('Minutes must be less than 60');
	if (tokens.length > 2 && seconds >= 60) return failure('Seconds must be less than 60');

	let value = degrees + minutes / 60 + seconds / 3600;
	if (negativeSign || hemisphere === negative) value = -value;

	if (Math.abs(value) > max) {
		return failure(`${label} must be between -${max} and ${max}`);
	}

	return applyHemisphereRule(value, axis, negativeSign || hemisphere !== null);
}

export function isValidCoordinate(input: unknown, axis: CoordinateAxis): boolean {
	return parseCoordinate(input, axis).ok;
}

/** Canonical decimal-degrees string; null for blank or unparseable input. */
export function normalizeCoordinate(
	input: unknown,
	axis: CoordinateAxis,
	precision = DEFAULT_PRECISION
): string | null {
	const result = parseCoordinate(input, axis);
	if (!result.ok || result.empty || result.value === null) return null;

	// Number() drops the trailing zeros toFixed() adds.
	return String(Number(result.value.toFixed(precision)));
}

/** Decimal-degrees number; null for blank or unparseable input. */
export function toDecimalDegrees(
	input: unknown,
	axis: CoordinateAxis,
	precision = DEFAULT_PRECISION
): number | null {
	const normalized = normalizeCoordinate(input, axis, precision);
	return normalized === null ? null : Number(normalized);
}

/** Human-readable DMS, e.g. `60° 43' 16.4" N`; null for blank/unparseable input. */
export function formatDms(input: unknown, axis: CoordinateAxis): string | null {
	const { positive, negative } = AXES[axis];
	const result = parseCoordinate(input, axis);
	if (!result.ok || result.empty || result.value === null) return null;

	const hemisphere = result.value < 0 ? negative : positive;
	const absolute = Math.abs(result.value);

	let degrees = Math.floor(absolute);
	let minutes = Math.floor((absolute - degrees) * 60);
	let seconds = Number(((absolute - degrees - minutes / 60) * 3600).toFixed(1));

	// Rounding seconds can tip them to 60.0; carry so we never print 60" or 60'.
	if (seconds >= 60) {
		seconds = 0;
		minutes += 1;
	}
	if (minutes >= 60) {
		minutes = 0;
		degrees += 1;
	}

	return `${degrees}° ${String(minutes).padStart(2, '0')}' ${seconds
		.toFixed(1)
		.padStart(4, '0')}" ${hemisphere}`;
}

/**
 * express-validator chain for an optional coordinate field: rejects anything
 * unparseable and rewrites what is accepted into canonical decimal degrees, so
 * services and the database only ever see the one format.
 */
export function coordinateBody(field: string, axis: CoordinateAxis): ValidationChain {
	return body(field)
		.optional({ nullable: true })
		.custom((value) => {
			const result = parseCoordinate(value, axis);
			if (result.ok) return true;
			throw new Error(result.error as string);
		})
		.customSanitizer((value) => normalizeCoordinate(value, axis));
}
