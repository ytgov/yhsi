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
                <v-btn class="black--text mx-1" @click="editMode" v-if="isView">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="isEdit">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1" v-if="isEdit" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Done
                </v-btn>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <v-expansion-panels v-model="panel" multiple>
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
                              :readonly="isView"
                            ></v-text-field>
                            <v-text-field
                              name="LastName"
                              label="Last Name"
                              outlined dense
                              v-model="fields.LastName"
                              :readonly="isView"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <h4>Origin</h4>
                            <v-select
                              v-model="fields.OriginCountry"
                              outlined dense
                              label="Country of Origin"
                              :readonly="isView"
                            ></v-select>
                            <v-text-field
                              name="Province"
                              outlined dense
                              label="Province/State of Origin"
                              v-model="fields.OriginState"
                              :readonly="isView"
                            ></v-text-field>
                            <v-text-field
                              name="City"
                              outlined dense
                              label="City of Origin"
                              :readonly="isView"
                              v-model="fields.OriginCity"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="4">
                          <h4>Photos</h4>
                        </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="4">
                          <h4>Birth / Death</h4>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field outlined dense
                                      name="Birth Day"
                                      label="Birth Day"
                                      v-model="fields.BirthDay"
                                      :readonly="isView"
                                    ></v-text-field>
                                    
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field outlined dense
                                      name="Birth Month"
                                      label="Birth Month"
                                      v-model="fields.BirthMonth"
                                      :readonly="isView"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field outlined dense
                                      name="Birth Year"
                                      label="Birth Year"
                                      v-model="fields.BirthYear"
                                      :readonly="isView"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field outlined dense
                                      name="Death Day"
                                      label="Death Day"
                                      v-model="fields.DeathDay"
                                      :readonly="isView"
                                    ></v-text-field>
                                    
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field outlined dense
                                      name="Death Month"
                                      label="Death Month"
                                      v-model="fields.DeathMonth"
                                      :readonly="isView"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field outlined dense
                                      name="Death Year"
                                      label="Death Year"
                                      v-model="fields.DeathYear"
                                      :readonly="isView"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                       
                        </v-col>
                        <v-col cols="4">
                          <h4>Age</h4>
                            <v-text-field
                              name="Age"
                              outlined dense
                              label="Age"
                              v-model="fields.Age"
                              :readonly="isView"
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
                          :items="religions"
                          v-model="fields.Religion"
                          outlined dense
                          item-value="ReligionLUpID"
                          item-text="Religion"
                          label="Religion"
                          :readonly="isView"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Occupations</h4>
                            <OccupationDialog class="ml-auto mr-1" v-if="!isView" :mode="'new'" :data="filteredOccupations" @newOccupation="newOccupation"/>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12">
                          <v-card v-if="fields.Occupations">
                            <v-list class="pa-0" >
                                <template v-for="(item, index) in fields.Occupations">
                                    <v-list-item :key="`nl-${index}`" v-if="!item.deleted">                            
                                        <v-list-item-content>
                                            <v-list-item-title >{{item.Occupation}}</v-list-item-title>   
                                        </v-list-item-content>
                                        <v-list-item-action class="d-flex flex-row">
                                            <OccupationDialog v-if="!isView" :mode="'edit'" :data="filteredOccupations" @editOccupation="editOccupation" :occupationToEdit="{ index, Occupation: item}"/>
                                            <v-tooltip bottom v-if="!isView">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon class="grey--text text--darken-2"  @click="deleteOccupation(index)">
                                                            <v-icon
                                                            small
                                                            >mdi-trash-can</v-icon>  
                                                        </v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip> 
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-divider :key="`divider-${index}`"></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                          </v-col>
                        </v-row>

                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Memberships</h4>
                            <MembershipDialog class="ml-auto mr-1" v-if="!isView" :data="filteredMemberships" @newMembership="newMembership"/>
                          </v-col>
                        </v-row>
                          <v-data-table
                          :headers="membershipHeaders"
                          :items="fields.Memberships"
                          :items-per-page="5"
                          class="elevation-0"
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-tooltip bottom v-if="!isView">
                                <template v-slot:activator="{ on, attrs }">
                                        <v-btn 
                                        v-bind="attrs"
                                        v-on="on"
                                        icon class="grey--text text--darken-2"  @click="deleteMembership(item)">
                                            <v-icon
                                            small
                                            >mdi-trash-can</v-icon>  
                                        </v-btn>
                                </template>
                                <span>Delete</span>
                            </v-tooltip> 
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <h4 class="mt-5 mb-5">Person Notes</h4>
                        <v-textarea
                          label="Notes"
                          name="Notes"
                          v-model="fields.PersonNotes"
                          outlined dense
                          :readonly="isView"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="6">
                        <h4 class="mt-5 mb-5">Gender</h4>
                        <v-radio-group v-model="fields.Gender" row :readonly="isView">
                          <v-radio
                            label="Male"
                            value="Male"
                          ></v-radio>
                          <v-radio
                            label="Female"
                            value="Female"
                          ></v-radio>
                          <v-radio
                            label="Other"
                            value="Other"
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
                          :items="['Natural', 'Accidental', 'Murder', 'Unknown']"
                          v-model="fields.Manner"
                          outlined dense
                          label="Manner"
                          :readonly="isView"
                        ></v-select>

                        <v-select
                          :items="causes"
                          v-model="fields.Cause"
                          outlined dense
                          return-object
                          item-text="Cause"
                          label="Cause"
                          :readonly="isView"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">

                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Funeral and Obituaries</h4>
                          </v-col>
                        </v-row>

                        <v-text-field outlined dense
                          name="FunneralPaidBy"
                          v-model="fields.FuneralPaidBy"
                          label="Funneral paid by"
                          :readonly="isView"
                        ></v-text-field>

                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Sources</h4>
                            <SourceDialog @newSource="newSource"/>
                          </v-col>
                        </v-row>

                        <v-row>
                          <v-col cols="12">
                             <v-card v-if="fields.Sources">
                            <v-list class="pa-0" >
                                <template v-for="(item, index) in fields.Sources">
                                    <v-list-item :key="`nl-${index}`">
                                        <v-list-item-content>
                                            <v-list-item-title >{{item.Source}}</v-list-item-title>   
                                        </v-list-item-content>
                                        <v-list-item-action class="d-flex flex-row">
                                            <v-tooltip bottom v-if="mode != 'view'">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon class="grey--text text--darken-2"  @click="deleteSource(index)">
                                                            <v-icon
                                                            small
                                                            >mdi-trash-can</v-icon>  
                                                        </v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip> 
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-divider :key="`divider-${index}`"></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                          </v-col>
                        </v-row>

                      </v-col>
                      <v-col cols="6">
                        <v-row>
                          <v-col cols="12" class="d-flex flex-row align-center">
                            <h4 class="mt-5 mb-5">Next of Kin</h4>
                            <KinDialog v-if="!isView" :data="relationships" :BurialID="currentBurialID" @newKinship="newKinship" />
                          </v-col>
                        </v-row>
                          <v-data-table
                            :headers="kinshipHeaders"
                            :items="fields.Kinships"
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
                            <v-col cols="6" class="d-flex flex-row align-center">
                              <h4 class="mt-5 mb-5">Buried in Yukon?</h4>
                            </v-col>
                            <v-col cols="6" >
                              <v-radio-group
                                v-model="fields.BuriedInYukon"
                                row
                                :readonly="isView"
                              >
                                <v-radio
                                  label="Yes"
                                  value="y"
                                ></v-radio>
                                <v-radio
                                  label="No"
                                  value="n"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                        
                          <v-text-field
                            name="DestinationBodyShipped"
                            label="if No, Destination body shipped"
                            v-model="fields.DestinationShipped"
                            outlined dense
                            :readonly="isView"
                          ></v-text-field>
                          <v-text-field
                            name="YukonBurialLocation"
                            v-model="fields.BurialLocation"
                            label="Yukon Burial Location"
                            outlined dense
                            :readonly="isView"
                          ></v-text-field>
                          <v-text-field
                            name="Other"
                            label="if Other, Please specify"
                            v-model="fields.Other"
                            outlined dense
                            :readonly="isView"
                          ></v-text-field>
                          <v-text-field
                            name="PlodDescription"
                            label="Plot description"
                            v-model="fields.PlotDescription"
                            outlined dense
                            :readonly="isView"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="8">
                          <v-row>
                            <v-col cols="12" class="d-flex flex-row align-center">
                              <h4 class="mt-5 mb-5">Site Visit</h4>
                              <SiteVisitDialog v-if="!isView" @newSiteVisit="newSiteVisit" />
                            </v-col>
                          </v-row>
                          <v-data-table
                            :headers="siteVisitHeaders"
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
import burials from "../../../controllers/burials";
import catalogs from "../../../controllers/catalogs";
import MembershipDialog from "./Dialogs/MembershipDialog.vue";
import OccupationDialog from "./Dialogs/OccupationDialog.vue";
import SourceDialog from "./Dialogs/SourceDialog.vue";
import KinDialog from "./Dialogs/KinDialog.vue";
import SiteVisitDialog from "./Dialogs/SiteVisitDialog.vue";
export default {
  name: "BurialComponent",
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
    panel: [0,1,2,3],
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
      OriginCountry: "",
      OriginState: "",
      OriginCity: "",
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
      Manner: "",
      Cause: "",
      FuneralPaidBy: "",
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
          { text: 'Membership',value: 'Membership'},
          { text: 'Chapter', value: 'Chapter' },
          { text: 'Membership Notes', value: 'Notes' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    siteVisitHeaders: [
          { text: 'Inscription', value: 'Inscription' },
          { text: 'Marker description', value: 'MarkerDescription' },
          { text: 'Condition',value: 'Condition'},
          { text: 'Recorded by', value: 'RecordedBy' },
          { text: 'Visit year', value: 'VisitYear' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    kinshipHeaders: [
          { text: 'Name', value: 'Name' },
          { text: 'Location', value: 'Location' },
          { text: 'Quantity',value: 'Quantity'},
          { text: 'Relationship', value: 'Relationship' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
    causes: [],
    cemetaries: [],
    religions: [],
    occupations: [],
    memberships: [],
    relationships: []
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
       // console.log(path);
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
    async getDataFromApi(){
        this.overlay = true;
        if(this.$route.params.id){
            this.saveCurrentBurial();
        }
        this.fields = await burials.getById(localStorage.currentBurialID);
        this.cemetaries = await catalogs.getCemetaries();
        this.causes = await catalogs.getCauses();
        this.religions = await catalogs.getReligions();
        this.occupations = await catalogs.getOccupations();
        this.memberships = await catalogs.getMemberships();
        this.relationships = await catalogs.getRelationships();
        console.log(this.fields);
        this.overlay = false;
    },
    viewMode(){
        this.mode="view";
        this.$router.push(`/burials/view/${localStorage.currentBurialID}`);
    },
    editMode(){
        this.fieldsHistory = {...this.fields};
        this.mode="edit";
        this.$router.push(`/burials/edit/${localStorage.currentBurialID}`);
        this.showSave = 0;
    },
    cancelEdit(){
        if(this.fieldsHistory){
            this.fields = {...this.fieldsHistory};
        }
        this.mode="view";
        //this.resetListVariables();
        this.$router.push(`/burials/view/${localStorage.currentBurialID}`);
    },
    async saveChanges(){
            this.overlay = true;
            console.log(this.fields);
            let { 
              BurialID,
              Age,
              BirthDateNotes,
              BirthDay,
              BirthMonth,
              BirthYear,
              Memberships, 
              SiteVisits, 
              Kinships,
              DeathDateNotes,
              DeathDay,
              DeathMonth, 
              DeathYear,
              DestinationShipped, 
              FirstName,
              FuneralPaidBy, 
              Gender,
              GenderOther,
              LastName, 
              Manner, 
              Occupations,
              Sources,
              OriginCity,
              OriginCountry,
              OriginState,
              OtherCemetaryDesc, 
              OtherCountry,
              PersonNotes,
              PlotDescription, 
              ShippedIndicator,
              Cause,
              Cemetary,
              Religion
             } = this.fields;
             //BurialID
            const burial = {
              BurialID,
              Age,
              BirthDateNotes,
              BirthDay,
              BirthMonth,
              BirthYear,
              DeathDateNotes,
              DeathDay,
              DeathMonth, 
              DeathYear,
              DestinationShipped, 
              FirstName,
              FuneralPaidBy, 
              Gender,
              GenderOther,
              LastName, 
              Manner,
              OriginCity,
              OriginCountry,
              OriginState,
              OtherCemetaryDesc, 
              OtherCountry,
              PersonNotes,
              PlotDescription, 
              ShippedIndicator,
              //Ids directly on the burial table
              CauseID: Cause.CauseLUpID,
              CemetaryID: Cemetary.CemetaryLUpID, 
              ReligionID: Religion.ReligionLUpID,  
            };
            //console.log(data);
            const data = {
              burial,
              Memberships, 
              SiteVisits, 
              Kinships,
              Sources,
              Occupations
            }
             console.log(JSON.stringify(data));
             //await burials.put(localStorage.currentBurialID, data);
            // await users.putAccess(localStorage.currentBurialID, accessData);*/
             this.overlay = false;   
            // this.$router.push({name: 'BurialsGrid'});   
            // this.$router.go(); 
            
            
        },
    newOccupation(val){
      this.fields.Occupations.push(val);
    },
    deleteOccupation(index){
      if(index > -1){
        let val = this.fields.Occupations[index];
        val.deleted = true;
        this.$set(this.fields.Occupations, index, val);
      }
    },
    editOccupation(val,index){
      //console.log(val, index);
      if(this.isNew){
        delete val.edit;
        val.new = true;
      }
      this.$set(this.fields.Occupations, index, val);
    },
    newKinship(val){
      this.fields.Kinships.push(val);
    },
    editKinships(val,index){
      //console.log(val, index);
      if(this.isNew){
        delete val.edit;
        val.new = true;
      }
      this.$set(this.fields.Kinships, index, val);
    },
    deleteKinship(index){
      if(index > -1){
        let val = this.fields.Kinships[index];
        val.deleted = true;
        this.$set(this.fields.Kinships, index, val);
      }
    },
    newMembership(val){
      //console.log(val);
      this.fields.Memberships.push(val);
    },
    editMembership(val,index){
      //console.log(val, index);
      if(this.isNew){
        delete val.edit;
        val.new = true;
      }
      this.$set(this.fields.Membership, index, val);
    },
    deleteMemberships(index){
      if(index > -1){
        this.fields.Memberships.splice(index,1);
      }
    },
    newSiteVisit(val){
      this.fields.SiteVisits.push(val);
    },
    editSiteVisit(val,index){
      //console.log(val, index);
      if(this.isNew){
        delete val.edit;
        val.new = true;
      }
      this.$set(this.fields.SiteVisits, index, val);
    },
    deleteSiteVisits(index){
      if(index > -1){
        this.fields.SiteVisits.splice(index,1);
      }
    },
    newSource(val){
      this.fields.Source.push(val);
    },
    deleteSources(index){
      if(index > -1){
        this.fields.Sources.splice(index,1);
      }
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
    },
    filteredOccupations(){
      return this.occupations.filter(x => !this.fields.Occupations.some(item => item === x));
    },
    filteredMemberships(){
      return this.memberships.filter(x => !this.fields.Memberships.some(item => item.MembershipLUpID === x.MembershipLUpID));
    },
    isView(){
      return this.mode == 'view';
    },
    isEdit(){
      return this.mode == 'edit';
    },
    isNew(){
      return this.mode == 'new';
    },
    currentBurialID(){
      return localStorage.currentBurialID;
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