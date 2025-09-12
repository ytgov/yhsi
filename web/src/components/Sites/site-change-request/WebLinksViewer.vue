<template lang="pug">
.px-5.py-3
	h3 Web Links
	template(v-if="webLinks.length === 0")
		span No web links
	template(v-else)
		div(
			v-for="(item, i) in webLinks",
			:key="`web-link-${i + 1}`"
		)
			v-row.mb-2
				v-col(cols="6")
					WebLinkTypeSelect(
						:value="item.type"
						readonly
						dense
						outlined
						hide-details
					)
				v-col(cols="6")
					v-text-field(
						:value="item.address"
						label="Web Address"
						readonly
						required
						dense
						outlined
						hide-details
					)
</template>

<script>
import WebLinkTypeSelect from '@/components/Sites/site-forms/management/WebLinkTypeSelect';

export default {
	name: 'WebLinksViewer',
	components: {
		WebLinkTypeSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		webLinks() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
