<template>
	<div>
		<h1>Edit Batch Attributes</h1>
		<Breadcrumbs />
		<v-row>
			<v-col
				cols="12"
				class="d-flex"
			>
				<h1>{{ displayName }}</h1>
				<v-spacer></v-spacer>
				<v-btn
					class="black--text mx-1 form-header"
					@click="goBack"
				>
					<v-icon class="mr-1">mdi-arrow-left</v-icon>
					Go Back
				</v-btn>

				<v-btn
					color="primary"
					:disabled="changesMade == 0"
					@click="saveChanges"
					class="form-header"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Save Changes
				</v-btn>

				<v-btn class="mx-1 form-header" color="red" @click="deleteBatch()">
          <v-icon class="mr-1">mdi-close</v-icon>
          Remove Batch
        </v-btn> 
			</v-col>
		</v-row>

		<v-row>
      <v-col cols="6">
        <v-img 
          class="mr-auto ml-auto"
          max-width="128"
          :src="require('../../../assets/add_photo.png')">
          </v-img>

        <v-file-input
          ref="fileupload"
          label="Choose photo to upload"
          prepend-icon="mdi-camera"
          accept="image/*"
          @change="onFileSelection"
          class="default mb-5" 
          dense
          outlined
          background-color="white"
          hide-details
					multiple
        ></v-file-input>
      </v-col>
    </v-row>

		<v-row
			v-if="imagesLoaded"
			class="scroll"
		>
			<v-col
				v-for="(item, i) in photos"
				:key="`photo-${i}`"
				class="d-flex child-flex"
				cols="2"
			>
				<v-btn
					icon
					color="orange"
					@click="deletePhoto(item.id)"
					class="delete-photo-btn"
					>
					<v-icon size="40">mdi-close-circle</v-icon>
				</v-btn>
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
			<v-col v-if="photos.length == 0">
				<div class="loading">No images found</div>
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
import { mapGetters } from 'vuex';

import { PHOTO_BATCH_URL } from '../../../urls';

import Breadcrumbs from '../../Breadcrumbs';

import Feature from '../PhotosComponents/Feature';
import SiteRecord from '../PhotosComponents/SiteRecord';
import HistoricSites from '../PhotosComponents/HistoricSites';
import Photo from '../PhotosComponents/Photo';

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
				.get(`${PHOTO_BATCH_URL}/${this.batchId}`)
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
				.get(`${PHOTO_BATCH_URL}/${this.batchId}/photos`)
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
		async deletePhoto(photoId) {
			console.log("Deleting photo: ", photoId);
			if(confirm("Are you sure want to delete this photo?")){
				await axios
					.delete(`${PHOTO_BATCH_URL}/photo/${photoId}`)
					.then(() => {
						this.loadPhotos();
						this.$store.commit("alerts/setText",'Photo deleted');
            this.$store.commit("alerts/setType", "success");
            this.$store.commit("alerts/setTimeout", 5000);
            this.$store.commit("alerts/setAlert", true);
					})
					.catch((error) => console.error(error));
			}
		},
		deleteBatch() {
      if(confirm("Are you sure want to delete this photo batch?")){
        axios
          .delete(`${PHOTO_BATCH_URL}/${this.batchId}`)
          .then(() => { 
            this.$router.push('/photobatches');
            this.$store.commit("alerts/setText",'Batch deleted');
            this.$store.commit("alerts/setType", "success");
            this.$store.commit("alerts/setTimeout", 5000);
            this.$store.commit("alerts/setAlert", true);
          })
          .catch((error) => console.error(error))
          ;  
      }
    },
		goBack() {
			this.$router.push(`/photobatches/attributes`);
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
				this.$store.commit('alerts/setText', 'Fill in all required fields');
				this.$store.commit('alerts/setType', 'warning');
				this.$store.commit('alerts/setTimeout', 5000);
				this.$store.commit('alerts/setAlert', true);
				return null;
			}
			//this.imagesLoaded = false;
			this.infoLoaded = false;
			this.setBody();

			axios
				.put(`${PHOTO_BATCH_URL}/${this.batchId}`, this.body)
				.then(() => {
					this.$router.push(`/photobatches/attributes`);
					this.loadBatch();
					this.loadPhotos();
					this.$store.commit('alerts/setText', 'Batch attributes saved');
					this.$store.commit('alerts/setType', 'success');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				})
				.catch((err) => {
					this.$store.commit('alerts/setText', err);
					this.$store.commit('alerts/setType', 'warning');
					this.$store.commit('alerts/setTimeout', 5000);
					this.$store.commit('alerts/setAlert', true);
				});
		},
		cancelEdit() {
			this.infoLoaded = false;
			//this.imagesLoaded = false;
			this.$router.push(`/photobatches/attributes`);
			this.loadBatch();
			//this.loadPhotos();
		},
		runFormValidations() {
			this.$refs.feature.validate();
			this.$refs.siteRecord.validate();
			this.$refs.historicSites.validate();
			this.$refs.photo.validate();
		},
		async onFileSelection(event){
			if(!event) return

			const files = Array.isArray(event) ? event : [event];

			for (const file of files){
				this.uploadFile = file;
				let body = {};
				body.photoBatchId = this.batchId;
				body.photoContentType = this.uploadFile.type;

				const formData = new FormData();
				let prevFields = Object.entries(body);
				for (let i = 0; i < prevFields.length; i++) {
					if(prevFields[i][1] != null && prevFields[i][1] != 'undefined') {
						formData.append(prevFields[i][0], prevFields[i][1]);
					}
				}
				formData.append("file", this.uploadFile);
				//console.log(this.uploadFile);
				await axios
				.post(`${PHOTO_BATCH_URL}/photo/`, formData)
					.then((resp) => {
						let photo = resp.data.data[0];
						photo.thumbFile.base64 = `data:image/png;base64,${this.toBase64(photo.thumbFile.data)}`;
						this.photos.push(photo);
						this.$refs.fileupload.reset();
						this.$store.commit("alerts/setText",'Photo added');
						this.$store.commit("alerts/setType", "success");
						this.$store.commit("alerts/setTimeout", 5000);
						this.$store.commit("alerts/setAlert", true);
					})
					.catch(() => {
						this.$store.commit("alerts/setText",'Error during photo upload');
						this.$store.commit("alerts/setType", "warning");
						this.$store.commit("alerts/setTimeout", 5000);
						this.$store.commit("alerts/setAlert", true);
					});
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
		...mapGetters({
			batchId: 'photos/batchId',
		}),
	},
};
</script>

<style scoped>
.scroll {
	max-height: 340px;
	overflow: auto;
}	

.delete-photo-btn {
	z-index: 10;
	position: relative;
	top: 25%;
	left: 50%;
}
</style>
