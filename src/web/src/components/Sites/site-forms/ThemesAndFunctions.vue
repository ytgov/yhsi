<template>
	<v-card
		class="mb-0"
		tag="section"
		outlined
		tile
	>
		<v-card-title
			class="mb-0 text-h4"
			tag="h2"
		>
			Themes &amp; Function
		</v-card-title>
		<v-card-text tag="section">
			<v-col cols="12">
				<v-textarea
					v-model="place.yHSThemes"
					label="YHS Themes"
					dense
					rows="4"
					outlined
					hide-details
					background-color="white"
					:readonly="!isEditing"
				/>
			</v-col>

			<v-col cols="12">
				<ThemesEditor
					v-model="place.themes"
					:place-id="placeId"
				/>
			</v-col>

			<v-col cols="12">
				<FunctionalUsesEditor
					v-model="place.functionalUses"
					:place-id="placeId"
				/>
			</v-col>
			<v-col cols="6">
				<v-textarea
					v-model="place.currentUseComment"
					label="YHS Current Use"
					dense
					outlined
					background-color="white"
					hide-details
					:readonly="!isEditing"
				/>
			</v-col>
			<v-col cols="6">
				<v-textarea
					v-model="place.yHSPastUse"
					label="YHS Past Use"
					dense
					outlined
					hide-details
					background-color="white"
					:readonly="!isEditing"
				/>
			</v-col>
		</v-card-text>
		<v-card-actions>
			<v-spacer />
			<v-btn
				class="my-0"
				color="primary"
				@click="saveChanges"
			>
				Save
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { pick } from 'lodash';

import FunctionalUsesEditor from '@/components/Sites/site-forms/themes-and-functions/FunctionalUsesEditor';
import ThemesEditor from '@/components/Sites/site-forms/themes-and-functions/ThemesEditor';

export default {
	name: 'ThemesAndFunctions',
	components: { FunctionalUsesEditor, ThemesEditor },
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
	},
	computed: {
		...mapGetters({
			place: 'places/place',
		}),
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	methods: {
		...mapActions({
			savePlace: 'places/save',
		}),
		saveChanges() {
			const data = pick(this.place, [
				'themes',
				'functionalUses',
				'currentUseComment',
				'yHSPastUse',
				'yHSThemes',
			]);

			return this.savePlace(data);
		},
	},
};
</script>
