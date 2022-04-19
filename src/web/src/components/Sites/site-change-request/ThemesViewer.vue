<template lang="pug">
.px-5.py-3
	h3 Themes
	template(v-if="themes.length === 0")
		span No themes
	template(v-else)
		v-row(
			v-for="(theme, i) in themes",
			:key="i"
		)
			v-col
				PlaceThemeSelect(
					v-model="theme.placeThemeId"
					readonly
					dense
					hide-details
					outlined
					background-color="white"
				)
</template>

<script>
import PlaceThemeSelect from '@/components/Sites/site-forms/themes-and-functions/PlaceThemeSelect';

export default {
	name: 'ThemesViewer',
	components: {
		PlaceThemeSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		themes() {
			return this.value;
		},
	},
	methods: {},
};
</script>

<style scoped></style>
