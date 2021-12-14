<template>
    <v-container >
        <h3>People</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1 v-if="isEditMode || isViewMode">{{fields.GivenName}}</h1>
                <h1 v-else>New Person</h1>
                <v-spacer></v-spacer>
<!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="isViewMode">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
                <!--
                <PrintButton  v-if="mode == 'view'" :data="fields" :name="fields.Name" :selectedImage="selectedImage"/>
 buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="isEditMode">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1" v-if="isEditMode" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Done
                </v-btn>
<!-- buttons for the new state -->
                <v-btn class="black--text mx-1" @click="cancelNew" v-if="isNewMode">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1 || regNumberWarning.length == 1"  v-if="isNewMode" @click="saveChanges">
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Create Person
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="7">
                <v-row>
                    <v-col cols="6">
                      <v-text-field
                        name="Last Name"
                        label="Last Name"
                        v-model="fields.Surname"
                        :readonly="isViewMode"
                      ></v-text-field>

                      <v-text-field
                        name="Given Name"
                        label="Given Name"
                        v-model="fields.GivenName"
                        :readonly="isViewMode"
                      ></v-text-field>

                      <v-text-field
                        name="Notes"
                        label="Notes"
                        v-model="fields.Notes"
                        :readonly="isViewMode"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field
                        name="Birth Year"
                        label="Birth Year"
                        v-model="fields.BirthYear"
                        :readonly="isViewMode"
                      ></v-text-field>

                      <v-text-field
                        name="Death Year"
                        label="Death Year"
                        v-model="fields.DeathYear"
                        :readonly="isViewMode"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="2">
                      <v-checkbox
                        v-model="fields.BirthAccuracy"
                        :readonly="isViewMode"
                        label="Estimated"
                      ></v-checkbox>

                      <v-checkbox
                        v-model="fields.DeathAccuracy"
                        :readonly="isViewMode"
                        label="Estimated"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
            </v-col>
            <v-col cols="3">
                <v-row>
                    <v-col cols="12">
<!-- Photos component, it includes a carousel and some dialogs for the button actions 
                            <Photos 
                            v-if="infoLoaded" 
                            :showDefault="mode == 'new'" 
                            :boatID="getBoatID"
                            @updateSelectedImage="selectedImageChanged" :selectedImage="selectedImage"/>
                            -->
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider> 
<!-- Historic Record component 
        <HistoricRecord v-if="fields.histories != undefined && mode !='new'" :historicRecords="fields.histories" :mode="'edit'" :boatID="getBoatID" />
        -->
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </v-container>
</template>

<script>
import Breadcrumbs from '../../Breadcrumbs.vue';
//import Photos from "./Photos/Photos";
//import HistoricRecord from "../HistoricRecord";
//import PrintButton from "./PrintButton";
import boats from "../../../controllers/boats";
import people from "../../../controllers/people";

//import _ from 'lodash';
export default {
    name: "boatsForm",
    components: {  Breadcrumbs },
    data: ()=> ({
        overlay: false,
        infoLoaded: false,
    //helper vars used for the name list functions
        editTableNames: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingName: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperName: null,
        validName: false,
        nameRules: [
            v => !!v || 'Name is required',
        ],
    //helper vars used for the name list functions
        isLoadingOwner: false,
        editTableOwners: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingOwner: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperOwner: null,
        validOwner: false,
        ownerRules: [
            v => !!v || 'Owner Name is required',
        ],

    //helper vars, they are used to determine if the component is in an edit, view or add new state
        mode: "",
        edit: false,
        showSave: 0,
    //input fields, datatable, etc
        menu1: "",
        menu2: "",
        menu3: "",
        activePicker: null,
        search: "",
        fields: {},
        fieldsHistory: null,
        owners: [],
    // select vars
        selectedImage: null,
    // vessel typle select options
        vesselTypeOptions: [],
        dateFormatted: "",
        isLoadingVessels: false,
        regNumberWarning: []
    }),
    mounted(){
        if(this.checkPath("edit")){
            this.mode= "edit";
            //after this, the fields get filled with the info obtained from the api
            this.getDataFromApi();
        }
        else if(this.checkPath("new")){
            this.mode="new";
            //inputs remain empty
            this.noData();
        }
        else if(this.checkPath("view")){
            this.mode="view";
            //after this, the fields get filled with the info obtained from the api
            this.getDataFromApi();
        }
    },
    methods:{
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
        noData(){
            this.fields = {
                Surname: "test modification",
                GivenName: "Harry F.",
                BirthYear: 0,
                BirthAccuracy: "",
                DeathYear: 0,
                DeathAccuracy: ""
            };
            this.infoLoaded = true;
        },
        saveCurrentPerson(){
            localStorage.currentPersonID = this.$route.params.id;
        },
        async getDataFromApi(){
            this.overlay = true;
            if(this.$route.params.id){
                this.saveCurrentPerson();
            }
            this.fields = await people.getById(localStorage.currentPersonID);
            this.infoLoaded = true;
            this.overlay = false;
            //console.log(this.fields);
        },
    //Functions dedicated to handle the edit, add, view modes
        cancelEdit(){
            if(this.fieldsHistory){
                this.fields = {...this.fieldsHistory};
            }
            this.mode="view";
            this.resetListVariables();
            this.$router.push(`/users/view/${this.fields.GivenName}`);
        },
        cancelNew(){
            this.$router.push(`/users/`);
        },
        viewMode(){
            this.mode="view";
            this.$router.push(`/users/view/${this.fields.GivenName}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.$router.push(`/users/edit/${this.fields.GivenName}`);
            this.showSave = 0;
            this.resetListVariables();
        },
        async saveChanges(){
            this.overlay = true; 
            let { Surname,
                GivenName,
                BirthYear,
                BirthAccuracy,
                DeathYear,
                DeathAccuracy } = this.fields;
             let data = {
                    person: {
                        Surname,
                        GivenName,
                        BirthYear,
                        BirthAccuracy,
                        DeathYear,
                        DeathAccuracy
                    }
                };
                //console.log(data);
                
            let currentBoat= {};
            console.log(data);
            
            if(this.mode == 'new'){
                let resp = await boats.post(data);
                if(resp.response){
                    if(resp.response.status == 409){
                        this.$store.commit('alerts/setText', "The registration number already exists.");
                        this.$store.commit('alerts/setType', "warning");
                        this.$store.commit('alerts/setTimeout', 5000);
                        this.$store.commit('alerts/setAlert', true);
                        this.overlay = false;
                    }
                }
                else{
                    this.$router.push(`/boats/`);
                }
               
            }
            else{
                await boats.put(localStorage.currentBoatID,data);
                currentBoat.id = localStorage.currentBoatID;
                currentBoat.name = this.fields.Name; 
                this.mode = 'view';
                this.$router.push({name: 'boatView', params: { name: currentBoat.name, id: currentBoat.id}});   
                this.$router.go();   
               
            } 
            
        },
        editHistoricRecord(newVal){
            this.historiRecordHelper = newVal;
        },
        editReference(newVal){
            this.referenceHelper = newVal;
        },
        resetListVariables(){
            this.addingOwner = false;  
            this.editTableOwners = -1;
            this.addingName = false;
            this.editTableNames = -1;
        },
        saveTableOwners(index){
            if(this.addingOwner)
                this.fields.owners[index] = { ...this.helperOwner, isNew: true};
            else{
                this.fields.ownerRemovedArray.push(this.fields.owners[index]);
                this.fields.owners[index] = { ...this.helperOwner, isNew: true};
            }
            this.showSave = this.showSave+1;
            this.addingOwner = false;  
            this.editTableOwners = -1;    
        },
        //handles the new values added to the historic records
        historicRecordChange(val){
            this.fields.histories = val;
        },
        formatDate (date) {
            if (!date) return null
            //date = date.substr(0, 10);
            const [year, month, day] = date.split('-')
            return `${month}/${day}/${year}`
        },
        selectedImageChanged(val){
            this.selectedImage = val;
        }
    },   
    computed:{
        isViewMode(){
          return this.mode == "view" ? true : false;
        },
        isEditMode(){
          return this.mode == "edit" ? true : false;
        },
        isNewMode(){
          return this.mode == "new" ? true : false;
        },
        getBoatID(){
            if(this.$route.params.id){
                return  this.$route.params.id;
            }
            else return localStorage.currentBoatID;
        },
        constructionDate () {
            return this.formatDate(this.fields.ConstructionDate);
        },
        serviceStart(){
            return this.formatDate(this.fields.ServiceStart);
        },
        serviceEnd(){
            return this.formatDate(this.fields.ServiceEnd);
        }
    },
    watch: {
        fields: {/* eslint-disable */
            handler(newval){
                this.showSave = this.showSave+1;
                //console.log(this.fields);
            },/* eslint-enable */
            deep: true
        },
    },
}
</script>