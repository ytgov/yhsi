<template>
  <v-dialog v-model="dialog2" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="success" dark v-bind="attrs" v-on="on" class="mr-3">
        <v-icon class="mr-1">mdi-view-grid</v-icon>
        View all Photos
      </v-btn>
    </template>
    <v-card>
      <div class="d-flex">
        <v-card-title> All Photos </v-card-title>
        <v-spacer></v-spacer>

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
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
      </div>
      <v-divider></v-divider>
      <v-container class="scroll">
        <v-row>
          <v-col>
            <v-text-field v-model="searchPhotos" outlined dense label="Search"> </v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="photos.length < 1">
          <v-col cols="12">
            <v-alert dense prominent border="top" type="info" text>
              You can view all the <strong>linked</strong> boat photos here.
            </v-alert>
          </v-col>
        </v-row>
        <v-row class="pr-0">
          <v-col
            v-for="(item, i) in filteredPhotos"
            :key="`ph-${i}`"
            class="d-flex child-flex"
            cols="4"
          >
            <v-card outlined hover>
              <v-img
                :src="item.File.base64"
                :lazy-src="item.File.base64"
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
                    v-if="item[items[selectedItem].value]"
                    class="text-truncate text-caption"
                  >
                    {{ item[items[selectedItem].value] }}
                  </v-card-text>
                  <v-card-text v-else class="text-caption">
                    No {{ items[selectedItem].text }} Available
                  </v-card-text>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn color="primary" text @click="dialog2 = false"> Close </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["photos"],
  data: () => ({
    dialog2: false,
    searchPhotos: null,
    selectedItem: 1,
    items: [
      { text: "Address", value: "Address" },
      { text: "Caption", value: "Caption" },
      { text: "Community", value: "CommunityName" },
      { text: "File Name", value: "OriginalFileName" },
      { text: "Place", value: "PrimaryName" },
      { text: "Feature Name", value: "FeatureName" },
    ],
  }),
  methods: {},
  computed: {
    filteredPhotos() {
      if (!this.photos) return [];

      if (this.photos.length > 0 && this.searchPhotos) {
        let items = this.items.slice(0);
        let data = this.photos.slice(0);
        data = data.filter((a) =>
          a[items[this.selectedItem].value]
            ? a[items[this.selectedItem].value]
                .toLowerCase()
                .includes(this.searchPhotos.toLowerCase())
            : false
        );

        return data;
      } else return this.photos;
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