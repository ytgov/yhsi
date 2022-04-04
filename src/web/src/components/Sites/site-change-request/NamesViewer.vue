<template lang="pug">
.px-5.py-3
	h3 Secondary Names
	template(v-if="names.length === 0")
		span No names
	template(v-else)
		v-row(
			v-for="(name, i) in names",
			:key="i"
		)
			v-col
				v-text-field(
					:value="name.description"
					label="Secondary name"
					readonly
				)
</template>

<script>
export default {
	name: 'NamesViewer',
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		names() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
