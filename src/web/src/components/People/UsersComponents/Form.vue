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
                
                <PrintButton  
                    v-if="isViewMode" 
                    :loadingPhotos="loadingPhotos" 
                    :loadingHistories="loadingHistories"  
                    :histories="histories" 
                    :data="fields" 
                    :name="`${fields.Surname}-${fields.GivenName}`" 
                    :selectedImage="selectedImage"/>
 <!--buttons for the edit state -->
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
                <v-btn color="success" :disabled="showSave < 1"  v-if="isNewMode" @click="saveChanges">
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Create Person
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="7">
                <v-row>
                    <v-col cols="6">
                      <v-text-field outlined dense
                        name="Surname"
                        label="Surname"
                        v-model="fields.Surname"
                        :readonly="isViewMode"
                      ></v-text-field>

                      <v-text-field outlined dense
                        name="Given Name"
                        label="Given Name"
                        v-model="fields.GivenName"
                        :readonly="isViewMode"
                      ></v-text-field>

                      <v-text-field outlined dense
                        name="Notes"
                        label="Notes"
                        v-model="fields.Notes"
                        :readonly="isViewMode"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="4">
                      <v-text-field outlined dense
                        name="Birth Year"
                        label="Birth Year"
                        v-model="fields.BirthYear"
                        :readonly="isViewMode"
                      ></v-text-field>

                      <v-text-field outlined dense
                        name="Death Year"
                        label="Death Year"
                        v-model="fields.DeathYear"
                        :readonly="isViewMode"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="2">
                      <v-checkbox class="my-2"
                        v-model="fields.BirthAccuracy"
                        :readonly="isViewMode"
                        label="Estimated"
                      ></v-checkbox>

                      <v-checkbox class="my-2"
                        v-model="fields.DeathAccuracy"
                        :readonly="isViewMode"
                        label="Estimated"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
            </v-col>
            <v-col cols="5">
<!-- Photos component, it includes a carousel and some dialogs for the button actions   -->
                <Photos 
                v-if="infoLoaded" 
                :showDefault="isNewMode" 
                :PersonID="getPersonID"
                @updateSelectedImage="selectedImageChanged" 
                :selectedImage="selectedImage" 
                @loadingPhotosChange="loadingPhotosChange"/>   
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider> 
<!-- Historic Record component -->
        <HistoricRecord 
            v-if="!isNewMode" :mode="'edit'" 
            :personID="getPersonID" 
            @historicRecordChange="onHistoryChange" 
            @loadingHistoriesChange="loadingHistoriesChange"/>
        
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
import Photos from "./Photos/Photos";
import HistoricRecord from "./HistoricRecord";
import PrintButton from "./PrintButton";
import people from "../../../controllers/people";

//import _ from 'lodash';
export default {
    name: "boatsForm",
    components: {  Breadcrumbs, HistoricRecord, Photos, PrintButton },
    data: ()=> ({
        overlay: false,
        infoLoaded: false,
    //helper vars, they are used to determine if the component is in an edit, view or add new state
        mode: "",
        edit: false,
        showSave: 0,
    //input fields
        search: "",
        fields: {},
        histories: null,
        fieldsHistory: null,
    // select vars
        selectedImage: null,
        loadingPhotos: false,
        loadingHistories: false
    }),
    mounted(){
        if(this.checkPath("edit")){
            this.mode= "edit";
            //after this, the fields get filled with the info obtained from the api
            this.getDataFromApi();
        }
        else if(this.checkPath("new")){
            this.mode="new";
            console.log(this.mode);
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
                Surname: "",
                GivenName: "",
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
            //const data = await people.getHistories(localStorage.currentPersonID);
            //this.histories = data.histories;

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
            //this.resetListVariables();
            //this.$router.push(`/users/view/${this.fields.GivenName}`);
            this.$router.push({
                name: "personView",
                params: { name: `${this.fields.GivenName}-${this.fields.Surname}`, id: this.fields.PersonID },
            });
        },
        cancelNew(){
            this.$router.push(`/users/`);
        },
        viewMode(){
            this.mode="view";
             this.$router.push({
                name: "personView",
                params: { name: `${this.fields.GivenName}-${this.fields.Surname}`, id: this.fields.PersonID },
            });
            //this.$router.push(`/users/view/${this.fields.GivenName}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.$router.push({
                name: "personEditView",
                params: { name: `${this.fields.GivenName}-${this.fields.Surname}`, id: this.fields.PersonID },
            });
            //this.$router.push(`/users/edit/${this.fields.GivenName}`);
            this.showSave = 0;
            //this.resetListVariables();
        },
        async saveChanges(){
            this.overlay = true; 
            let { Surname,
                GivenName,
                BirthYear,
                //BirthAccuracy,DeathAccuracy
                DeathYear } = this.fields;
             let data = {
                    person: {
                        Surname,
                        GivenName,
                        BirthYear,
                        BirthAccuracy: "",
                        DeathYear,
                        DeathAccuracy: ""
                    }
                };
                //console.log(data);
            console.log(data);
            let currentPerson = {};
            if(this.mode == 'new'){
                let resp = await people.post(data);
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
                    this.$router.push(`/people`);
                }
               
            }
            else{
                await people.put(localStorage.currentPersonID,data);
                currentPerson.id = localStorage.currentPersonID;
                currentPerson.name =  `${this.fields.GivenName}-${this.fields.Surname}`; 
                this.mode = 'view';
                this.overlay = false;
                this.$router.push({name: 'personView', params: { name: currentPerson.name, id: currentPerson.id },});   
                this.$router.go();   
            } 
            
        },
        selectedImageChanged(val){
            this.selectedImage = val;
        },
        onHistoryChange(data){
            this.histories = data;
        },
        loadingPhotosChange(val){
            this.loadingPhotos = val;
        },
        loadingHistoriesChange(val){
            this.loadingHistories = val;
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
        getPersonID(){
            if(this.$route.params.id){
                return  this.$route.params.id;
            }
            else return localStorage.currentPersonID;
        },
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