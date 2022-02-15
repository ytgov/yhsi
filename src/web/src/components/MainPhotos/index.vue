<template>
 <div>
   <v-app-bar
      color="primary"
      dark
      flat    
    >
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">
           Back to Photos
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="primary">
        <v-icon>mdi-image</v-icon>
        <div class="ml-2">
          <v-toolbar-title> {{this.modeTitle}} Photo </v-toolbar-title>
        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <!--<Search :data="photos"/>-->
      <v-col class="d-flex" cols="3">
      <v-text-field
        dense
        filled
        solo-inverted
        flat
        class="mx-1"
        hide-details
        v-model="searchText" 
        label="Search photos" 
        @keyup.enter="searchPhotos"
        style="margin: 4px;"
      >      </v-text-field>
      <v-btn @click="searchPhotos" icon class="mt-auto mb-auto">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      </v-col>

      <!--<v-btn color="primary" @click="showDialog()">
        <v-icon class="mr-2">mdi-printer</v-icon> 
        <div>
          Print Record
        </div>
      </v-btn>-->
    </v-app-bar>
    <PrintDialog :dialog="dialog" :photoname="fields.featureName" @closeDialog="closeDialog"/>

    <div>
      <v-row>
        <v-col id="main-content">
          <!-- Title and buttons -->
          <div class="page-header">   
            <h2 class="display-name">{{ this.displayName }}</h2>         
            <v-btn class="mx-1 form-header" color="primary" @click="editMode" v-if="mode == 'view'">
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
              :disabled="!valid"
              v-if="mode == 'edit'"
              @click="saveChanges"
              class="form-header"
            >
              <v-icon class="mr-1">mdi-check</v-icon>
              Done
            </v-btn>

            <!-- buttons for the new state -->
            <v-btn class="black--text mx-1 form-header" @click="cancelNew" v-if="mode == 'add'">
              <v-icon>mdi-close</v-icon>
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!valid"
              v-if="mode == 'add'"
              @click="createPhoto"
              class="form-header"
            >
              <v-icon class="mr-1">mdi-check</v-icon>
              Create Photo
            </v-btn>
          </div>

          <div ref="feature">  
            <Feature 
              v-if="infoLoaded"
              :fields="fields"
              :mode="mode"
              :itemType="'photo'"
              @featureChange="featureChange"   
              @featureValidChange="featureValidChange" 
            /> 
          </div>
          <div ref="siteRecord">  
            <SiteRecord 
              v-if="infoLoaded"
              :fields="fields"
              :mode="mode"
              :itemType="'photo'"
              @siteRecordChange="siteRecordChange" 
            />
          </div>
          <div ref="historicSites">  
            <HistoricSites 
              v-if="infoLoaded"
              :fields="fields"
              :mode="mode"
              :itemType="'photo'"
              @historicSiteChange="historicSiteChange" 
              @siteValidChange="siteValidChange"
            />
          </div>
          <div ref="photo">  
            <Photo 
              v-if="infoLoaded && imageLoaded"
              :fields="fields"
              :mode="mode"
              :itemType="'photo'"
              @photoChange="photoChange" 
              @photoValidChange="photoValidChange" 
              @photoRotate="photoRotate"
            />
          </div>
        </v-col>

        <!-- Side menu -->
        <v-col cols="2">
          <affix class="sidebar-menu" relative-element-selector="#main-content" style="width: 200px; margin-top: 10px;">
          <v-list shaped class="list-menu">
            <v-list-item-group
              v-model="selectedItem"
              color="primary"
            >
              <v-list-item
                v-for="(item, i) in menuItems"
                :key="i"
                @click="scrollToAnchorPoint(item.anchor)"
                :id="item.id"
              >
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
          </affix>
        </v-col>
      </v-row>
    </div>
 </div>
</template>

<script>
import axios from "axios";
import PrintDialog from "./PrintDialog";
//import Search from "./PhotosComponents/Search";
import Feature from "./PhotosComponents/Feature";
import SiteRecord from "./PhotosComponents/SiteRecord";
import HistoricSites from "./PhotosComponents/HistoricSites";
import Photo from "./PhotosComponents/Photo";
import { PHOTO_URL } from "../../urls";
import Vue from "vue";
import Affix from 'vue-affix';

Vue.use(Affix);

export default {
  name: "Photos",
  components: { PrintDialog, Feature, SiteRecord, HistoricSites, Photo },
  data: () => ({
    menuItems: null,
    selectedItem: 0,
    dialog: false, //tells the print dialog when to show itself,
    photos: [],
    infoLoaded: false,
    imageLoaded: false,
    fields: { dateCreated: new Date().toISOString().substr(0, 10) },
    changesMade: 0,
    body: {},
    displayName: "New photo",
    searchText: null,
    featureValid: false,
    photoValid: false,
    siteValid: false,
  }),
  created(){
    this.menuItems = [
      {name: "Feature", icon: 'mdi-note-text-outline', anchor: `feature`, id: 'featureMenuItem'},
      {name: "Site Record", icon: 'mdi-map-check', anchor: `siteRecord`, id: 'recMenuItem'},
      {name: "Historic Sites", icon: 'mdi-calendar-range', anchor: `historicSites`, id: 'siteMenuItem'},
      {name: "Photo", icon: 'mdi-shape', anchor: `photo`, id: 'photoMenuItem'},
    ];
    
    if (this.mode=='add') {
      this.infoLoaded = true;
      this.imageLoaded = true;
    } else {
      this.storeRowId();
      this.loadItem();
      this.loadImgFile();
    }
  },
  methods: {
    storeRowId() {
      if(this.$store.getters["photos/rowId"]) {
        localStorage.currentRowId = this.$store.getters["photos/rowId"];
      }
    },
    loadItem() {
      axios
        .get(`${PHOTO_URL}/${localStorage.currentRowId}`)
        .then((resp) => {
          this.fields = resp.data.data;
          this.fields.subjects = this.fields.subjects ? (this.fields.subjects).split(',') : null;
          this.fields.dateCreated = this.fields.dateCreated
            ? this.fields.dateCreated.substr(0, 10)
            : "";
          this.displayName = this.fields.originalFileName;   
          this.infoLoaded = true;    
        })
        .catch((error) => console.error(error))
        ; 
    },

    loadImgFile() {
      axios
        .get(`${PHOTO_URL}/${localStorage.currentRowId}/file`)
        .then((resp) => {
          this.fields.file = resp.data.data;
          this.fields.file.base64 = `data:image/png;base64,${this.toBase64(this.fields.file.data)}`; 
          this.imageLoaded = true;
        })
        .catch((error) => console.error(error))
        ; 
    },
    
    toBase64(arr) {
      return btoa(
        arr.reduce((data, byte) => data + String.fromCharCode(byte), "")
      );
    },
    goBack(){
      this.$router.push('/photos');
    },
    showDialog(){
      this.dialog =  true;
    },
    closeDialog(){
      this.dialog = false;
    },
    scrollToAnchorPoint(refName) {
      var element = this.$refs[refName];
      var top = element.offsetTop;
      window.scrollTo(0, top);
    },
    featureChange(val) {
      this.fields.address = val.address;
      this.fields.communityId = val.communityId;
      this.fields.featureName = val.featureName;
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
      this.fields.dateCreated = val.dateCreated;     
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
      this.fields.file = val.file;        
      this.fields.caption = val.caption;        
      this.fields.creditLine = val.creditLine;        
      this.fields.copyright = val.copyright;        
      this.fields.isComplete = val.isComplete;        
      this.fields.isPrivate = val.isPrivate;       
      this.fields.ownerId = val.ownerId;        
      this.fields.comments = val.comments;        
      this.fields.subjects = val.subjects;        
      this.fields.usageRights = val.usageRights;   
      this.fields.rating = val.rating;       
      this.fields.legacyBatchInfo = val.legacyBatchInfo; 
      this.changesMade = this.changesMade + 1;
    },
    photoValidChange(val) {
      this.photoValid = val;
    },
    photoRotate(val) {
      this.imageLoaded = false;
      this.fields.file = val;
      this.saveChanges();
    },
    setBody() {     
      this.fields.isOtherRecord = this.fields.isOtherRecord ? this.fields.isOtherRecord : false;
      this.fields.isComplete = this.fields.isComplete ? this.fields.isComplete : false;
      this.fields.isPrivate = this.fields.isPrivate ? this.fields.isPrivate : false;
      
      this.body = {
        isSiteDefault: false,

        address: this.fields.address,
        communityId: this.fields.communityId,
        featureName: this.fields.featureName,
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
        rating: this.fields.rating,
        legacyBatchInfo: this.fields.legacyBatchInfo,
      };
    },
    saveChanges() {
      this.imageLoaded = false;
      if (this.mode != 'view') {
        this.infoLoaded = false;
      }
      this.setBody();

      const formData = new FormData();
      let prevFields = Object.entries(this.body);
      for (let i = 0; i < prevFields.length; i++) {
        if(prevFields[i][1] != null && prevFields[i][1] != 'undefined') {
          formData.append(prevFields[i][0], prevFields[i][1]);
        }
      }
      if(this.fields.file) {
        formData.append("file", this.fields.file);
      }

      axios
        .put(`${PHOTO_URL}/${localStorage.currentRowId}`, formData)
        .then((resp) => {
          // If editing in view mode we're only rotating the photo. No need to reload the item data
          if (this.mode != 'view') {
            this.$router.push(`/photos/view`);
            this.loadItem();
          }
          this.loadImgFile();
          this.$emit("showAPIMessages", resp.data);
        })
        .catch((err) => {
          this.$emit("showError", err);
        });
    },
    createPhoto() {
      if(!this.fields.file) {
        this.$emit("showError", 'Select a photo to upload');
      } else {
        this.imageLoaded = false;
        this.infoLoaded = false;
        this.setBody();

        this.$store.commit("photos/setRowId", null);
        localStorage.currentRowId = null;

        const formData = new FormData();
        let prevFields = Object.entries(this.body);
        for (let i = 0; i < prevFields.length; i++) {
          if(prevFields[i][1] != null && prevFields[i][1] != 'undefined') {
            formData.append(prevFields[i][0], prevFields[i][1]);
          }
        }
        if(this.fields.file) {
          formData.append("file", this.fields.file);
        }

        axios
          .post(`${PHOTO_URL}/`, formData)
          .then((resp) => {
            this.$router.push(`/photos/view`);
            this.$store.commit("photos/setRowId", resp.data.data[0].rowId);
            localStorage.currentRowId = resp.data.data[0].rowId;
            this.loadItem();
            this.loadImgFile();
            this.$emit("showAPIMessages", resp.data);
          })
          .catch((err) => {
            this.$emit("showError", err);
          });
      }
    },
    editMode() {
      this.$router.push(`/photos/edit`);
      this.changesMade = 0;
      this.displayName = 'Edit ' + this.fields.originalFileName;
    },
    cancelEdit() {
      this.infoLoaded = false;
      this.imageLoaded = false;
      this.$router.push(`/photos/view`);
      this.loadItem();
      this.loadImgFile();
    },
    cancelNew() {
      this.$router.push(`/photos`);
    },
    searchPhotos() {
      this.$store.commit("photos/setSearchText", this.searchText);
      this.$router.push(`/photos/`);
    },
  },
  computed: {
    mode() {
      return this.$route.params.mode;
    },
    modeTitle() {
      var s = this.$route.params.mode;
      return s.charAt(0).toUpperCase() + s.slice(1)
    },
    valid() {
      return this.featureValid && this.photoValid && this.siteValid && (this.changesMade > 0);
    }
  }
};
</script>


<style scoped>
.list-menu{
  padding: 0px 8px 0px 0px;
}
.save-button {
  margin-left: 30px !important;
}
.display-name {
  display: inline-block;
}
.page-header {
  padding-top: 15px;
  padding-left: 20px;
}
.page-header button {
  float:right;
}
</style>