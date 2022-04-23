<template lang="pug">
v-card.default(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Revision Logs
	v-card-text(tag="form")
		template(v-if="revisionLogs.length === 0")
			span No revision logs
		template(v-else)
			div(
				v-for="(item, i) in revisionLogs",
				:key="`log-${i + 1}`"
			)
				v-row
					v-col(cols="6")
						RevisionLogTypeSelect(
							:value="item.revisionLogType"
							readonly
							outlined
							dense
							background-color="white"
						)
						v-text-field(
							:value="item.revisedBy"
							label="Revised By"
							readonly
							required
							outlined
							dense
							hide-details
							background-color="white"
						)
					v-col(cols="6")
						v-text-field(
							:value="item.revisionDate"
							label="Date"
							readonly
							required
							outlined
							dense
							background-color="white"
						)
						v-text-field(
							:value="item.details"
							label="Details"
							readonly
							required
							outlined
							dense
							hide-details
							background-color="white"
						)
				v-row.my-0(v-if="i < revisionLogs.length - 1")
					v-col(cols="12")
						v-divider.my-1.black
</template>

<script>
import RevisionLogTypeSelect from '@/components/Sites/site-forms/management/RevisionLogTypeSelect';

export default {
	name: 'RevisionLogViewer',
	components: { RevisionLogTypeSelect },
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		revisionLogs() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
