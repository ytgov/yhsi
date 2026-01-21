<!-- 
Photo create dialog form for a generic record type

Supported records:
- place
- (untested) boat
- (untested) aircrash
- ytplace
- (untested) burial
- (untested) interpretive-sites
- people
-->
<template>
  <v-dialog 
    v-model="dialog"
    max-width="600"
    scrollable
  >
    <v-card>
      <v-tabs color="primary">
        <v-tab>Add Photo</v-tab>
        <v-tab>Search Photo Library</v-tab>
        <v-tab-item>
          <v-container>
            <v-form ref="formRef">
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
                    v-model="fields.FeatureName"
                    label="Feature Name"
                    :rules="generalRules"
                  ></v-text-field>
                  <v-autocomplete
                    v-model="fields.ownerId"
                    :items="photoOwners"
                    item-value="id"
                    item-text="name"
                    label="Owner Name"
                    clearable
                    dense
                    outlined
                    :rules="ownerRules"
                    :loading="isLoadingOwner"
                    @click="getPhotoOwners"
                  ></v-autocomplete>
                  <v-combobox
                    v-model="fields.communityId"
                    :items="availableCommunities"
                    item-value="Id"
                    item-text="Name"
                    outlined
                    dense
                    clearable
                    :loading="isLoadingCommunities"
                    label="Community"
                    :rules="generalRules"
                    @click="getCommunities"
                  >
                  </v-combobox>
                  <v-combobox
                    v-model="fields.originalMediaId"
                    outlined
                    dense
                    :items="availableOriginalMedia"
                    clearable
                    :loading="isLoadingMedias"
                    item-text="Type"
                    item-value="Id"
                    label="Original Media"
                    :rules="generalRules"
                    @click="getOriginalMedia"
                  >
                  </v-combobox>
                  <v-combobox
                    v-model="fields.copyright"
                    outlined
                    dense
                    :items="copyrightOptions"
                    item-value="id"
                    item-text="text"
                    label="Copyright"
                    :rules="generalRules"
                  >
                  </v-combobox>
                  <v-combobox
                    v-model="fields.usageRights"
                    :items="usageRightOptions"
                    item-value="id"
                    outlined
                    dense
                    label="Usage Rights"
                    :rules="generalRules"
                  >
                  </v-combobox>
                  <v-textarea
                    v-model="fields.Caption"
                    outlined
                    dense
                    label="Caption"
                    rows="2"
                  >
                  </v-textarea>
                  <v-textarea
                    v-model="fields.Comments"
                    outlined
                    dense
                    label="Comments"
                    rows="2"
                  >
                  </v-textarea>
                  <v-textarea
                    v-model="fields.CreditLine"
                    outlined
                    dense
                    label="Credit Line"
                    rows="2"
                    :rules="generalRules"
                  >
                  </v-textarea>

                  <v-combobox
                    v-model="fields.program"
                    outlined
                    dense
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
                      v-model="fields.Rating"
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
                    :rules="generalRules"
                    @change="onFileSelected"
                  ></v-file-input>
                </v-col>
                <v-overlay :value="isLoading">
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
                    @click="reset"
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
          <v-container class="scroll">
            <v-row>
              <v-col class="d-flex">
                <v-text-field
                  label="Search"
                  outlined
                  dense
                  @keyup.enter="searchForAvailablePhotos"
                >
                </v-text-field>
                <v-btn
                  icon
                  class="mt-1 mb-1"
                  @click="searchForAvailablePhotos"
                >
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <div
              v-if="availablePhotosForLink.length === 0 && !isLoadingPhotosForLink"
            >
              <v-row>
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
            </div>
            <div
              v-if="isLoadingPhotosForLink"
            >
              <v-row>
                <v-col
                  v-for="i in [1,2,3,4,5,6]"
                  :key="i"
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
            </div>
            <div
              v-if="!isLoadingPhotosForLink"
            >
              <v-row>
                <v-col
                  v-for="(item, i) in availablePhotosForLink"
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
                              v-if="item.Caption"
                              class="text-truncate text-caption"
                            >
                              {{ item.Caption }}
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
            </div>
          </v-container>
          <v-row
            v-if="availablePhotosForLink.length > 0"
            class="mb-2"
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
          <v-row>
            <v-col
              cols="12"
              class="d-flex"
            >
              <v-btn
                text
                class="ma-1"
                @click="reset"
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
</template>

<script>
import { isNil } from 'lodash';
import axios from 'axios';

import { STATIC_URL } from '@/urls'

import catalogs from "@/controllers/catalogs"
import photos from '@/controllers/photos';
import { api } from "@/controllers/config"

export default {
  name: 'GenericRecordAddOrLinkPhotoDialog',
  props: {
    record: {
      type: String,
      required: true,
    },
    recordId: {
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    isCreating: false,
    fields: {
			Caption: '',
			FeatureName: '',
			ownerId: null,
			usageRights: null,
			communityId: null,
			Comments: '',
			CreditLine: '',
			photoProjectId: 0,
			isOtherRecord: 0,
			originalMediaId: null,
			mediaStorage: 4,
			copyright: null,
			program: null,
			isComplete: false,
      isSiteDefault: false,
			Rating: 1,
			isPrivate: 0,
    },
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
    isLoadingCommunities: false,
		availableOriginalMedia: [],
    isLoadingMedias: false,
    photoOwners: [],
    isLoadingOwner: false,
    ownerRules: [(v) => !!v || 'Owner Name is required'],
		generalRules: [(v) => !!v || 'This field is required'],
    file: false,
    search: null,
    availablePhotosForLink: [],
    isLoadingPhotosForLink: false,
    numberOfPages: 10,
		page: 1,
    isLinking: false,
  }),
  methods: {
    show(){
      this.dialog = true
    },
    close(){
      this.reset()
    },
    reset(){
      this.dialog = false
      this.$refs.formRef.reset()
    },
    async getCommunities() {
			this.isLoadingCommunities = true;
			this.availableCommunities = await catalogs.getCommunities();
			this.isLoadingCommunities = false;
		},
		async getOriginalMedia() {
			this.isLoadingMedias = true;
			this.availableOriginalMedia = await catalogs.getOriginalMedia();
			this.isLoadingMedias = false;
		},
    async getPhotoOwners() {
			this.isLoadingOwner = true;
      try {
        const { data } = await axios.get(`${STATIC_URL}/photo-owner`)
        this.photoOwners = data.data.slice().sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingOwner = false;
      }
		},
    async onFileSelected(event) {
      this.file = event;
    },
    async validateAndSavePhoto(){
      const valid = this.$refs.formRef.validate()
			if (!valid) return

      switch (this.record) {
        case 'place':
        case 'boat':
        case 'aircrash':
        case 'ytplace':
        case 'burial':
        case 'interpretive-sites':
        case 'people':
          break;
        default:
          throw new Error('Invalid record type');
      }

      if(isNil(this.file)){
        throw new Error('No file selected')
      }

      this.isCreating = true

      const sendObject = this.fields
      const {
        isComplete,
        program,
        communityId,
        copyright,
        originalMediaId,
        usageRights,
      } = sendObject

      sendObject.isComplete = isComplete ? 1 : 0;
			sendObject.program = program.value;
			sendObject.communityId = communityId.Id;
			sendObject.copyright = copyright.id;
			sendObject.originalMediaId = originalMediaId.Id;
			sendObject.usageRights = usageRights.id;

      try {
        const formData = new FormData()
        const prevFields = Object.entries(sendObject)
        for (let i = 0; i < prevFields.length; i++) {
          if (prevFields[i][1] != null && prevFields[i][1] != 'undefined') {
						formData.append(prevFields[i][0], prevFields[i][1]);
					}
        }
        formData.append('file', this.file);

        // _TODO_ maybe worth fixing backend so it doesnt return array?
        const { data } = await api.post(`/photo/`, formData)
        // eslint-disable-next-line no-unused-vars
        const { ThumbFile, ...photoData } = data.data[0]

        await api.post(`/${this.record}/${this.recordId}/photos/link`,
          {
            linkPhotos: [photoData]
          }
        )
        
        this.$store.commit(
          'alerts/setText',
          'Photo created successfully'
        );
        this.$store.commit('alerts/setType', 'success');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);

        this.reset()
			  this.$router.go(0)
      } catch (error){
        console.error(error)
        this.$store.commit('alerts/setText', error);
        this.$store.commit('alerts/setType', 'warning');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
      } finally {
        this.isCreating = false
      }
    },
    async searchForAvailablePhotos(){
      this.isLoadingPhotosForLink = true;

			let resp = await photos.getAll(this.page, this.searchPhotos);
			if (resp) {
				this.availablePhotosForLink = resp.body.map((x) => {
					x.ThumbFile.base64 = `data:image/png;base64,${this.toBase64(
						x.ThumbFile.data
					)}`;
					x.selected = false;
					return x;
				});
				this.numberOfPages = Math.round(resp.count / 6);

				this.isLoadingPhotosForLink = false;
			}
    },
    toBase64(arr) {
			return btoa(
				arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
		},
    async saveAndLink(){
      switch (this.record) {
        case 'place':
        case 'boat':
        case 'aircrash':
        case 'ytplace':
        case 'burial':
        case 'interpretive-sites':
        case 'people':
          break;
        default:
          throw new Error('Invalid record type');
      }
      
      this.isLinking = true;
      
      try {
        const photosToLink = this.availablePhotosForLink
				.filter((photo) => photo.selected == true)
				.map((photo) => {
					return { rowId: photo.RowId };
				});

        await api.post(`/${this.record}/${this.recordId}/photos/link`, {
          linkPhotos: photosToLink
        })

        this.$store.commit(
          'alerts/setText',
          'Photo associated with record successfully'
        );
        this.$store.commit('alerts/setType', 'success');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);

        this.reset()
        this.$router.go(0)
      } catch(error){
        this.$store.commit('alerts/setText', error);
        this.$store.commit('alerts/setType', 'warning');
        this.$store.commit('alerts/setTimeout', 5000);
        this.$store.commit('alerts/setAlert', true);
      } finally {
        this.isLinking = false;
      }
    }
  },
  computed: {
    isLoading(){
      return this.isCreating || this.isLoadingCommunities || this.isLoadingMedias || this.isLoadingOwner || this.isLinking;
    }
  },
  watch: {
    page() {
      this.searchForAvailablePhotos();
    },
  }
}
</script>

<style scoped>
.scroll {
	height: 720px;
	overflow: auto;
}
</style>
