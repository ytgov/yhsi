<template>
	<div class="d-flex">
		<SiteFormsSidebar :site-id="id" />
		<div class="flex-grow-1">
			<v-app-bar
				color="primary"
				dark
				flat
			>
				<v-btn
					color="primary"
					to="/sites"
					exact
				>
					<v-icon>mdi-arrow-left-drop-circle</v-icon>
					<div class="ml-2">Back to Sites</div>
				</v-btn>
				<v-spacer />
				<v-progress-circular
					v-if="loading"
					indeterminate
					size="20"
					width="2"
				/>
				<span v-else>
					{{ siteName }}
				</span>
				<v-spacer />
				<v-btn 
					v-if="isEditor" 
					color="primary" 
					:loading="isDeleting" 
					@click="confirmThenDeleteThisSite"
				>
					<v-icon class="mr-2">mdi-delete</v-icon>
					Delete
				</v-btn>
				<v-btn
					v-if="showDoEdit"
					color="primary"
					:to="editSiteURL"
					exact
				>
					<v-icon class="mr-2">mdi-pencil</v-icon>

					Edit
				</v-btn>
				<v-btn
					color="primary"
					@click="showDialog"
				>
					<v-icon class="mr-2">mdi-printer</v-icon>
					<div>Print Site</div>
				</v-btn>
			</v-app-bar>
			<PrintDialog
				:dialog="dialog"
				:sitename="siteName"
				:siteId="id"
				@closeDialog="closeDialog"
				@showError="showError"
				@showSuccess="showSuccess"
				@showAPIMessages="showAPIMessages"
			/>
			<div>
				<template v-if="loading">
					<v-skeleton-loader
						v-for="n in 9"
						:key="n"
						type="card"
					/>
				</template>
				<template v-else>
					<component
						:is="summaryComponent"
						id="summary"
						:place-id="id"
					/>
					<component
						:is="locationComponent"
						id="location"
						:place-id="id"
					/>
					<component
						:is="datesComponent"
						id="dates-and-condition"
						:place-id="id"
					/>
					<component
						:is="themesAndFunctionsComponent"
						id="themes-and-function"
						:place-id="id"
					/>
					<component
						:is="associationsComponent"
						id="associations"
						:place-id="id"
					/>
					<component
						:is="legalAndZoningComponent"
						id="legal-and-zoning"
						:place-id="id"
					/>
					<GenericRecordPhotosCard
						id="photos"
						record="place"
						:recordId="id"
						:showAddPhotoButton="!showDoEdit"
					/>
					<component
						:is="managementComponent"
						id="management"
						:place-id="id"
					/>
					<component
						:is="descriptionComponent"
						id="description"
						:place-id="id"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import goTo from 'vuetify/lib/services/goto';

import AssociationsSiteFormEditor from '@/components/Sites/site-forms/AssociationsSiteFormEditor';
//import AssociationsSiteFormViewer from '@/components/Sites/site-forms/AssociationsSiteFormViewer';
import DatesAndConditions from '@/components/Sites/site-forms/DatesAndConditions';
//import DatesAndConditionsViewer from '@/components/Sites/site-forms/DatesAndConditionsViewer';
import Description from '@/components/Sites/site-forms/Description';
//import DescriptionViewer from '@/components/Sites/site-forms/DescriptionViewer';
import LegalAndZoning from '@/components/Sites/site-forms/LegalAndZoning';
//import LegalAndZoningViewer from '@/components/Sites/site-forms/LegalAndZoningViewer';
import Location from '@/components/Sites/site-forms/Location';
//import LocationReadonly from '@/components/Sites/site-forms/LocationReadonly';
import Management from '@/components/Sites/site-forms/Management';
//import ManagementViewer from '@/components/Sites/site-forms/ManagementViewer';
import GenericRecordPhotosCard from '@/components/photos/GenericRecordPhotosCard.vue';
import PrintDialog from '@/components/Sites/SiteFormsPrintDialog';
import SiteFormsSidebar from '@/components/Sites/SiteFormsSidebar';
import Summary from '@/components/Sites/site-forms/Summary';
//import SummaryReadonly from '@/components/Sites/site-forms/SummaryReadonly';
import ThemesAndFunctions from '@/components/Sites/site-forms/ThemesAndFunctions';
//import ThemesAndFunctionsViewer from '@/components/Sites/site-forms/ThemesAndFunctionsViewer';

export default {
	name: 'SiteForms',
	components: {
		AssociationsSiteFormEditor,
		//AssociationsSiteFormViewer,
		DatesAndConditions,
		//DatesAndConditionsViewer,
		Description,
		//DescriptionViewer,
		LegalAndZoning,
		//LegalAndZoningViewer,
		Location,
		//LocationReadonly,
		Management,
		GenericRecordPhotosCard,
		PrintDialog,
		SiteFormsSidebar,
		Summary,
		//SummaryReadonly,
		ThemesAndFunctions,
		//ThemesAndFunctionsViewer,
	},
	props: {
		id: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({
		dialog: false, //tells the print dialog when to show itself
		isDeleting: false,
	}),
	computed: {
		...mapGetters('places', {
			hasPendingChanges: 'hasPendingChanges',
			loading: 'loading',
			siteName: 'primaryName',
			isEditor: 'isEditor',
		}),
		editSiteURL() {
			return `/sites/${this.$route.params.id}/edit`;
		},
		showDoEdit() {
			return this.isEditor && !this.$route.path.includes('edit', 'new');
		},
		associationsComponent() {
			//if (this.hasPendingChanges) return AssociationsSiteFormViewer;

			return AssociationsSiteFormEditor;
		},
		datesComponent() {
			//if (this.hasPendingChanges) return DatesAndConditionsViewer;

			return DatesAndConditions;
		},
		descriptionComponent() {
			//if (this.hasPendingChanges) return DescriptionViewer;

			return Description;
		},
		legalAndZoningComponent() {
			//if (this.hasPendingChanges) return LegalAndZoningViewer;

			return LegalAndZoning;
		},
		locationComponent() {
			//if (this.hasPendingChanges) return LocationReadonly;

			return Location;
		},
		managementComponent() {
			//if (this.hasPendingChanges) return ManagementViewer;

			return Management;
		},
		summaryComponent() {
			//if (this.hasPendingChanges) return SummaryReadonly;

			return Summary;
		},
		themesAndFunctionsComponent() {
			//if (this.hasPendingChanges) return ThemesAndFunctionsViewer;

			return ThemesAndFunctions;
		},
	},
	mounted() {
		this.initializePlace(this.id)
			.then((place) => {
				this.addSiteHistory(place);
				if (this.$route.hash) {
					goTo(this.$route.hash, { offset: 75 });
				}
			})
			.catch((error) => {
				console.log('ERROR LOADING PLACE', error.message);
				this.$router.push('/sites');
			});
	},
	methods: {
		...mapActions({
			initializePlace: 'places/initialize',
			addSiteHistory: 'addSiteHistory',
			deletePlace: 'places/delete',
		}),
		showDialog() {
			this.dialog = true;
		},
		closeDialog() {
			this.dialog = false;
		},
		showError: function (msg) {
			this.$emit('showError', msg);
		},
		showSuccess: function (msg) {
			this.$emit('showSuccess', msg);
		},
		showAPIMessages: function (msg) {
			this.$emit('showAPIMessages', msg);
		},
		confirmThenDeleteThisSite() {
			const result = confirm('Are you sure you want to delete this site?');
			if(result === false) return
			
			this.isDeleting = true;
			try {	
				this.deletePlace(this.id);
				this.$router.push('/sites');
			} catch (error) {
				console.log(`Failed to delete place: ${error}`, {error});
			} finally {
				this.isDeleting = false;
			}
		}
	},
};
</script>

<style scoped>
.list-menu {
	padding: 0px 8px 0px 0px;
}
</style>
