/**
 * Strict parsing / formatting / validation for geographic coordinates.
 *
 * Decimal degrees is the canonical form: it is what every table in the schema
 * stores and what Leaflet/ESRI expect. Operators paste coordinates in a mix of
 * formats though, so parsing accepts decimal degrees (DD), degrees-decimal-
 * minutes (DDM) and degrees-minutes-seconds (DMS), and normalizes to DD.
 *
 * Parsing is deliberately strict: anything that is not unambiguously one of
 * those three forms is an error rather than a best-effort guess. A silently
 * mis-parsed coordinate puts a heritage site in the wrong place.
 */

import pointInPolygon from 'point-in-polygon';
import { yukonPolygon } from '@/misc/yukon_territory_polygon';

export const AXES = {
	latitude: {
		key: 'latitude',
		label: 'Latitude',
		max: 90,
		positive: 'N',
		negative: 'S',
	},
	longitude: {
		key: 'longitude',
		label: 'Longitude',
		max: 180,
		positive: 'E',
		negative: 'W',
	},
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

function axisConfig(axis) {
	const config = AXES[axis];
	if (!config) {
		throw new Error(`Unknown coordinate axis "${axis}"`);
	}
	return config;
}

function failure(error) {
	return { ok: false, empty: false, value: null, error };
}

function success(value) {
	return { ok: true, empty: false, value, error: null };
}

/**
 * Force longitudes into the western hemisphere. An unsigned value is read as
 * west; a value the operator explicitly marked east is rejected rather than
 * silently flipped, since that is a transposition or a typo, not a Yukon site.
 */
function applyHemisphereRule(value, axis, signExplicit) {
	if (!WESTERN_LONGITUDE_ONLY || axis !== 'longitude' || value <= 0) {
		return success(value);
	}

	if (signExplicit) {
		return failure('Longitude must be west of Greenwich (negative)');
	}

	return success(-value);
}

/**
 * Replace the unicode variants operators paste in (from Word, ArcGIS, Google
 * Maps) with their ascii equivalents so the tokenizer only sees one spelling.
 */
function canonicalize(text) {
	return text
		.replace(/[′‘’]/g, "'") // prime, curly single quotes
		.replace(/[″“”]/g, '"') // double prime, curly double quotes
		.replace(/[º°˚]/g, '°') // masculine ordinal, ring above
		.replace(/[‐-―−]/g, '-') // dashes, unicode minus
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Parse a coordinate in DD, DDM or DMS into decimal degrees.
 *
 * @param {string|number|null|undefined} input
 * @param {'latitude'|'longitude'} axis
 * @returns {{ok: boolean, empty: boolean, value: number|null, error: string|null}}
 *   `empty` is true (and `ok` true) for blank input — required-ness is a
 *   separate concern, see `coordinateRule`.
 */
export function parseCoordinate(input, axis) {
	const { label, max, positive, negative } = axisConfig(axis);

	if (input === null || input === undefined) {
		return { ok: true, empty: true, value: null, error: null };
	}

	if (typeof input === 'number') {
		if (!Number.isFinite(input)) {
			return failure(`${label} must be a number`);
		}
		if (Math.abs(input) > max) {
			return failure(`${label} must be between -${max} and ${max}`);
		}
		// A bare number carries no explicit sign intent, so it is subject to the
		// western-longitude rule the same way unsigned text is.
		return applyHemisphereRule(input, axis, false);
	}

	if (typeof input !== 'string') {
		return failure(`${label} must be a number`);
	}

	let text = canonicalize(input);
	if (text === '') {
		return { ok: true, empty: true, value: null, error: null };
	}

	// Hemisphere letter, leading or trailing. Reject the wrong axis outright:
	// "60 W" as a latitude is a transposed pair, not a coordinate.
	let hemisphere = null;
	const hemisphereMatch = text.match(/^([nsew])\s*|\s*([nsew])$/i);
	if (hemisphereMatch) {
		hemisphere = (hemisphereMatch[1] || hemisphereMatch[2]).toUpperCase();
		text = text.replace(hemisphereMatch[0], '').trim();
		if (hemisphere !== positive && hemisphere !== negative) {
			return failure(
				`${label} must use ${positive} or ${negative}, not ${hemisphere}`
			);
		}
	}

	// A second hemisphere letter means two coordinates were pasted into one field.
	if (/[nsew]/i.test(text)) {
		return failure(`Enter a single ${label.toLowerCase()} value`);
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
		const isLast = i === tokens.length - 1;
		// Only the smallest unit may be fractional — "60.5 30 00" is nonsense.
		const pattern = isLast ? /^\d+(\.\d+)?$/ : /^\d+$/;
		if (!pattern.test(tokens[i])) {
			return failure(`${label} is not a recognized coordinate`);
		}
	}

	const [degrees, minutes = '0', seconds = '0'] = tokens.map(Number);

	if (tokens.length > 1 && minutes >= 60) {
		return failure('Minutes must be less than 60');
	}
	if (tokens.length > 2 && seconds >= 60) {
		return failure('Seconds must be less than 60');
	}

	let value = degrees + minutes / 60 + seconds / 3600;
	if (negativeSign || hemisphere === negative) {
		value = -value;
	}

	if (Math.abs(value) > max) {
		return failure(`${label} must be between -${max} and ${max}`);
	}

	return applyHemisphereRule(value, axis, negativeSign || hemisphere !== null);
}

/**
 * Normalized decimal-degrees string, suitable for storing and for round-
 * tripping through the `nvarchar` Place columns. Returns null for blank or
 * unparseable input.
 */
export function formatCoordinate(input, axis, precision = DEFAULT_PRECISION) {
	const result = parseCoordinate(input, axis);
	if (!result.ok || result.empty) return null;

	// Number() drops the trailing zeros toFixed() adds.
	return String(Number(result.value.toFixed(precision)));
}

/** Decimal-degrees number, or null for blank/unparseable input. */
export function toDecimalDegrees(input, axis, precision = DEFAULT_PRECISION) {
	const result = parseCoordinate(input, axis);
	if (!result.ok || result.empty) return null;

	return Number(result.value.toFixed(precision));
}

/** Human-readable DMS, e.g. `60° 43' 16.4" N`. Null for blank/unparseable input. */
export function formatDms(input, axis) {
	const { positive, negative } = axisConfig(axis);
	const result = parseCoordinate(input, axis);
	if (!result.ok || result.empty) return null;

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

	const paddedSeconds = seconds.toFixed(1).padStart(4, '0');
	return `${degrees}° ${String(minutes).padStart(2, '0')}' ${paddedSeconds}" ${hemisphere}`;
}

/**
 * How far outside the territory boundary a point may sit before it is flagged.
 * Sites are recorded up to the border and a little past it — a survey point on
 * the Alaska or NWT side of a boundary site is legitimate — so the check is
 * deliberately loose. One degree is roughly 111 km north-south and ~50 km
 * east-west at Yukon latitudes.
 */
export const YUKON_BUFFER_DEGREES = 1;

let yukonBounds = null;

function boundsOfYukon() {
	if (yukonBounds) return yukonBounds;

	yukonBounds = yukonPolygon.latlngs.reduce(
		(bounds, [latitude, longitude]) => ({
			minLatitude: Math.min(bounds.minLatitude, latitude),
			maxLatitude: Math.max(bounds.maxLatitude, latitude),
			minLongitude: Math.min(bounds.minLongitude, longitude),
			maxLongitude: Math.max(bounds.maxLongitude, longitude),
		}),
		{
			minLatitude: Infinity,
			maxLatitude: -Infinity,
			minLongitude: Infinity,
			maxLongitude: -Infinity,
		}
	);

	return yukonBounds;
}

/**
 * True when the point is inside the territory, or within `buffer` degrees of
 * its extent. Used for a soft warning only — it never blocks a save, since the
 * boundary is not the authority on whether a record is valid.
 */
export function isNearYukon(latitude, longitude, buffer = YUKON_BUFFER_DEGREES) {
	if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return true;

	if (pointInPolygon([latitude, longitude], yukonPolygon.latlngs)) return true;

	const bounds = boundsOfYukon();
	return (
		latitude >= bounds.minLatitude - buffer &&
		latitude <= bounds.maxLatitude + buffer &&
		longitude >= bounds.minLongitude - buffer &&
		longitude <= bounds.maxLongitude + buffer
	);
}

/**
 * The buffered min/max for one axis, as the strings to show an operator.
 *
 * Rounded outward — floor the minimum, ceil the maximum — so a value inside the
 * range this reports can never be the one being warned about.
 */
export function yukonRange(axis, buffer = YUKON_BUFFER_DEGREES, decimals = 2) {
	const bounds = boundsOfYukon();
	const factor = 10 ** decimals;
	const [min, max] =
		axis === 'latitude'
			? [bounds.minLatitude - buffer, bounds.maxLatitude + buffer]
			: [bounds.minLongitude - buffer, bounds.maxLongitude + buffer];

	return {
		min: (Math.floor(min * factor) / factor).toFixed(decimals),
		max: (Math.ceil(max * factor) / factor).toFixed(decimals),
	};
}

/**
 * Vuetify rule factory. Blank passes unless `required` — presence and format
 * are separate concerns so callers can compose them.
 */
export function coordinateRule(axis, { required = false } = {}) {
	const { label } = axisConfig(axis);

	return (v) => {
		const result = parseCoordinate(v, axis);
		if (result.empty) {
			return required ? `${label} is required` : true;
		}
		return result.ok || result.error;
	};
}

export default {
	AXES,
	DEFAULT_PRECISION,
	WESTERN_LONGITUDE_ONLY,
	YUKON_BUFFER_DEGREES,
	parseCoordinate,
	formatCoordinate,
	toDecimalDegrees,
	formatDms,
	isNearYukon,
	yukonRange,
	coordinateRule,
};
