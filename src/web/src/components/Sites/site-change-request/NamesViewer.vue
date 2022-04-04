<template lang="pug">
v-card
	v-card-title Secondary Names
	v-card-text
		v-row(
			v-for="(name, i) in value",
			:key="i"
		)
			v-col
				v-text-field(
					:value="name.description"
					label="Secondary name"
					hide-details
					dense
					v-bind="$attrs"
					v-on="$listeners"
				)
					template(
						v-for="(_, slot) of $scopedSlots"
						v-slot:[slot]="scope"
					)
						slot(
							:name="slot"
							v-bind="scope"
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
};
</script>

<style scoped></style>
