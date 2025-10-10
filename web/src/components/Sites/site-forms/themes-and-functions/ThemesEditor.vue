<template>
	<v-card
		class="default mb-0"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>Themes</h3>
			<div v-if="!themes.length">No themes found.</div>
			<v-row
				v-for="(theme, i) in themes"
				:key="i"
			>
				<v-col cols="10">
					<PlaceThemeSelect
						v-model="theme.placeThemeId"
						dense
						hide-details
						outlined
						background-color="white"
					/>
				</v-col>
				<v-col cols="2">
					<v-btn
						v-if="isEditing"
						class="my-0 float-right"
						color="warning"
						x-small
						fab
						title="Remove"
						@click="removeTheme(i)"
					>
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>
		<v-card-actions v-if="isEditing">
			<v-btn
				class="my-0"
				color="primary"
				@click="addTheme"
			>
				Add Theme
			</v-btn>
		</v-card-actions>
	</v-card>
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
		isEditing() {
			return this.$route.path.includes('/edit');
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
