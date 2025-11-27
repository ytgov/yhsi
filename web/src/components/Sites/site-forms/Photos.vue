<template>
	<v-card>
		<div
			v-if="showDefault || photos.length == 0"
			class="center-children"
			style="height: 450px"
		>
			<v-img
				height="200"
				width="200"
				:src="require('../../../assets/add_photo.png')"
				:lazy-src="require('../../../assets/add_photo.png')"
			></v-img>
		</div>
		<Carousell
			v-if="photos.length > 0"
			:photos="photos"
			:showDefault="showDefault"
			@changedSelectedImage="updateSelectedImage"
		/>
		<v-divider></v-divider>
		<v-row v-if="showDefault">
			<v-col cols="12">
				<p class="text-center font-weight-bold pt-3">
					Once you upload your new item data you will be able to attach photos
				</p>
			</v-col>
		</v-row>
		<v-row v-else>
			<v-col
				cols="12"
				class="d-flex"
			>
				<v-dialog
					v-if="isEditing"
					v-model="dialog1"
					max-width="600"
					scrollable
					@click:outside="reset()"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							v-if="isEditing"
							color="success"
							dark
							v-bind="attrs"
							v-on="on"
							class="ml-3"
						>
							<v-icon class="mr-1">mdi-plus</v-icon>
							Add Photo
						</v-btn>
					</template>

					<v-card>
						<v-tabs color="primary">
							<v-tab>Add Photo</v-tab>
							<v-tab>Search Photo Library</v-tab>
							<v-tab-item>
								<v-divider></v-divider>
								<v-container>
									<v-form
										ref="photoForm"
										:lazy-validation="false"
										v-model="valid"
									>
										<v-row>
											<v-col cols="12">
												<v-row>
													<v-col
														cols="12"
														class="d-flex my-0 py-0"
													>
														<v-spacer></v-spacer>
														<v-checkbox
															class="align-self-end"
															label="Private"
															v-model="fields.isPrivate"
														></v-checkbox>
													</v-col>
												</v-row>

												<v-text-field
													outlined
													dense
													v-model="fields.featureName"
													label="Feature Name"
													:rules="generalRules"
												></v-text-field>

												<v-autocomplete
													outlined
													dense
													@click="getOwners"
													v-model="fields.ownerId"
													:items="owners"
													:loading="isLoadingOwner"
													clearable
													label="Owner Name"
													:rules="ownerRules"
													item-text="name"
													item-value="id"
												></v-autocomplete>
												<v-combobox
													outlined
													dense
													v-model="fields.communityId"
													@click="getCommunities"
													:items="availableCommunities"
													clearable
													:loading="isLoadingCommunities"
													item-text="Name"
													item-value="Id"
													label="Community"
													:rules="generalRules"
												>
												</v-combobox>
												<v-combobox
													outlined
													dense
													v-model="fields.originalMediaId"
													@click="getOriginalMedia"
													:items="availableOriginalMedia"
													clearable
													:loading="isLoadingMedias"
													item-text="Type"
													item-value="Id"
													label="Original Media"
													:rules="generalRules"
												>
												</v-combobox>
												<v-combobox
													outlined
													dense
													v-model="fields.copyright"
													:items="copyrightOptions"
													item-value="id"
													item-text="text"
													label="Copyright"
													:rules="generalRules"
												>
												</v-combobox>
												<v-combobox
													outlined
													dense
													v-model="fields.usageRights"
													:items="usageRightOptions"
													ritem-value="id"
													label="Usage Rights"
													:rules="generalRules"
												>
												</v-combobox>
												<v-textarea
													outlined
													v-model="fields.caption"
													dense
													label="Caption"
													rows="2"
												>
												</v-textarea>
												<v-textarea
													v-model="fields.comments"
													outlined
													dense
													label="Comments"
													rows="2"
												>
												</v-textarea>
												<v-textarea
													v-model="fields.creditLine"
													outlined
													dense
													label="Credit Line"
													rows="2"
													:rules="generalRules"
												>
												</v-textarea>

												<v-combobox
													outlined
													dense
													v-model="fields.program"
													:items="programOptions"
													item-value="value"
													item-text="text"
													label="Program Type"
													:rules="generalRules"
												>
												</v-combobox>

												<div class="d-flex">
													<p class="mt-auto mb-auto grey--text text--darken-2">
														Rating
													</p>
													<v-spacer></v-spacer>
													<v-rating
														v-model="fields.rating"
														background-color="orange lighten-3"
														color="orange"
														length="5"
														large
													></v-rating>
												</div>

												<v-file-input
													outlined
													dense
													accept="image/*"
													label="Choose photo for upload"
													prepend-icon="mdi-camera"
													@change="onFileSelected"
													:rules="generalRules"
												></v-file-input>
											</v-col>
											<v-overlay :value="overlay">
												<v-progress-circular
													indeterminate
													size="64"
												></v-progress-circular>
											</v-overlay>
										</v-row>
										<v-divider></v-divider>
										<v-row>
											<v-col
												cols="12"
												class="d-flex"
											>
												<v-btn
													text
													class="ma-1"
													@click="reset()"
												>
													Cancel
												</v-btn>
												<v-spacer></v-spacer>
												<v-btn
													color="primary darken-1"
													text
													class="ma-1"
													@click="validateAndSavePhoto"
												>
													Save
												</v-btn>
											</v-col>
										</v-row>
									</v-form>
								</v-container>
							</v-tab-item>
							<v-tab-item>
								<v-divider></v-divider>
								<v-container class="scroll">
									<v-row>
										<v-col class="d-flex">
											<v-text-field
												outlined
												dense
												v-model="searchPhotos"
												@keyup.enter="getAll"
												label="Search"
											>
											</v-text-field>
											<v-btn
												@click="getAll"
												icon
												class="mt-1 mb-1"
											>
												<v-icon>mdi-magnify</v-icon>
											</v-btn>
										</v-col>
									</v-row>
									<v-row v-if="!availablePhotos && !showSkeletons">
										<v-col cols="12">
											<v-alert
												dense
												prominent
												border="top"
												type="info"
												text
											>
												Search the photo library by
												<strong
													>Community, Address, Place, Feature or File
													Name</strong
												>, then press enter to start the search.
											</v-alert>
										</v-col>
									</v-row>
									<v-row
										class="pr-0"
										v-if="showSkeletons"
									>
										<v-col
											v-for="i in skeletons"
											:key="`ph-${i}`"
											class="d-flex child-flex"
											cols="4"
										>
											<v-sheet
												:color="`grey lighten-4 `"
												class=""
											>
												<v-skeleton-loader
													class="mx-auto"
													max-width="300"
													type="card"
												></v-skeleton-loader>
											</v-sheet>
										</v-col>
									</v-row>
									<v-row
										class="pr-0"
										v-if="!showSkeletons"
									>
										<v-col
											v-for="(item, i) in availablePhotos"
											:key="`ph-${i}`"
											class="d-flex child-flex"
											cols="4"
										>
											<v-hover>
												<template v-slot:default="{ hover }">
													<v-card
														outlined
														hover
													>
														<v-img
															:src="item.ThumbFile.base64"
															:lazy-src="item.ThumbFile.base64"
															aspect-ratio="1"
															class="grey lighten-2"
														></v-img>

														<v-row>
															<v-col
																cols="12"
																class="d-flex"
															>
																<v-card-text
																	v-if="item.caption"
																	class="text-truncate text-caption"
																>
																	{{ item.caption }}
																</v-card-text>
																<v-card-text
																	v-else
																	class="text-caption"
																>
																	No caption
																</v-card-text>
															</v-col>
														</v-row>
														<v-fade-transition>
															<v-overlay
																v-if="hover"
																absolute
																color="#036358"
															>
																<!-- @click="selectImage(item)" -->
																<v-checkbox
																	v-model="item.selected"
																></v-checkbox>
															</v-overlay>
														</v-fade-transition>
													</v-card>
												</template>
											</v-hover>
										</v-col>
									</v-row>
								</v-container>
								<v-row
									class="mb-2"
									v-if="availablePhotos"
								>
									<v-col>
										<div class="text-center">
											<v-pagination
												v-model="page"
												:length="numberOfPages"
												:total-visible="5"
											></v-pagination>
										</div>
									</v-col>
								</v-row>
								<v-divider></v-divider>
								<v-row class="">
									<v-col
										cols="12"
										class="d-flex"
									>
										<v-btn
											text
											class="ma-1"
											@click="reset()"
										>
											Cancel
										</v-btn>
										<v-spacer></v-spacer>
										<v-btn
											color="primary darken-1"
											text
											class="ma-1"
											@click="saveAndLink"
										>
											Save and Link
										</v-btn>
									</v-col>
								</v-row>
							</v-tab-item>
						</v-tabs>
					</v-card>
				</v-dialog>

				<v-spacer></v-spacer>

				<PhotoList :photos="photos" />
			</v-col>
		</v-row>
	</v-card>
</template>

<script>
import catalogs from '../../../controllers/catalogs';
import Carousell from '../../PhotoEditor/Carousell.vue';
import PhotoList from '../../PhotoEditor/PhotoList.vue';
import {
	//EXTRA_PHOTOS_URL,
	STATIC_URL,
} from '../../../urls';
import axios from 'axios';
import photos from '../../../controllers/photos';
import { mapActions } from 'vuex';

export default {
	name: 'Photos',
	components: { Carousell, PhotoList },
	props: ['placeId', 'showDefault'],
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	data: () => ({
		overlay: false,
		//search variables
		searchPhotos: null,
		availablePhotos: null,
		numberOfPages: 10,
		page: 1,
		showSkeletons: false,
		skeletons: [1, 2, 3, 4, 5, 6],
		dialog1: false,
		photos: [],
		//form variables
		fields: {
			caption: '',
			featureName: '',
			ownerId: null,
			usageRights: null,
			communityId: null,
			comments: '',
			creditLine: '',
			originalMediaId: null,
			copyright: null,
			program: null,
			rating: 1,
			isPrivate: 0,
		},
		sendObj: null,
		//selection options
		usageRightOptions: [
			{
				id: 0,
				text: 'Non reuse permitted',
			},
			{
				id: 1,
				text: 'Non-commercial reuse permitted',
			},
		],
		copyrightOptions: [
			{
				id: 1,
				text: 'Use Credit Line',
			},
			{
				id: 2,
				text: 'No reproduction without permission from Archives',
			},
			{
				id: 3,
				text: 'No reproduction without permission from donor',
			},
			{
				id: 4,
				text: 'No reproduction for commercial purposes',
			},
			{
				id: 5,
				text: 'Incomplete Image Information - check ownership',
			},
			{
				id: 6,
				text: 'Use Owner',
			},
		],
		programOptions: [
			{
				text: 'General',
				value: 1,
			},
			{
				text: 'HPAC',
				value: 2,
			},
			{
				text: 'Interpretation',
				value: 3,
			},
			{
				text: 'YHSI',
				value: 4,
			},
			{
				text: 'Place',
				value: 5,
			},
		],
		availableCommunities: [],
		availableOriginalMedia: [],
		file: false,
		isLoadingCommunities: false,
		isLoadingMedias: false,
		isLoadingOwner: false,
		owners: [],
		helperOwner: '',
		//helps to validate if the data in the form is correct and the post can be made
		valid: false,
		//input rules
		ownerRules: [(v) => !!v || 'Owner Name is required'],
		generalRules: [(v) => !!v || 'This field is required'],
		loadingData: false,
	}),
	mounted() {
		if (this.showDefault) return;

		if (this.placeId) this.getDataFromAPI();
	},
	methods: {
		...mapActions('places', ['savePhoto']),
		async getAll() {
			this.showSkeletons = true;

			let resp = await photos.getAll(this.page, this.searchPhotos, true);
			if (resp) {
				this.availablePhotos = resp.body.map((x) => {
					x.ThumbFile.base64 = `data:image/png;base64,${this.toBase64(
						x.ThumbFile.data
					)}`;
					x.selected = false;
					return x;
				});
				this.numberOfPages = Math.ceil(resp.count / 6);
				this.showSkeletons = false;
			}
		},
		async getDataFromAPI() {
			let resp = await photos.getGeneral('place', this.placeId);
			if (resp) {
				this.photos = resp.data.map((x) => {
					x.ThumbFile.base64 = `data:image/png;base64,${this.toBase64(
						x.ThumbFile.data
					)}`;
					//x.File.base64 = `data:image/png;base64,${this.toBase64(x.File.data)}`;
					x.selected = false;
					return x;
				});
				this.updateSelectedImage(0);
			}
			/*axios //${EXTRA_PHOTOS_URL}
        .get(`/api/photos/place/${this.placeId}`)
        .then((resp) => {
          if (resp) {
            this.photos = resp.data.map((x) => {
              x.ThumbFile.base64 = `data:image/png;base64,${this.toBase64(x.ThumbFile.data)}`;
              //x.File.base64 = `data:image/png;base64,${this.toBase64(x.File.data)}`;
              x.selected = false;
              return x;
            });
            this.updateSelectedImage(0);
          }
        })
        .catch((error) => console.error(error))
        ; */
		},
		async getOwners() {
			this.isLoadingOwner = true;
			axios
				.get(`${STATIC_URL}/photo-owner`)
				.then((resp) => {
					if (resp) {
						this.owners = resp.data.data
							.slice()
							.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
						this.isLoadingOwner = false;
					}
				})
				.catch((error) => console.error(error));
		},
		async validateAndSavePhoto() {
			this.$refs.photoForm.validate();
			if (!this.valid) return;

			this.overlay = true;
			
			this.sendObj = this.fields;
			this.sendObj.file = this.file;
			this.sendObj.placeId = Number(this.placeId);

			await this.savePhoto(this.sendObj);
			this.overlay = false;
		},
		async saveAndLink() {
			this.overlay = true;
			let photosToLink = this.availablePhotos
				.filter((x) => x.selected == true)
				.map((x) => {
					return x.RowId;
				});
			await photos.linkGeneral('place', this.placeId, {
				linkPhotos: photosToLink,
			});
			this.reset();
			this.overlay = false;
			this.$router.go();
			// axios
			//   .post(`${EXTRA_PHOTOS_URL}/place/link/${this.placeId}`, { linkPhotos: photosToLink })
			//   .then(() => {
			//     this.reset();
			//     this.$router.go();
			//   })
			//   .catch((error) => console.error(error))
			//   ;
		},
		toBase64(arr) {
			return btoa(
				arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
		},
		async onFileSelected(event) {
			this.file = event;
		},
		getBase64(file) {
			//this function is not used currently
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function () {};
			reader.onerror = function (error) {
				console.error(error);
			};
		},
		validate() {
			this.$refs.photoForm.validate();
		},
		reset() {
			this.dialog1 = false;
			this.$refs.photoForm.reset();
		},
		resetValidation() {
			this.$refs.photoForm.resetValidation();
		},
		async getCommunities() {
			this.isLoadingCommunities = true;
			let data = await catalogs.getCommunities();
			this.availableCommunities = data;
			this.isLoadingCommunities = false;
		},
		async getOriginalMedia() {
			this.isLoadingMedias = true;
			let data = await catalogs.getOriginalMedia();
			this.availableOriginalMedia = data;
			this.isLoadingMedias = false;
		},
		selectImage(item) {
			let index = this.availablePhotos.indexOf(item);
			if (index > -1) {
				if (this.availablePhotos[index].selected) {
					this.availablePhotos[index].selected = false;
				} else {
					this.availablePhotos[index].selected = true;
				}
			}
		},
		updateSelectedImage(val) {
			//updates the carousell selected image
			this.$emit('updateSelectedImage', this.photos[val]);
		},
		loadingPhotosChange(val) {
			this.$emit('loadingPhotosChange', val);
		},
	},
	watch: {
		page() {
			this.getAll();
		},
	},
};
</script>

<style scoped>
.scroll {
	height: 720px;
	overflow: auto;
}
.center-children {
	display: grid;
	place-items: center;
}
</style>
