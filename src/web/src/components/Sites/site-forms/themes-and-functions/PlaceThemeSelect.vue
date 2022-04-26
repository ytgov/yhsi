<template lang="pug">
v-autocomplete(
	label="Category / Type",
	:items="placeThemeOptions",
	:loading="loading"
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
import api from '@/apis/place-themes-api';

export default {
	name: 'PlaceThemeSelect',
	data: () => ({
		placeThemeOptions: [],
		loading: false,
	}),
	mounted() {
		this.getPlaceThemes();
	},
	methods: {
		getPlaceThemes() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					const formattedOptions = data.map(({ id, category, type }) => {
						return {
							value: id,
							text: `${category} / ${type}`,
						};
					});
					this.placeThemeOptions = formattedOptions;
					return data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
