<template>
	<div>
		<h3>Batch Attributes</h3>
		<Breadcrumbs />
		<v-row>
			<v-col cols="12" class="d-flex">
				<h1>{{ displayName }}</h1>
				<v-spacer></v-spacer>
				<v-btn
					v-if="mode == 'view'"
					class="black--text mx-1 form-header"
					@click="goBack"
				>
					<v-icon class="mr-1">mdi-arrow-left</v-icon>
					Back
				</v-btn>

				<v-btn
					v-if="mode == 'view'"
					class="mx-1 form-header"
					color="secondary"
					@click="processBatch()"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Process Batch
				</v-btn>

				<v-btn
					v-if="mode == 'view'"
					class="mx-1 form-header"
					color="primary"
					@click="editMode"
				>
					<v-icon class="mr-1">mdi-pencil</v-icon>
					Edit
				</v-btn>

				<!-- buttons for the edit state -->
				<v-btn
					class="black--text mx-1 form-header"
					@click="cancelEdit"
					v-if="mode == 'edit'"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
				<v-btn
					color="primary"
					:disabled="changesMade == 0"
					v-if="mode == 'edit'"
					@click="saveChanges"
					class="form-header"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Done
				</v-btn>
			</v-col>
		</v-row>

		<v-row v-if="imagesLoaded">
			<v-col
				v-for="(item, i) in photos"
				:key="`photo-${i}`"
				class="d-flex child-flex scroll"
				cols="2"
			>
				<v-card class="mx-auto">
					<v-img
						:src="item.thumbFile.base64"
						:lazy-src="item.thumbFile.base64"
						class="white--text align-end"
						aspect-ratio="1"
					>
					</v-img>

					<v-card-actions>
						<v-card-subtitle v-text="item.photoFileName"></v-card-subtitle>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
		<v-row v-if="!imagesLoaded">
			<div class="loading">Loading images...</div>
		</v-row>

		<v-divider class="mt-4"></v-divider>

		<div ref="feature">
			<Feature
				v-if="infoLoaded"
				:fields="fields"
				:mode="mode"
				:itemType="'batch'"
				@featureChange="featureChange"
				@featureValidChange="featureValidChange"
				ref="feature"
			/>
		</div>
		<div ref="siteRecord">
			<SiteRecord
				v-if="infoLoaded"
				:fields="fields"
				:mode="mode"
				:itemType="'batch'"
				@siteRecordChange="siteRecordChange"
				ref="siteRecord"
			/>
		</div>
		<div ref="historicSites">
			<HistoricSites
				v-if="infoLoaded"
				:fields="fields"
				:mode="mode"
				:itemType="'batch'"
				@historicSiteChange="historicSiteChange"
				@siteValidChange="siteValidChange"
				ref="historicSites"
			/>
		</div>
		<div ref="photo">
			<Photo
				v-if="infoLoaded"
				:fields="fields"
				:mode="mode"
				:itemType="'batch'"
				@photoChange="photoChange"
				@photoValidChange="photoValidChange"
				ref="photo"
			/>
		</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import Feature from '../PhotosComponents/Feature';
	import SiteRecord from '../PhotosComponents/SiteRecord';
	import HistoricSites from '../PhotosComponents/HistoricSites';
	import Photo from '../PhotosComponents/Photo';
	import { PHOTO_BATCH_URL } from '../../../urls';
	import Breadcrumbs from '../../Breadcrumbs';

	export default {
		name: 'PhotoBatchAttributes',
		components: { Feature, SiteRecord, HistoricSites, Photo, Breadcrumbs },
		data: () => ({
			photos: [],
			displayName: null,
			infoLoaded: false,
			imagesLoaded: false,
			fields: { dateCreated: new Date().toISOString().substr(0, 10) },
			changesMade: 0,
			body: {},
			featureValid: false,
			photoValid: false,
			siteValid: false,
		}),
		created() {
			this.loadBatch();
			this.loadPhotos();
		},
		methods: {
			loadBatch() {
				this.loading = true;
				axios
					.get(`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}`)
					.then((resp) => {
						this.fields = resp.data.data;
						this.fields.subjects = this.fields.subjects
							? this.fields.subjects.split(',')
							: null;
						this.fields.dateCreated = this.fields.dateCreated
							? this.fields.dateCreated.substr(0, 10)
							: '';
						this.displayName = resp.data.data.name;
					})
					.catch((error) => console.error(error))
					.finally(() => {
						this.infoLoaded = true;
					});
			},
			loadPhotos() {
				axios
					.get(`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}/photos`)
					.then((resp) => {
						this.photos = resp.data.data.map((x) => {
							x.thumbFile.base64 = `data:image/png;base64,${this.toBase64(
								x.thumbFile.data
							)}`;
							return x;
						});
					})
					.catch((err) => console.error('Error in loadBatch: ' + err))
					.finally(() => {
						this.imagesLoaded = true;
					});
			},
			toBase64(arr) {
				return btoa(
					arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
				);
			},
			goBack() {
				this.$router.push(`/photobatches/upload`);
			},
			featureChange(val) {
				this.fields.address = val.address;
				this.fields.communityId = val.communityId;
				this.fields.name = val.name;
				this.fields.location = val.location;
				this.fields.nTSMapNumber = val.nTSMapNumber;
				this.changesMade = this.changesMade + 1;
			},
			featureValidChange(val) {
				this.featureValid = val;
			},
			siteRecordChange(val) {
				this.fields.isOtherRecord = val.isOtherRecord;
				this.fields.bordenRecord = val.bordenRecord;
				this.fields.archivalRecord = val.archivalRecord;
				this.fields.paleoRecord = val.paleoRecord;
				this.changesMade = this.changesMade + 1;
			},
			historicSiteChange(val) {
				this.fields.creator = val.creator;
				//this.fields.dateCreated = val.dateCreated;
				this.fields.mediaStorage = val.mediaStorage;
				this.fields.originalMediaId = val.originalMediaId;
				this.fields.originalRecord = val.originalRecord;
				this.fields.photoProjectId = val.photoProjectId;
				this.fields.program = val.program;
				this.changesMade = this.changesMade + 1;
			},
			siteValidChange(val) {
				this.siteValid = val;
			},
			photoChange(val) {
				this.fields.caption = val.caption;
				this.fields.creditLine = val.creditLine;
				this.fields.copyright = val.copyright;
				this.fields.isComplete = val.isComplete;
				this.fields.isPrivate = val.isPrivate;
				this.fields.ownerId = val.ownerId;
				this.fields.comments = val.comments;
				this.fields.subjects = val.subjects;
				this.fields.usageRights = val.usageRights;
				this.changesMade = this.changesMade + 1;
			},
			photoValidChange(val) {
				this.photoValid = val;
			},
			setBody() {
				this.fields.isOtherRecord = this.fields.isOtherRecord
					? this.fields.isOtherRecord
					: false;
				this.fields.isComplete = this.fields.isComplete
					? this.fields.isComplete
					: false;
				this.fields.isPrivate = this.fields.isPrivate
					? this.fields.isPrivate
					: false;

				this.body = {
					name: this.fields.name,

					address: this.fields.address,
					communityId: this.fields.communityId,
					location: this.fields.location,
					nTSMapNumber: this.fields.nTSMapNumber,

					isOtherRecord: this.fields.isOtherRecord,
					bordenRecord: this.fields.bordenRecord,
					archivalRecord: this.fields.archivalRecord,
					paleoRecord: this.fields.paleoRecord,

					creator: this.fields.creator,
					dateCreated: this.fields.dateCreated,
					mediaStorage: this.fields.mediaStorage,
					originalMediaId: this.fields.originalMediaId,
					originalRecord: this.fields.originalRecord,
					photoProjectId: this.fields.photoProjectId,
					program: this.fields.program,

					caption: this.fields.caption,
					creditLine: this.fields.creditLine,
					copyright: this.fields.copyright,
					isComplete: this.fields.isComplete,
					isPrivate: this.fields.isPrivate,
					ownerId: this.fields.ownerId,
					comments: this.fields.comments,
					subjects: this.fields.subjects,
					usageRights: this.fields.usageRights,
				};
			},
			saveChanges() {
				if (!this.valid) {
					this.runFormValidations();
					this.$store.commit("alerts/setText",'Fill in all required fields');
					this.$store.commit("alerts/setType", "warning");
					this.$store.commit("alerts/setTimeout", 5000);
					this.$store.commit("alerts/setAlert", true);
					return null;
				}
				//this.imagesLoaded = false;
				this.infoLoaded = false;
				this.setBody();

				axios
					.put(`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}`, this.body)
					.then(() => {
						this.$router.push(`/photobatches/attributes/view`);
						this.loadBatch();
						//this.loadPhotos();
						this.$store.commit("alerts/setText",'Batch attributes saved');
						this.$store.commit("alerts/setType", "success");
						this.$store.commit("alerts/setTimeout", 5000);
						this.$store.commit("alerts/setAlert", true);
					})
					.catch((err) => {
						this.$store.commit("alerts/setText",err);
						this.$store.commit("alerts/setType", "warning");
						this.$store.commit("alerts/setTimeout", 5000);
						this.$store.commit("alerts/setAlert", true);
					});
			},
			editMode() {
				this.$router.push(`/photobatches/attributes/edit`);
				this.changesMade = 0;
				this.displayName = 'Edit ' + this.fields.name;
			},
			cancelEdit() {
				this.infoLoaded = false;
				//this.imagesLoaded = false;
				this.$router.push(`/photobatches/attributes/view`);
				this.loadBatch();
				//this.loadPhotos();
			},
			runFormValidations() {
				this.$refs.feature.validate();
				this.$refs.siteRecord.validate();
				this.$refs.historicSites.validate();
				this.$refs.photo.validate();
			},
			async processBatch() {
				// Use community to check that fields have been filled in (user can't save without filling out all required fields)
				if (!this.fields.communityId) {
					this.$store.commit("alerts/setText",'Batch attributes must be filled in before processing the batch');
					this.$store.commit("alerts/setType", "warning");
					this.$store.commit("alerts/setTimeout", 5000);
					this.$store.commit("alerts/setAlert", true);
				} else {
					if (
						confirm(
							'When you hit OK this batch and all photos will be added into the photo database. Are you sure you want to process this photo batch?'
						)
					) {
						axios
							.put(
								`${PHOTO_BATCH_URL}/${localStorage.currentBatchId}/process-batch`
							)
							.then(() => {
								this.$router.push(`/photobatches`);
								this.$store.commit("alerts/setText",'Batch processed successfully');
								this.$store.commit("alerts/setType", "success");
								this.$store.commit("alerts/setTimeout", 5000);
								this.$store.commit("alerts/setAlert", true);
							})
							.catch((err) => {
								this.$store.commit("alerts/setText",err);
								this.$store.commit("alerts/setType", "warning");
								this.$store.commit("alerts/setTimeout", 5000);
								this.$store.commit("alerts/setAlert", true);
							});
					}
				}
			},
		},
		computed: {
			mode() {
				return this.$route.params.mode;
			},
			valid() {
				return (
					this.featureValid &&
					this.photoValid &&
					this.siteValid &&
					this.changesMade > 0
				);
			},
		},
	};
</script>

<style scoped>
.scroll {
  height: 200px;
  overflow: auto;
}
</style>