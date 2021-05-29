<template>
    <div >
        <h3>Boats</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1 v-if="mode == 'view'">{{fields.Name}}</h1>
                <v-text-field v-else-if="mode == 'edit'"
                    label="Boat name"
                    v-model="fields.Name"
                ></v-text-field>
                <h1 v-else>New Boat</h1>
                <v-spacer></v-spacer>
<!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="mode == 'view'">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
                <PrintButton  v-if="mode == 'view'" :data="fields" :name="fields.Name"/>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="mode == 'edit'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1" v-if="mode == 'edit'" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Done
                </v-btn>
<!-- buttons for the new state -->
                <v-btn class="black--text mx-1" @click="cancelNew" v-if="mode == 'new'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1" v-if="mode == 'new'" @click="saveChanges">
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Create Boat
                </v-btn>
            </v-col>
        </v-row>
        <v-row >
            <v-col cols="5">
                <v-row >
                    <v-col cols="6">
                        <v-text-field
                                v-model="fields.Name"
                                v-if="mode == 'new'"
                                label="Name"
                        ></v-text-field>
<!-- Names list -->
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Name/s:</v-subheader>
                                <v-divider></v-divider>
                                <template v-for="(item, index) in fields.pastNames">
                                    <v-list-item :key="`nl-${index}`">
                                        <v-list-item-content>
                                            <v-list-item-title v-if="index != editTableNames || mode == 'view'">{{item.BoatName}}</v-list-item-title>
                                            <v-form v-model="validName" v-if="mode != 'view'" v-on:submit.prevent>
                                                <v-text-field
                                                v-if="editTableNames == index "
                                                label="Name"
                                                v-model="helperName"
                                                :rules="nameRules"
                                                ></v-text-field>
                                            </v-form>
                                            
                                        </v-list-item-content>
                                        <v-list-item-action class="d-flex flex-row">
                                            <v-tooltip bottom v-if="mode != 'view' && editTableNames != index">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon class="grey--text text--darken-2"   @click="changeEditTableNames(item,index)">
                                                            <v-icon
                                                                small
                                                            > mdi-pencil</v-icon>
                                                        </v-btn>
                                                </template>
                                                <span>Edit</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="mode != 'view' && editTableNames == index">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn
                                                        v-bind="attrs"
                                                        v-on="on" 
                                                        :disabled="!validName"
                                                        icon class="grey--text text--darken-2" color="success"  @click="saveTableNames(index)">
                                                            <v-icon
                                                            small
                                                            >mdi-check</v-icon>  
                                                        </v-btn>
                                                </template>
                                                <span>Save changes</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="mode != 'view' && editTableNames == index">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon class="grey--text text--darken-2"  @click="cancelEditTableNames()">
                                                            <v-icon
                                                            small
                                                            >mdi-close</v-icon>  
                                                        </v-btn>
                                                </template>
                                                <span>Cancel</span>
                                            </v-tooltip> 
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-divider  :key="`ldiv-${index}`"></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                        <v-row>
                            <v-col cols="12" class="d-flex ">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-1 black--text align" @click="addName" v-if="mode != 'view' && editTableNames == -1">Add Name</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" >
                                <v-text-field
                                    label="Registration Number"
                                    v-model="fields.RegistrationNumber"
                                    :readonly="mode == 'view'"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-menu
                            ref="menu"
                            v-model="menu1"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            :disabled="mode == 'view'"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="constructionDate"
                                label="Construction Date"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            ref="picker"
                            v-model="fields.ConstructionDate"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1750-01-01"
                            @change="save"
                            ></v-date-picker>
                        </v-menu>

                        <v-menu
                            ref="menu"
                            v-model="menu2"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            :disabled="mode == 'view'"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="serviceStart"
                                label="Service Start Date"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            ref="picker"
                            v-model="fields.ServiceStart"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1750-01-01"
                            @change="save"
                            ></v-date-picker>
                        </v-menu>

                        <v-menu
                            ref="menu"
                            v-model="menu3"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            :disabled="mode == 'view'"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="serviceEnd"
                                label="Service End Date"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            ref="picker"
                            v-model="fields.ServiceEnd"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1750-01-01"
                            @change="save"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
<!-- Owners list -->
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Owner/s:</v-subheader>
                                <v-divider></v-divider>
                                <template v-for="(item, index) in fields.owners">
                                    <v-list-item :key="`nl-${index}`">
                                        <v-list-item-content>
                                            <v-list-item-title v-if="editTableOwners != index || mode == 'view'">{{item.OwnerName}}</v-list-item-title>
                                            <v-form v-model="validOwner" v-if="mode != 'view'" v-on:submit.prevent>
                                                <v-autocomplete
                                                @click="getOwners"
                                                v-model="helperOwner"
                                                :items="owners"
                                                :loading="isLoadingOwner"
                                                clearable
                                                v-if="editTableOwners == index"
                                                label="Owner Name"
                                                :rules="ownerRules"
                                                item-text="OwnerName"
                                                return-object
                                                ></v-autocomplete>
                                            </v-form>
                                        </v-list-item-content>
                                        <v-list-item-action class="d-flex flex-row">
                                            <v-tooltip bottom v-if="mode == 'view'">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on" @click="goToOwner(item)"
                                                        icon class="grey--text text--darken-2"   >
                                                            <v-icon
                                                                small
                                                            > mdi-information</v-icon>
                                                        </v-btn>
                                                </template>
                                                <span>Details</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="mode != 'view' && editTableOwners != index">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon class="grey--text text--darken-2"   @click="deleteOwner(item,index)">
                                                            <v-icon
                                                                small
                                                            > mdi-delete</v-icon>
                                                        </v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="mode != 'view' && editTableOwners == index">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn
                                                        v-bind="attrs"
                                                        v-on="on" 
                                                        :disabled="!validOwner"
                                                        icon class="grey--text text--darken-2" color="success"  @click="saveTableOwners(index)">
                                                            <v-icon
                                                            small
                                                            >mdi-check</v-icon>  
                                                        </v-btn>
                                                </template>
                                                <span>Save changes</span>
                                            </v-tooltip>
                                            <v-tooltip bottom v-if="mode != 'view' && editTableOwners == index">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
                                                        icon class="grey--text text--darken-2"  @click="cancelEditTableOwners()">
                                                            <v-icon
                                                            small
                                                            >mdi-close</v-icon>  
                                                        </v-btn>
                                                </template>
                                                <span>Cancel</span>
                                            </v-tooltip> 
                                        </v-list-item-action>
                                    </v-list-item>
                                    <v-divider  :key="`ldiv-${index}`"></v-divider>
                                </template>
                            </v-list>
                        </v-card>
                        <v-row>
                            <v-col cols="12" class="d-flex ">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-1 black--text align" @click="addOwner" v-if="mode != 'view' && editTableOwners == -1">Add Owner</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row> 
            </v-col>
            <v-col cols="7">
                <v-row>
                    <v-col cols="4">
                        <v-select
                        v-model="fields.VesselType"
                        label="Vessel Type"
                        :items="vesselTypeOptions"
                        :readonly="mode == 'view'"
                        ></v-select>

                        <v-textarea
                            label="Current Location Description"
                            v-model="fields.CurrentLocation"
                            :readonly="mode == 'view'"
                        ></v-textarea>

                        <v-textarea
                            label="Notes"
                            v-model="fields.Notes"
                            :readonly="mode == 'view'"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="8">
<!-- Photos component, it includes a carousel and some dialogs for the button actions -->
                            <Photos :showDefault="showPhotosDefault" :boatID="getBoatID"/>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider> 
<!-- Historic Record component -->
        <HistoricRecord v-if="fields.histories != undefined && mode !='new'" :historicRecords="fields.histories" :mode="'edit'" :boatID="getBoatID" />
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
import Breadcrumbs from '../../../Breadcrumbs.vue';
import Photos from "./Photos/Photos";
import HistoricRecord from "../HistoricRecord";
import PrintButton from "./PrintButton";
import boats from "../../../../controllers/boats";
import owners from "../../../../controllers/owners";
import _ from 'lodash';
export default {
    name: "boatsForm",
    components: { Photos, Breadcrumbs, HistoricRecord, PrintButton },
    data: ()=> ({
        overlay: false,
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
        search: "",
        fields: {},
        fieldsHistory: null,
        owners: [],
    // vessel typle select options
        vesselTypeOptions: ["Launch", "Sternwheeler", "Ferry", "Barge"],
        dateFormatted: "",
    //show a deafult photos component for when the user is adding a new boat
        showPhotosDefault: false
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
            this.showPhotosDefault = true;
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
                Name: "",
                pastNames: [],
                ConstructionDate: "",
                ServiceStart: "",
                ServiceEnd: "",
                RegistrationNumber: "",
                VesselType: "",
                CurrentLocation: "",
                Notes: "",
                photos: [],
                owners: [],
                histories: []
            };
        },
        saveCurrentBoat(){
            localStorage.currentBoatID = this.$route.params.id;
        },
        async getDataFromApi(){
            this.overlay = true;
            if(this.$route.params.id){
                this.saveCurrentBoat();
            }
            this.fields = await boats.getById(localStorage.currentBoatID);
            
            this.fields.owners = this.fields.owners.map(x =>({ ...x, isEdited:false}));
            this.fields.ConstructionDate = this.fields.ConstructionDate ? this.fields.ConstructionDate.substr(0, 10) : "";
            this.fields.ServiceStart = this.fields.ServiceStart ? this.fields.ServiceStart.substr(0, 10) : "";
            this.fields.ServiceEnd = this.fields.ServiceEnd ? this.fields.ServiceEnd.substr(0, 10) : "";
            this.fields.deletedOwners = [];
            this.fields.ownerRemovedArray = [];
            this.fields.originalOwners = JSON.parse(JSON.stringify(this.fields.owners));
            this.overlay = false;
            console.log(this.fields);
        },
        save (date) {
            this.$refs.menu.save(date);
        },
        goToOwner(value){
            this.$router.push({name: 'ownerView', params: { name: value.OwnerName, id: value.id}});
        },
    //Functions dedicated to handle the edit, add, view modes
        cancelEdit(){
            if(this.fieldsHistory){
                this.fields = {...this.fieldsHistory};
            }
            this.mode="view";
            this.resetListVariables();
            this.$router.push(`/boats/view/${this.fields.Name}`);
        },
        cancelNew(){
            this.$router.push(`/boats/`);
        },
        viewMode(){
            this.mode="view";
            this.$router.push(`/boats/view/${this.fields.Name}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.$router.push(`/boats/edit/${this.fields.Name}`);
            this.showSave = 0;
            this.resetListVariables();
        },
        async saveChanges(){
            this.overlay = true; 
            let removedOwners = _.intersectionBy(this.fields.originalOwners, this.fields.deletedOwners, 'id');
            let newOwners = this.fields.owners.filter(x => x.isNew == true)
                .map(x => ({ OwnerID: x.ownerid ? x.ownerid : x.id, CurrentOwner: x.currentowner }));
            let newNames = this.fields.pastNames.filter(x => x.isNew == true).map(x => ({BoatName: x.BoatName}));
            let editedNames = this.fields.pastNames.filter(x => x.isEdited == true);
             let data = {
                    boat: {
                        Name: this.fields.Name,
                        ConstructionDate: this.fields.ConstructionDate,
                        ServiceStart:this.fields.ServiceStart,
                        ServiceEnd: this.fields.ServiceEnd,
                        RegistrationNumber: this.fields.RegistrationNumber,
                        VesselType: this.fields.VesselType,
                        CurrentLocation: this.fields.CurrentLocation,
                        Notes: this.fields.Notes,
                    },
                    ownerNewArray: newOwners,
                    ownerRemovedArray: removedOwners,
                    pastNamesNewArray: newNames,
                    pastNamesEditArray: editedNames
                };
                console.log(data);
                
            let currentBoat= {};
            console.log(this.fields);
            
            if(this.mode == 'new'){
                await boats.post(data);
                this.$router.push(`/boats/`);
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
    //functions for editing the table "Names" values
        changeEditTableNames(item,index){
            this.editTableNames = index;
            this.helperName = item.BoatName;
        },
        cancelEditTableNames(){
            if(this.addingName){
                this.fields.pastNames.pop();
                this.addingName = false;
                this.editTableNames = -1;
            }
            else{
                this.editTableNames = -1;
            }
                
        },
        saveTableNames(index){
            if(this.addingName)
                this.fields.pastNames[index] = {BoatName: this.helperName, isNew: true};
            else{
                this.fields.pastNames[index].BoatName = this.helperName;
                this.fields.pastNames[index].isEdited = true;
            }
            this.showSave = this.showSave+1;
            this.addingName = false;  
            this.editTableNames = -1;     
        },
        addName(){
            this.helperName="";
            this.fields.pastNames.push(""); 
            this.addingName = true;
            this.editTableNames = this.fields.pastNames.length-1;
        },
    //functions for editing the table "Owners" values
        deleteOwner(item,index){
            console.log(this.fields.owners[index]);
            if (index > -1) {
                this.fields.owners.splice(index, 1);
                this.fields.deletedOwners.push(item);
                
                console.log(this.fields.deletedOwners);
                console.log(this.fields.originalOwners);
            }
            
        },
        cancelEditTableOwners(){
            if(this.addingOwner){
                this.fields.owners.pop();
                this.addingOwner = false;  
                this.editTableOwners = -1;
            }
            else{
                this.editTableOwners = -1;
            }
                
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
        addOwner(){
            this.helperOwner="";
            this.fields.owners.push(""); 
            this.addingOwner = true;  
            this.editTableOwners = this.fields.owners.length-1;
        },
        async getOwners(){
            this.isLoadingOwner = true;
            let data = await owners.get();
            let arr = data.body;
            this.owners = _.differenceBy(arr, this.fields.owners, 'OwnerName');
            this.isLoadingOwner = false;
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
    },   
    computed:{
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
            },/* eslint-enable */
            deep: true
        },
        menu1 (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },
        menu2 (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },
        menu3 (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },/* eslint-disable */
        'fields.ConstructionDate': function  (val) {
        this.dateFormatted = this.formatDate(this.date)
        },/* eslint-enable */
    },
}
</script>
