<template lang="pug">
.px-5.py-3
	h3 Descriptions
	template(v-if="descriptions.length === 0")
		span No descriptions
	template(v-else)
		div(
			v-for="(description, i) in descriptions",
			:key="`description-${i + 1}`"
		)
			v-row
				v-col(cols="6")
					DescriptionTypeSelect(
						:value="description.type"
						readonly
						dense
						outlined
						background-color="white"
						hide-details
					)
			v-row
				v-col(cols="12")
					v-textarea(
						:value="description.descriptionText"
						readonly
						label
						dense
						outlined
						background-color="white"
						hide-details
					)
			v-row.mt-0(v-if="i < descriptions.length - 1")
				v-col(cols="12")
					v-divider.my-1.black
</template>

<script>
import DescriptionTypeSelect from '@/components/Sites/site-forms/descriptions/DescriptionTypeSelect';

export default {
	name: 'DescriptionsViewer',
	components: { DescriptionTypeSelect },
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		descriptions() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
