<template>
      <v-container fluid>
        <h3>Burial</h3>
        <Breadcrumbs/>
        <v-row>
          <v-col cols="12" class="d-flex">
            <div class="d-flex mb-2">
              <h1 class="mt-auto mb-auto ">{{fields.FirstName}} {{fields.LastName}}</h1>
            </div>
            <v-spacer></v-spacer>
            <!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="mode == 'view'">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="mode == 'edit'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1" v-if="mode == 'edit'" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Done
                </v-btn>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <v-expansion-panels multiple>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h2>Information</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="4">
                          <h4>Name</h4>
                            <v-text-field
                              name="FirstName"
                              label="First Name"
                              outlined dense
                              v-model="fields.FirstName"
                            ></v-text-field>
                            <v-text-field
                              name="LastName"
                              label="Last Name"
                              outlined dense
                              v-model="fields.LastName"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <h4>Origin</h4>
                            <v-select
                              :items="[1,2,3,4]"
                              v-model="fields.Country"
                              outlined dense
                              label="Country of Origin"
                            ></v-select>
                            <v-text-field
                              name="Province"
                              outlined dense
                              label="Province/State of Origin"
                              v-model="fields.State"
                            ></v-text-field>
                            <v-text-field
                              name="City"
                              outlined dense
                              label="City of Origin"
                              v-model="fields.City"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <h4>Photos</h4>
                        </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="4">
                          <h4>Birth / Death</h4>
                            <v-menu
                                ref="menu"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="fields.ExpirationDate"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                :disabled="!isEditable"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    outlined dense
                                    v-model="fields.ExpirationDate"
                                    label="Birth Date"
                                    append-icon="mdi-calendar"
                                    readonly
                                    :disabled="!isEditable"
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="fields.BirthDate"
                                no-title
                                scrollable
                                >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(fields.ExpirationDate)"
                                >
                                    OK
                                </v-btn>
                                </v-date-picker>
                            </v-menu>

                            <v-menu
                                ref="menu2"
                                v-model="menu"
                                :close-on-content-click="false"
                                :return-value.sync="fields.ExpirationDate"
                                transition="scale-transition"
                                offset-y
                                min-width="auto"
                                :disabled="!isEditable"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="fields.ExpirationDate"
                                    label="Death Date"
                                    append-icon="mdi-calendar"
                                    readonly
                                    outlined dense
                                    :disabled="!isEditable"
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                                </template>
                                <v-date-picker
                                v-model="fields.DeathDate"
                                no-title
                                scrollable
                                >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu2.save(fields.ExpirationDate)"
                                >
                                    OK
                                </v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="4">
                          <h4>Age</h4>
                            <v-text-field
                              name="Age"
                              outlined dense
                              label="Age"
                              v-model="fields.Age"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4"></v-col>
                    </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h2>History</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Religion</h4>
                          </v-col>
                        </v-row>
                        <v-select
                          :items="[1,2,3]"
                          v-model="fields.Religion"
                          outlined dense
                          label="Religion"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Occupation</h4>
                            <OccupationDialog class="ml-auto mr-1"/>
                          </v-col>
                        </v-row>

                        <v-select v-for="occupation in fields.Occupations"
                          :key="`occ-${occupation.id}`"
                          :items="[1,2,3]"
                          outlined dense
                          label="Occupation"
                        ></v-select>
                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Memberships</h4>
                            <MembershipDialog class="ml-auto mr-1"/>
                          </v-col>
                        </v-row>
                          <v-data-table
                          :headers="membershipHeaders"
                          :items="fields.Memberships"
                          :items-per-page="5"
                          class="elevation-0"
                        ></v-data-table>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <h4 class="mt-5 mb-5">Person Notes</h4>
                        <v-textarea
                          label="Notes"
                          name="Notes"
                          outlined dense
                        ></v-textarea>
                      </v-col>
                      <v-col cols="6">
                        <h4 class="mt-5 mb-5">Gender</h4>
                        <v-radio-group v-model="fields.Gender" row>
                          <v-radio
                            label="Male"
                            value="m"
                          ></v-radio>
                          <v-radio
                            label="Female"
                            value="f"
                          ></v-radio>
                          <v-radio
                            label="Other"
                            value="other"
                          ></v-radio>
                        </v-radio-group>
                      </v-col>
                    </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h2>Death</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Circumstance of Death</h4>
                          </v-col>
                        </v-row>
                        <v-select
                          :items="[1,2,3]"
                          v-model="fields.MannerOfDeath"
                          outlined dense
                          label="Manner"
                        ></v-select>
                        <v-select
                          :items="[1,2,3]"
                          v-model="fields.CauseOfDeath"
                          outlined dense
                          label="Cause"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">

                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Funeral and Obituaries</h4>
                          </v-col>
                        </v-row>

                        <v-select
                          :items="[1,2,3]"
                          outlined dense
                          label="Funneral paid by"
                        ></v-select>

                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Sources</h4>
                            <SourceDialog/>
                          </v-col>
                        </v-row>

                        <v-text-field v-for="source in fields.Sources"
                          :key="`key-${source.id}`"
                          name="source"
                          label="Source"
                          outlined dense
                        ></v-text-field>

                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Next of Kin</h4>
                            <KinDialog/>
                          </v-col>
                        </v-row>
                          <v-data-table
                            :headers="membershipHeaders"
                            :items="fields.Memberships"
                            :items-per-page="5"
                            class="elevation-0"
                          ></v-data-table>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel>
                <v-expansion-panel-header>
                  <h2>Burial</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="4">
                          <v-row>
                            <v-col cols="12" class="d-flex flex-row align-center">
                              <h4 class="mt-5 mb-5">Buried in Yukon?</h4>
                            </v-col>
                          </v-row>
                          <v-text-field
                            name="DestinationBodyShipped"
                            label="if No, Destination body shipped"
                            v-mode="fields.BodyShipped"
                            outlined dense
                          ></v-text-field>
                          <v-text-field
                            name="YukonBurialLocation"
                            v-mode="fields.BurialLocation"
                            label="Yukon Burial Location"
                            outlined dense
                          ></v-text-field>
                          <v-text-field
                            name="Other"
                            label="if Other, Please specify"
                            v-mode="fields.Other"
                            outlined dense
                          ></v-text-field>
                          <v-text-field
                            name="PlodDescription"
                            label="Plot description"
                            v-mode="fields.PlotDescription"
                            outlined dense
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8">
                          <v-row>
                            <v-col cols="12" class="d-flex flex-row align-center">
                              <h4 class="mt-5 mb-5">Site Visit</h4>
                              <SiteVisitDialog/>
                            </v-col>
                          </v-row>
                          <v-data-table
                            :headers="membershipHeaders"
                            :items="fields.SiteVisits"
                            :items-per-page="5"
                            class="elevation-0"
                          ></v-data-table>
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
      </v-container>
</template>

<script>
import Breadcrumbs from "../../Breadcrumbs";
import users from "../../../controllers/user";
import MembershipDialog from "./Dialogs/MembershipDialog.vue";
import OccupationDialog from "./Dialogs/OccupationDialog.vue";
import SourceDialog from "./Dialogs/SourceDialog.vue";
import KinDialog from "./Dialogs/KinDialog.vue";
import SiteVisitDialog from "./Dialogs/SiteVisitDialog.vue";
export default {
  name: "edituser",
  components: {
    Breadcrumbs,
    MembershipDialog,
    OccupationDialog,
    SiteVisitDialog,
    KinDialog,
    SourceDialog
  },
  data: () => ({
    username: 'username',
    overlay: false,
    items: null,
    selectedItem: null,
    mode: null,
    /* VALIDATION*/
    dataAccessValidation: false,
    rules: [
        value => !!value || 'Required.',
      ],
    /* FIELDS*/
    fields:{
      //information section
      FirstName: "",
      LastName: "",
      Country: "",
      State: "",
      City: "",
      BirthDate: "",
      DeathDate: "",
      Age: "",
      //history section
      Religion: "",
      Occupations: [],
      Memberships: [],
      Gender: "",
      Notes: "",
      //Death
      MannerOfDeath: "",
      CauseOfDeath: "",
      FunneralPayer: "",
      Sources: [],
      Kinships: [],
      //Burial
      BuriedInYukon: "",
      BodyShipped: "",
      BurialLocation: "",
      Other: "",
      PlotDescription: "",
      SiteVisits: [],
    },
    fieldsHistory: null,
    menu: false,
    menu2: false,
    showSave: 0,
    membershipHeaders: [
          { text: 'Membership',value: 'name'},
          { text: 'Chapter', value: 'calories' },
          { text: 'Membership Notes', value: 'fat' },
        ],
  }),
  mounted(){
      if(this.checkPath("edit")){
          this.mode= "edit";
          //after this, the fields get filled with the info obtained from the api
          this.getDataFromApi();
      }
      else if(this.checkPath("view")){
          this.mode="view";
          //after this, the fields get filled with the info obtained from the api
          this.getDataFromApi();
      }
  },
  methods: {
    /*this function checks if the current path contains a specific word, this can be done with a simple includes but 
    //it causes confusion when a boat or owner has 'new' in its name, leading the component to think it should use the 'new' mode,
    this problem is solved by using this funtion.*/
    checkPath(word){
        let path = this.$route.path.split("/");
        if(path[2] == word){
            return true;
        }
        return false;
    },
    resetValidation() {
        this.$refs.sForm.reset();
      },
    deleteAccess(site){
      let index = this.sites.findIndex(x => x == site);
      if (index > -1) {
        this.sites.splice(index, 1);
      }
    },
    saveCurrentBurial(){
        localStorage.currentBurialID = this.$route.params.id;
    },
    addSitePermissions(){
      if(this.siteDataAccess == "" || this.siteRole == ""){
        return;
      }
      this.sites.push({
        id: this.sites.length +1,
        role: this.siteRole,
        dataAccess: this.siteDataAccess
      });
      this.resetValidation();

      
    },
    async getDataFromApi(){
        this.overlay = true;
        if(this.$route.params.id){
            this.saveCurrentBurial();
        }/*
        let baseSections = await users.getSections();
        this.fields = await users.getById(localStorage.currentBurialID);
        this.fields.ExpirationDate = this.fields.ExpirationDate ? this.fields.ExpirationDate.substr(0, 10): ""; 
        let access = await users.getAccess(localStorage.currentBurialID);
        this.sections = baseSections.map((x)=>{
          let accessSection = access.filter(acc => acc.SectionID == x.SectionID).pop();
          if(accessSection){
            x.AccessID = accessSection.AccessID;
            x.UAID = accessSection.UAID;
          }
          else{
            x.AccessID = 1;
          }
          return x;
        });*/
        this.overlay = false;
    },
    viewMode(){
        this.mode="view";
        this.$router.push(`/burials/view/${this.$route.params.id}`);
    },
    editMode(){
        this.fieldsHistory = {...this.fields};
        this.mode="edit";
        this.$router.push(`/burials/edit/${this.$route.params.id}`);
        this.showSave = 0;
    },
    cancelEdit(){
        if(this.fieldsHistory){
            this.fields = {...this.fieldsHistory};
        }
        this.mode="view";
        //this.resetListVariables();
        this.$router.push(`/burials/view/${this.$route.params.id}`);
    },
    async saveChanges(){
            this.overlay = true; 
            let access = this.sections.map((x) =>{
              delete x.SectionName;
              delete x.SectionIcon;
              x.UserID = parseInt(localStorage.currentBurialID);
              return x;
            })
            const accessData = {
              access
            };
            const {
              FirstName,
              LastName,
              Email,
              ExpirationDate
            } = this.fields;
            const data = {
              user: {
                FirstName,
                LastName,
                Email
              },
              expirationDate: ExpirationDate
            }

            await users.put(localStorage.currentBurialID, data);
            await users.putAccess(localStorage.currentBurialID, accessData);
            this.overlay = false;   
            this.$router.push({name: 'AdminUserGrid'});   
            //this.$router.go(); 
            
            
        },
    save (date) {
      this.$refs.menu.save(date);
    },
    formatDate (date) {
        if (!date) return null
        //date = date.substr(0, 10);
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
  },
  computed: {
    isEditable(){
      return this.mode == 'edit' ? true : false;
    },
    param() {
        return this.$route.params.id;
    },
    serviceEnd(){
        return this.formatDate(this.fields.ServiceEnd);
    },
    availableDataAccess(){
      return this.dataAccessOptions.filter(x => !this.sites.some(item => item.dataAccess === x));
    }
  },
  watch: {
    fields: {
        handler(){
            this.showSave = this.showSave+1;
        },
        deep: true
    },
    sections: {
      handler(){
            this.showSave = this.showSave+1;
        },
        deep: true
    }
  }
}
</script>


<style scoped>
.list-menu{
  padding: 0px 8px 0px 0px;
}
.card-text{
    color: #000; /* Fallback for older browsers */
    color: rgba(0, 0, 0, 0.5);
}
</style>