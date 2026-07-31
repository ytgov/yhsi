<template>
	<v-text-field
		v-model="display"
		v-bind="$attrs"
		:label="fieldLabel"
		:rules="fieldRules"
		:hint="fieldHint"
		:persistent-hint="persistentHint"
		v-on="listeners"
		@input="onInput"
		@blur="onBlur"
	/>
</template>

<script>
import {
	coordinateRule,
	formatCoordinate,
	formatDms,
	isNearYukon,
	parseCoordinate,
	yukonRange,
	AXES,
	DEFAULT_PRECISION,
	YUKON_BUFFER_DEGREES,
} from '@/utils/coordinates';

/**
 * The standard latitude/longitude input.
 *
 * Accepts decimal degrees, degrees-decimal-minutes or degrees-minutes-seconds
 * and normalizes to decimal degrees; see `@/utils/coordinates`. Use this
 * instead of a bare v-text-field anywhere a coordinate is entered so the
 * parsing and error messages stay consistent.
 *
 * Emits a normalized decimal-degrees string (or Number, with `numeric`) as
 * soon as the input parses, and the raw text while it does not — the rule and
 * the API-side validator are what keep unparseable text from being saved.
 */
export default {
	name: 'CoordinateField',
	inheritAttrs: false,
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
		axis: {
			type: String,
			required: true,
			validator: (v) => Object.keys(AXES).includes(v),
		},
		label: {
			type: String,
			default: null,
		},
		required: {
			type: Boolean,
			default: false,
		},
		/** Emit a Number rather than a normalized string (for float columns). */
		numeric: {
			type: Boolean,
			default: false,
		},
		/** Decimal places kept when normalizing — ~0.1 m at Yukon latitudes. */
		precision: {
			type: Number,
			default: DEFAULT_PRECISION,
		},
		/** Show a non-blocking hint when the point falls outside the territory. */
		warnOutsideYukon: {
			type: Boolean,
			default: false,
		},
		/** Degrees of slack allowed around the territory before warning. */
		yukonBuffer: {
			type: Number,
			default: YUKON_BUFFER_DEGREES,
		},
		/** Latitude to pair with, so the Yukon check has both axes. */
		pairedLatitude: {
			type: [String, Number],
			default: null,
		},
		/** Longitude to pair with, so the Yukon check has both axes. */
		pairedLongitude: {
			type: [String, Number],
			default: null,
		},
		rules: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			display: this.value === null || this.value === undefined ? '' : String(this.value),
		};
	},
	computed: {
		// `input` and `blur` are handled here; anything else passes through.
		listeners() {
			// eslint-disable-next-line no-unused-vars
			const { input, blur, ...rest } = this.$listeners;
			return rest;
		},
		fieldLabel() {
			return this.label || AXES[this.axis].label;
		},
		fieldRules() {
			return [coordinateRule(this.axis, { required: this.required }), ...this.rules];
		},
		parsed() {
			return parseCoordinate(this.display, this.axis);
		},
		/**
		 * Echo the DMS equivalent so an operator can eyeball that a pasted value
		 * landed where they expected, and flag points outside the territory.
		 */
		fieldHint() {
			if (!this.parsed.ok || this.parsed.empty) return undefined;

			const dms = formatDms(this.parsed.value, this.axis);
			if (this.isFarFromYukon) {
				const { min, max } = yukonRange(this.axis, this.yukonBuffer);
				return `${dms} — well outside Yukon, ensure this value is between ${min} and ${max}`;
			}
			return dms;
		},
		persistentHint() {
			return this.isFarFromYukon;
		},
		isFarFromYukon() {
			if (!this.warnOutsideYukon) return false;

			const latitude = parseCoordinate(
				this.axis === 'latitude' ? this.display : this.pairedLatitude,
				'latitude'
			);
			const longitude = parseCoordinate(
				this.axis === 'longitude' ? this.display : this.pairedLongitude,
				'longitude'
			);
			// Only meaningful once both axes are present and valid.
			if (!latitude.ok || latitude.empty || !longitude.ok || longitude.empty) {
				return false;
			}

			return !isNearYukon(latitude.value, longitude.value, this.yukonBuffer);
		},
	},
	watch: {
		value(next) {
			// Ignore the echo of our own emit so normalization does not rewrite
			// the field out from under someone mid-keystroke.
			const incoming = parseCoordinate(next, this.axis);
			const current = this.parsed;
			if (incoming.ok && current.ok && incoming.value === current.value) return;

			this.display = next === null || next === undefined ? '' : String(next);
		},
	},
	methods: {
		emitValue(text) {
			const result = parseCoordinate(text, this.axis);

			if (result.empty) {
				this.$emit('input', null);
				return;
			}
			if (!result.ok) {
				// Keep the raw text so the parent sees the field as dirty; the rule
				// blocks the save.
				this.$emit('input', text);
				return;
			}

			const normalized = formatCoordinate(result.value, this.axis, this.precision);
			this.$emit('input', this.numeric ? Number(normalized) : normalized);
		},
		onInput(text) {
			this.display = text;
			this.emitValue(text);
		},
		onBlur(event) {
			// Rewrite what is on screen into the canonical form.
			const normalized = formatCoordinate(this.display, this.axis, this.precision);
			if (normalized !== null) {
				this.display = normalized;
			}
			this.emitValue(this.display);
			this.$emit('blur', event);
		},
	},
};
</script>
