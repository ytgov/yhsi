<template>
    <div >
        <h3>Airplane Crash Sites</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1>1927-01</h1>
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
<!-- General fields -->

        <v-row >
            <v-col cols="7">
                <v-row>
                    <v-col>
                    <!-- YASCI number -->
                        <v-text-field
                            label="YASCI number"
                            v-model="fields.RegistrationNumber"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                    <!-- Aircraft Maker -->
                        <v-text-field
                            label="Aircraft Maker"
                            v-model="fields.RegistrationNumber"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                    <!-- Aircraft Registration -->
                        <v-text-field
                            label="Aircraft Registration"
                            v-model="fields.RegistrationNumber"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="6" >   
                            <!-- Crash Date -->
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
                                        label="Crash Date"
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
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                    :items="dateDescriptorOptions"
                                    label="Date Descriptor"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="constructionDate"
                                    label="Date Note"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="6">
                        <v-row>
                            <v-col cols="6">
                                <h4>Country of Registration</h4>
                                <v-checkbox
                                    label="Canadian"
                                    v-model="fields.Private"
                                ></v-checkbox>
                                <v-checkbox
                                    label="American"
                                    v-model="fields.Private"
                                ></v-checkbox>
                                <v-checkbox
                                    label="Other"
                                    v-model="fields.Private"
                                ></v-checkbox>
                                <v-text-field
                                    v-model="constructionDate"
                                    label="Other"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <h4>Registration Type</h4>
                                <v-checkbox
                                    label="Civilian"
                                    v-model="fields.Private"
                                ></v-checkbox>
                                <v-checkbox
                                    label="Military"
                                    v-model="fields.Private"
                                ></v-checkbox>
                            </v-col>
                        </v-row> 
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-alert
                        outlined
                        color="primary"
                        >
                            <div class="sub-title">
                                Pilot
                            </div>
                            <v-row>
                                <v-col>
                                    <v-text-field
                                        v-model="constructionDate"
                                        label="First Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="constructionDate"
                                        label="Last Name"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="constructionDate"
                                        label="Rank"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-alert>
                        
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="5">
                    <v-col cols="12">
<!-- Photos component, it includes a carousel and some dialogs for the button actions -->
                        <Photos :showDefault="showPhotosDefault" :boatID="getBoatID"/>
                    </v-col>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="5">
                <v-alert
                outlined
                color="primary"
                >
                    <div class="sub-title">
                        Location
                    </div>
                    <v-row>
                        <v-col>
                            <v-select
                                :items="coordinateSystemOptions"
                                return-object
                                item-text="text"
                                label="Coordinate System"
                                v-model="selectedSystem"
                            ></v-select>
                        </v-col>
                        <v-col>
                            <v-select
                                :items="projectionOptions"
                                label="Projection"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col :cols="2.4">
                            <h4>Latitude</h4>
                        </v-col>
                        <v-col :cols="showLocationColumn ? '' : 9">
                            <h4>Degrees</h4>
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="showLocationColumn">
                            <h4>Minutes</h4>
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="showLocationColumn">
                            <h4>Seconds</h4>
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="showLocationColumn">
                            <h4>Direction</h4>
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="2.4">
                            <h4>Longitude</h4>
                        </v-col>
                        <v-col :cols="showLocationColumn ? '' : 9">
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="showLocationColumn">
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="showLocationColumn">
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="showLocationColumn">
                            <v-text-field
                                v-model="constructionDate"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="showLocationAlert">
                        <v-col>
                            <v-alert
                            dense
                            outlined
                            type="error"
                            >
                            The location you entered is not in the <strong>Yukon</strong>
                            </v-alert>
                        </v-col>    
                    </v-row>
                </v-alert>
            </v-col>
            <v-col cols="2">
                <v-textarea
                    label="Crash Location Description"
                    v-model="constructionDate"
                ></v-textarea>
                <v-select
                    label="Location Accuracy"
                    :items="locationAccuracyOptions"
                ></v-select>
                <v-checkbox 
                label="Creash site within Yukon">
                </v-checkbox>
            </v-col>
            <v-col cols="5">
                <GoogleMapLoader/>
            </v-col>
        </v-row>
        <v-row>
            <v-col col="6">
                <v-row>
                    <v-col>        
                        <v-select
                            :items="remainsOptions"
                            label="Remains on Site"
                        ></v-select>
                        <v-textarea
                            rows="5"
                            class="mt-0 pt-0"
                            label="Extent of Remains on Site"
                        ></v-textarea>
                    </v-col>
                    <v-col>
                        <v-textarea
                            rows="7"
                            label="Other Location of Remains"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </v-col>
             <v-col col="6">
                 <v-row>
                      <v-col cols="6">
                                <h4>Country of Registration</h4>
                                <v-text-field
                                    v-model="constructionDate"
                                    label="Souls on Board"
                                ></v-text-field>
                                <v-text-field
                                    v-model="constructionDate"
                                    label="Injuries"
                                ></v-text-field>
                                <v-text-field
                                    v-model="constructionDate"
                                    label="Fatalities"
                                ></v-text-field>
                        </v-col>
                         <v-col cols="6">
                            <v-textarea
                                rows="7"
                                label="Description of Crash Event"
                            ></v-textarea>
                        </v-col>
                 </v-row>
            </v-col>
        </v-row>
<!-- Additional information -->
        <v-row>
            <v-col cols="12">
                <v-textarea
                    label="Additional Information"
                ></v-textarea>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="5">
            <!-- Information source list -->
                <v-card>
                    <v-list class="pa-0" >
                        <v-subheader>Information Source</v-subheader>
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
                        <v-btn class="mx-1 black--text align" @click="addName" v-if="mode != 'view' && editTableNames == -1">Add Source</v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="7">
                <v-textarea
                    label="Significance of Aircraft"
                ></v-textarea>
            </v-col>
        </v-row>


        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
    </div>
</template>

<script>
import Breadcrumbs from '../../Breadcrumbs.vue';
import Photos from "./Photos";
import PrintButton from "./PrintButton";
import boats from "../../../controllers/boats";
import GoogleMapLoader from "./GoogleMapLoader";
export default {
    name: "boatsForm",
    components: { Photos, Breadcrumbs, PrintButton, GoogleMapLoader },
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
        showPhotosDefault: false,
    //showLocationAlert
        showLocationAlert: false,
    // Select vars
        selectedSystem: null,
        projectionOptions: ["NAD 83", "NAD 83 CSRS", "WSG 84"],
        coordinateSystemOptions: [{id: 1, text: "Degrees, Minutes, Seconds"},{id: 2, text:  "UMT Zone 8"}, {id: 3, text: "Decimal Degrees"}],
        remainsOptions: ["Yes, No"],
        locationAccuracyOptions: ["Approximate"],
        dateDescriptorOptions: ["Actual"]
    }),
    mounted(){
        if(this.checkPath("edit")){
            this.mode= "edit";
            //after this, the fields get filled with the info obtained from the api
            //this.getDataFromApi();
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
            //this.getDataFromApi();
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
            console.log(this.fields);
            this.fields.owners = this.fields.owners.map(x =>({ ...x, isEdited:false}));
            this.fields.ConstructionDate = this.fields.ConstructionDate ? this.fields.ConstructionDate.substr(0, 10) : "";
            this.fields.ServiceStart = this.fields.ServiceStart ? this.fields.ServiceStart.substr(0, 10) : "";
            this.fields.ServiceEnd = this.fields.ServiceEnd ? this.fields.ServiceEnd.substr(0, 10) : "";
            this.overlay = false;
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
            console.log(this.fields.owners);
            let editedOwners = this.fields.owners.filter(x => x.isEdited == true)
                .map(x => ({ OwnerID: x.ownerid ? x.ownerid : x.id, CurrentOwner: x.currentowner }));
            let newOwners = this.fields.owners.filter(x => x.isNew == true)
                .map(x => ({ OwnerID: x.ownerid ? x.ownerid : x.id, CurrentOwner: x.currentowner }));
            let newNames = this.fields.owners.filter(x => x.isNew == true);
            let editedNames = this.fields.owners.filter(x => x.isEdited == true);
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
                    ownerNewArray: editedOwners,
                    ownerEditArray: newOwners,
                    pastNamesNewArray: newNames,
                    pastNamesEditArray: editedNames
                };
                console.log(data);
                
            let currentBoat= {};
            if(this.mode == 'new'){
                let resp =  await boats.post(data);
                currentBoat.id = resp.Id;
                currentBoat.name = resp.Name;
            }
            else{
                let resp = await boats.put(localStorage.currentBoatID,data);
                currentBoat.id = localStorage.currentBoatID;
                currentBoat.name = resp.boat.Name; 
            }
            this.overlay = false;
            this.mode = 'view';
            this.$router.push({name: 'boatView', params: { name: currentBoat.name, id: currentBoat.id}});
            
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
            else
                this.fields.pastNames[index] = {BoatName: this.helperName, isEdited: true};
            this.addingName = false;  
            this.editTableNames = -1;     
        },
        addName(){
            this.helperName="";
            this.fields.pastNames.push(""); 
            this.addingName = true;
            this.editTableNames = this.fields.pastNames.length-1;
        },
        formatDate (date) {
        if (!date) return null
        //date = date.substr(0, 10);
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
    },   
    computed:{
        showLocationColumn(){
            if(!this.selectedSystem)
                return true;
            if(this.selectedSystem.id == 1)
                return true;
            else    
                return false;
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
