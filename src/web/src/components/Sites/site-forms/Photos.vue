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
			Photos
		</v-card-title>
		<v-card-text tag="section">
			<v-row>
				<v-col cols="12">
					<v-text-field
						v-model="categoryOfProperty"
						label="Category of Property"
						dense
						outlined
						background-color="white"
						:readonly="!isEditing"
					/>
				</v-col>
			</v-row>
			<v-card
				class="default mb-0"
				tag="section"
			>
				<v-card-title
					tag="h3"
					class="mb-0 text-h6"
				>
					Photos
				</v-card-title>
				<v-card-text tag="form">
					<v-row>
						<v-col
							v-for="(item, index) in photos"
							:key="`photo-${index + 1}`"
							cols="12"
							md="6"
						>
							<v-card>
								<div style="width: 100%; overflow-x: hidden">
									<v-img
										v-if="item.img"
										height="250px"
										:src="item.img"
										placeholder="No image selected"
										aspect-ratio=".5"
									/>
									<v-img
										v-else
										height="250px"
										:src="makeThumbnailUrl(item)"
									/>
								</div>
								<v-divider />
								<v-card-text>
									<v-file-input
										v-if="isEditing"
										v-model="item.file"
										:id="`fi-${index}`"
										label="Upload image"
										prepend-inner-icon="mdi-camera"
										prepend-icon=""
										accept="image/*"
										dense
										outlined
										background-color="white"
										@change="onFileSelection($event, index)"
									/>

									<v-text-field
										v-model="item.featureName"
										label="Feature name"
										dense
										outlined
										background-color="white"
										:readonly="!isEditing"
									/>

									<v-text-field
										v-model="item.caption"
										label="Caption"
										dense
										outlined
										background-color="white"
										:readonly="!isEditing"
									/>

									<v-text-field
										v-model="item.comments"
										label="Comments"
										dense
										outlined
										background-color="white"
										:readonly="!isEditing"
									/>

									<v-text-field
										v-model="item.creditLine"
										label="Credit line"
										dense
										outlined
										background-color="white"
										:readonly="!isEditing"
									/>

									<v-text-field
										v-model="item.location"
										label="Location"
										dense
										outlined
										background-color="white"
										:readonly="!isEditing"
									/>

									<div class="d-flex">
										<v-btn
											color="primary"
											small
											title="Download"
											class="my-0 mr-3"
											@click="downloadPhoto(item)"
										>
											<v-icon>mdi-download</v-icon>
										</v-btn>
										<v-btn
											color="info"
											small
											title="open"
											class="my-0 mr-3"
											@click="openPhotoPage(item)"
										>
											<v-icon>mdi-open-in-new</v-icon>
										</v-btn>

										<v-spacer />

										<!-- <v-btn
											v-if="isEditing"
											color="warning"
											small
											title="Remove"
											class="my-0"
											@click="removePhoto(index)"
										>
											<v-icon>mdi-delete</v-icon>
										</v-btn> -->
									</div>
								</v-card-text>
							</v-card>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-btn
						v-if="isEditing"
						class="my-0"
						color="primary"
						@click="addPhoto"
					>
						Add Photo
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-card-text>
		<v-card-actions>
			<v-spacer />
			<v-btn
				v-if="isEditing"
				class="my-0"
				color="primary"
				@click="save"
			>
				Save
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import axios from 'axios';

import store from '@/store';
import { PLACE_URL, PHOTO_URL } from '@/urls';
import { mapActions } from 'vuex';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
	name: 'Photos',
	data: () => ({
		valid: false,
		generalRules: [
			(v) => !!v || 'This input is required',
			(v) => v.length <= 20 || 'This input must be less than 20 characters',
		],

		photos: [],

		/* Placeholder variables below this line **Read above** */
		categoryOfProperty: '',
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	created: function () {
		let id = this.$route.params.id;

		axios
			.get(`${PLACE_URL}/${id}`)
			.then((resp) => {
				this.fields = resp.data.data;
				this.photos = resp.data.relationships.photos.data;
				store.dispatch('addSiteHistory', resp.data.data);
			})
			.catch((error) => console.error(error));
	},
	methods: {
		...mapActions('places', ['savePhotos']),
		addPhoto() {
			this.photos.push({});
		},
		removePhoto(index) {
			this.photos.splice(index, 1);
		},
		onFileSelection(event, i) {
			if (event) {
				//this.fields.photos[i].img = URL.createObjectURL(event.target.files[0]);
				this.photos[i].img = URL.createObjectURL(event);
			} else {
				this.photos[i].img = null;
			}
		},
		async save() {
			await this.savePhotos(this.photos);
		},
		makeThumbnailUrl(photo) {
			return `${PHOTO_URL}/${photo.rowId}/thumbfile`;
		},
		makePhotoUrl(photo) {
			return `${PHOTO_URL}/${photo.rowId}/thumbfile`;
		},

		downloadPhoto(item) {
			console.log(item);
			window.open(`${PHOTO_URL}/${item.rowId}/file/download`);
		},

		openPhotoPage(item) {
			localStorage.setItem('currentRowId', item.rowId);
			this.$store.commit('photos/setRowId', item.rowId);
			window.open(`/photos/view`);
		},
	},
};
</script>

<style scoped>
#backgroundimgsw {
	background-image: '../../assets/greyimg.jpg';
}
.center-img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 50%;
}
.divback {
	background-image: url('../../../assets/add_photo.png');
	width: 100px;
	height: 100px;
}
</style>
