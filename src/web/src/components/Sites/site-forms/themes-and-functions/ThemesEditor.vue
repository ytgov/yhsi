<template lang="pug">
v-card.default.mb-0(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Themes
	v-card-text(tag="form")
		v-row(
			v-for="(theme, i) in themes",
			:key="i"
		)
			v-col(cols="10")
				PlaceThemeSelect(
					v-model="theme.placeThemeId"
					dense
					hide-details
					outlined
					background-color="white"
				)
			v-col(cols="2")
				v-btn.my-0.float-right(
					color="warning"
					x-small
					fab
					title="Remove"
					@click="removeTheme(i)"
				)
					v-icon mdi-close
	v-card-actions
		v-btn.my-0(
			color="info"
			@click="addTheme"
		)
			| Add Theme
</template>

<script>
import PlaceThemeSelect from '@/components/Sites/site-forms/themes-and-functions/PlaceThemeSelect';

export default {
	name: 'ThemesEditor',
	components: {
		PlaceThemeSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		placeId: {
			type: [String, Number],
			required: true,
		},
	},
	computed: {
		themes() {
			return this.value;
		},
	},
	methods: {
		addTheme() {
			this.themes.push({ placeId: this.placeId, placeThemeId: 1 });
		},
		removeTheme(index) {
			this.themes.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
