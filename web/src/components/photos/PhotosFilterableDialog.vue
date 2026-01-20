<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <div class="d-flex">
        <v-card-title>All Photos</v-card-title>
        <v-spacer />
        <v-menu right bottom>
          <template v-slot:activator="{ on: onMenu, attrs: menuAttrs }">
            <v-tooltip left>
              <template v-slot:activator="{ on: onTooltip, attrs: toolAttrs }">
                <v-btn
                  class="mt-auto mb-auto mr-4"
                  icon
                  elevation="0"
                  v-bind="{ ...menuAttrs, ...toolAttrs }"
                  v-on="{ ...onMenu, ...onTooltip }"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <span>Show image text as:</span>
            </v-tooltip>
          </template>

          <v-list>
            <v-list-item-group v-model="selectedFilter" color="primary">
              <v-list-item
                v-for="(item, i) in filters"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
        
      <v-divider />

      <v-container class="scroll">
          <v-row>
            <v-col>
              <v-text-field
                v-model="search"
                outlined
                dense
                label="Search"
              />
            </v-col>
          </v-row>
          <v-row>
            <div v-if="photosIsEmpty">
              <v-col cols="12">
                <v-alert dense prominent border="top" type="info" text>
                  You can view all the <strong>linked</strong> place photos here.
                </v-alert>
              </v-col>
            </div>
          </v-row>
          <v-row>
            <v-col
              v-for="(photo, index) of filteredPhotos"
              :key="index"
              cols="4"
              class="d-flex child-flex"
            >
              <v-card outlined hover>
                <v-img
                  :src="photo.ThumbFile.base64"
                  :lazy-src="photo.ThumbFile.base64"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-row>
                  <v-col cols="12" class="d-flex">
                    <v-card-text
                      v-if="photo[filters[selectedFilter].value]"
                      class="text-truncate text-caption"
                    >
                      {{ photo[filters[selectedFilter].value] }}
                    </v-card-text>
                    <v-card-text v-else class="text-caption">
                      No {{ filters[selectedFilter].text }} Available
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { isEmpty, isNil } from 'lodash';

export default {
  name: 'PhotosFilterableDialog',
  props: {
    photos: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    dialog: false,
    search: null,
    selectedFilter: 1,
    filters: [
      { text: "Address", value: "Address" },
      { text: "Caption", value: "Caption" },
      { text: "Community", value: "CommunityName" },
      { text: "File Name", value: "OriginalFileName" },
      { text: "Place", value: "PrimaryName" },
      { text: "Feature Name", value: "FeatureName" },
    ]
  }),
  methods: {
    show(){
      this.dialog = true;
    },
    close(){
      this.dialog = false;
    }
  },
  computed: {
    photosIsEmpty() {
      return isEmpty(this.photos);
    },
    filteredPhotos() {
      if(isEmpty(this.photos)) return [];
      
      if(!isNil(this.search)){
        const filters = this.filters.slice(0)
        const photos = this.photos.slice(0);
        const filteredPhotos = photos.filter((photo) =>
          photo[filters[this.selectedFilter].value]
            ? photo[filters[this.selectedFilter].value]
                .toLowerCase()
                .includes(this.search.toLowerCase())
            : false
        );

        return filteredPhotos;
      }

      return this.photos;
    }
  }
}
</script>

<style scoped>
.scroll {
  height: 720px;
  overflow: auto;
}
</style>
