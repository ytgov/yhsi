<template lang="pug">
.px-5.py-3
	h3 Dates
	template(v-if="dates.length === 0")
		span No dates
	template(v-else)
		div(
			v-for="(date, i) in dates",
			:key="i"
		)
			v-row
				v-col(cols="6")
					DateTypesSelect(
						:value="date.type"
						readonly
					)
				v-col(cols="6")
					v-text-field(
						:value="date.details"
						label="Details"
						readonly
					)
			v-row
				v-col(cols="6")
					v-text-field(
						v-model="date.fromDate"
						label="From date"
						append-icon="mdi-calendar"
						readonly
						outlined
						dense
						hide-details
						background-color="white"
					)
				v-col(cols="6")
					v-text-field(
						v-model="date.toDate"
						label="To date"
						append-icon="mdi-calendar"
						readonly
						outlined
						dense
						hide-details
						background-color="white"
					)
			v-row.my-0(v-if="i < dates.length - 1")
				v-col(cols="12")
					v-divider.black
</template>

<script>
import DateTypesSelect from '@/components/Sites/site-forms/DateTypesSelect';

export default {
	name: 'DatesViewer',
	components: { DateTypesSelect },
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		dates() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
