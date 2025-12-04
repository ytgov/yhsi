<template>
	<div>
		<h1>Batch Attributes</h1>
		<Breadcrumbs />
		<v-row>
      <v-col cols="12" class="d-flex">
        <h1>{{displayName}}</h1>
        <v-spacer></v-spacer>       
        <v-btn
					class="black--text mx-1 form-header"
					@click="goBack"
				>
					<v-icon class="mr-1">mdi-arrow-left</v-icon>
					Go Back
				</v-btn>
        <v-btn class="mx-1 form-header" color="primary" @click="editMode()">
          <v-icon class="mr-1">mdi-pencil</v-icon>
          Edit
        </v-btn>
				<v-btn
					class="mx-1 form-header"
					color="secondary"
					@click="processBatch()"
				>
					<v-icon class="mr-1">mdi-check</v-icon>
					Process Batch
				</v-btn>      
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

		<PhotoBatchProcessBatchDialog ref="photoBatchProcessBatchDialog"/>
	</div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

import { PHOTO_BATCH_URL } from '../../../urls';

import Breadcrumbs from '../../Breadcrumbs';

import PhotoBatchProcessBatchDialog from "./PhotoBatchProcessBatchDialog";
import Feature from '../PhotosComponents/Feature';
import SiteRecord from '../PhotosComponents/SiteRecord';
import HistoricSites from '../PhotosComponents/HistoricSites';
import Photo from '../PhotosComponents/Photo';

export default {
	name: 'PhotoBatchAttributes',
	components: { Feature, SiteRecord, HistoricSites, Photo, Breadcrumbs, PhotoBatchProcessBatchDialog },
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
		editMode() {
			this.$router.push(`/photobatches/attributes/edit`);
			this.changesMade = 0;
			this.displayName = 'Edit ' + this.fields.name;
		},
		async processBatch() {
			this.$refs.photoBatchProcessBatchDialog.openDialog();
		},
		runFormValidations() {
			this.$refs.feature.validate();
			this.$refs.siteRecord.validate();
			this.$refs.historicSites.validate();
			this.$refs.photo.validate();
		},
		goBack() {
			this.$router.push(`/photobatches`);
		},
	},
	computed: {
		...mapGetters({
			batchId: 'photos/batchId',
		}),
		mode() {
			return "view";
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
	max-height: 340px;
	overflow: auto;
}
</style>
