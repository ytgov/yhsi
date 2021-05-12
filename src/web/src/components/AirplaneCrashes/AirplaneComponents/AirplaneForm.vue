<template>
    <div >
        <h3>Airplane Crash Sites</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1>1927-01</h1>
                <h1 v-if="mode == 'view'">{{fields.yacsinumber}}</h1>
                <v-text-field v-else-if="mode == 'edit'"
                    label="Boat name"
                    v-model="fields.yacsinumber"
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
                    Create Crash Site
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
                            v-model="fields.yacsinumber"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                    <!-- Aircraft Maker -->
                        <v-text-field
                            label="Aircraft Maker"
                            v-model="fields.aircrafttype"
                            :readonly="mode == 'view'"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                    <!-- Aircraft Registration -->
                        <v-text-field
                            label="Aircraft Registration"
                            v-model="fields.aircraftregistration"
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
                                        v-model="crashdate"
                                        label="Crash Date"
                                        append-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    ></v-text-field>
                                    </template>
                                    <v-date-picker
                                    ref="picker"
                                    v-model="fields.crashdate"
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
                                    v-model="fields.pilotLastName"
                                    label="Date Note"
                                    :readonly="mode == 'view'"
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
                                    value="Canadian"
                                    v-model="fields.nation"
                                    :readonly="mode == 'view'"
                                ></v-checkbox>
                                <v-checkbox
                                    label="American"
                                    value="American"
                                    v-model="fields.nation"
                                    :readonly="mode == 'view'"
                                ></v-checkbox>
                                <v-checkbox
                                    label="Other"
                                    value="Other"
                                    v-model="fields.nation"
                                    :readonly="mode == 'view'"
                                ></v-checkbox>
                                <v-text-field
                                    v-if="fields.nation == 'Other'"
                                    v-model="fields.nation"
                                    label="Other"
                                    :readonly="mode == 'view'"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <h4>Registration Type</h4>
                                <v-checkbox
                                    label="Civilian"
                                    value="Civilian"
                                    v-model="fields.militarycivilian"
                                    :readonly="mode == 'view'"
                                ></v-checkbox>
                                <v-checkbox
                                    label="Military"
                                    value="Military"
                                    v-model="fields.militarycivilian"
                                    :readonly="mode == 'view'"
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
                                        v-model="fields.pilotFirstName"
                                        label="First Name"
                                        :readonly="mode == 'view'"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="fields.pilotLastName"
                                        label="Last Name"
                                        :readonly="mode == 'view'"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="fields.pilotLastName"
                                        label="Rank"
                                        :readonly="mode == 'view'"
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
        <GoogleMapLoader 
            :mode="mode"
            :fields="{  accuracy: fields.accuracy,
                        inyukon: fields.inyukon,
                        crashlocation: fields.crashlocation,
                        lat: fields.lat,
                        long: fields.long,
                        Location: fields.Location } "/>
        <v-row>
            <v-col col="6">
                <v-row>
                    <v-col>        
                        <v-select
                            :items="remainsOptions"
                            v-model="fields.remainsonsite"
                            label="Remains on Site"
                            :readonly="mode == 'view'"
                        ></v-select>
                        <v-textarea
                            rows="5"
                            class="mt-0 pt-0"
                            v-model="fields.extentofremainsonsite"
                            label="Extent of Remains on Site"
                            :readonly="mode == 'view'"
                        ></v-textarea>
                    </v-col>
                    <v-col>
                        <v-textarea
                            rows="7"
                            v-model="fields.otherlocationsofremains"
                            label="Other Location of Remains"
                            :readonly="mode == 'view'"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </v-col>
             <v-col col="6">
                 <v-row>
                      <v-col cols="6">
                                <v-text-field
                                    v-model="fields.soulsonboard"
                                    label="Souls on Board"
                                    :readonly="mode == 'view'"
                                ></v-text-field>
                                <v-text-field
                                    v-model="fields.injuries"
                                    label="Injuries"
                                    :readonly="mode == 'view'"
                                ></v-text-field>
                                <v-text-field
                                    v-model="fields.fatalities"
                                    label="Fatalities"
                                    :readonly="mode == 'view'"
                                ></v-text-field>
                        </v-col>
                         <v-col cols="6">
                            <v-textarea
                                rows="7"
                                v-model="fields.descriptionofcrashevent"
                                label="Description of Crash Event"
                                :readonly="mode == 'view'"
                            ></v-textarea>
                        </v-col>
                 </v-row>
            </v-col>
        </v-row>
<!-- Additional information -->
        <v-row>
            <v-col cols="12">
                <v-textarea
                    v-model="fields.comments"
                    label="Additional Information"
                    :readonly="mode == 'view'"
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
                        <template v-for="(item, index) in fields.infoSources">
                            <v-list-item :key="`nl-${index}`">
                                <v-list-item-content>
                                    <v-list-item-title v-if="index != editTableSources || mode == 'view'">{{item}}</v-list-item-title>
                                    <v-form v-model="validSource" v-if="mode != 'view'" v-on:submit.prevent>
                                        <v-text-field
                                        v-if="editTableSources == index "
                                        label="Source"
                                        v-model="helperSource"
                                        :rules="sourceRules"
                                        ></v-text-field>
                                    </v-form>
                                    
                                </v-list-item-content>
                                <v-list-item-action class="d-flex flex-row">
                                    <v-tooltip bottom v-if="mode != 'view' && editTableSources != index">
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
                                    <v-tooltip bottom v-if="mode != 'view' && editTableSources == index">
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
                                    <v-tooltip bottom v-if="mode != 'view' && editTableSources == index">
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
                        <v-btn class="mx-1 black--text align" @click="addName" v-if="mode != 'view' && editTableSources == -1">Add Source</v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="7">
                <v-textarea
                    label="Significance of Aircraft"
                    v-model="fields.significanceofaircraft"
                    :readonly="mode == 'view'"
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
import aircrash from "../../../controllers/aircrash";
import GoogleMapLoader from "./GoogleMapLoader";
import _ from 'lodash';
export default {
    name: "crashForm",
    components: { Photos, Breadcrumbs, PrintButton, GoogleMapLoader },
    data: ()=> ({
        overlay: false,
    //helper vars used for the name list functions
        editTableSources: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingSource: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperSource: null,
        validSource: false,
        sourceRules: [
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
    //Pilot helper fields
        pilotFirstName: "",
        PilotLastName: "",
    // vessel typle select options
        vesselTypeOptions: ["Launch", "Sternwheeler", "Ferry", "Barge"],
        dateFormatted: "",
    //show a deafult photos component for when the user is adding a new crash site
        showPhotosDefault: false,
    // Select vars
        remainsOptions: ["Yes","No", "  ??"],
        dateDescriptorOptions: ["Actual"]
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
                Location: "",
                accuracy: "",
                aircraftaftercrashcaption: "",
                aircraftcaption: "",
                aircraftregistration: "",
                aircrafttype:"" ,
                comments: "",
                crashdate: "",
                crashlocation: "",
                descriptionofcrashevent: "",
                extentofremainsonsite: "",
                fatalities: "",
                injuries: "",
                inyukon: "",
                lat: "",
                long: "",
                militarycivilian: "",
                nation: "",
                otherlocationsofremains: "",
                photographs: "",
                pilot: "",
                remainsonsite: "",
                significanceofaircraft:"",
                soulsonboard: "",
                sources: "",
                yacsinumber: "",
            };
        },
        saveCurrentCrash(){
            localStorage.currentCrashNumber = this.$route.params.yacsinumber;
        },
        async getDataFromApi(){
            this.overlay = true;
            if(this.$route.params.yacsinumber){
                this.saveCurrentCrash();
            }
            this.fields = await aircrash.getById(localStorage.currentCrashNumber);
            this.fields.crashdate = this.formatDate(this.fields.crashdate);
            let pilotname = this.fields.pilot.split(',');
            this.fields.pilotFirstName = pilotname[1];
            this.fields.pilotLastName = pilotname[0];
            this.fields.infoSources = this.fields.sources.split(";");
            console.log(this.fields);
            this.overlay = false;
        },
        save (date) {
            this.$refs.menu.save(date);
        },
    //Functions dedicated to handle the edit, add, view modes
        cancelEdit(){
            if(this.fieldsHistory){
                this.fields = {...this.fieldsHistory};
            }
            this.mode="view";
            this.resetListVariables();
            this.$router.push(`/airplane/view/${this.fields.Name}`);
        },
        cancelNew(){
            this.$router.push(`/airplane/`);
        },
        viewMode(){
            this.mode="view";
            this.$router.push(`/airplane/view/${this.fields.Name}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.$router.push(`/airplane/edit/${this.fields.Name}`);
            this.showSave = 0;
            this.resetListVariables();
        },
        async saveChanges(){
            this.overlay = true; 
            console.log(this.fields);
            let aircrash = { ...this.fields }
            aircrash.pilot = this.getPilotName();
            aircrash.sources = this.getSources();
            delete aircrash.pilotFirstName;
            delete aircrash.pilotLastName;
            delete aircrash.infoSources;
             let data = {
                    aircrash
                };
                console.log(data);
                
            let currentCrash= {};
            if(this.mode == 'new'){
                await aircrash.post(data);
                this.overlay = false;
                this.$router.push(`/airplane/`);
            }
            else{
                let resp = await aircrash.put(localStorage.currentCrashNumber,data);
                currentCrash.id = localStorage.currentCrashNumber;
                currentCrash.name = resp.boat.Name; 
                this.overlay = false;
                this.mode = 'view';
                this.$router.push({name: 'airplaneView', params: { name: currentCrash.currentCrashNumber, yacsinumber: currentCrash.currentCrashNumber}});
            }  
        },
    //functions for editing the table "Names" values
        changeEditTableNames(item,index){
            this.editTableSources = index;
            this.helperSource = item;
        },
        cancelEditTableNames(){
            if(this.addingName){
                this.fields.infoSources.pop();
                this.addingSource = false;
                this.editTableSources = -1;
            }
            else{
                this.editTableNames = -1;
            }      
        },
        saveTableNames(index){
            if(this.addingName)
                this.fields.infoSources[index] = this.helperSource;
            else
                this.fields.infoSources[index] =  this.helperSource;
            this.addingSource = false;  
            this.editTableSources = -1;     
        },
        addName(){
            this.helperSource="";
            this.fields.infoSources.push(""); 
            this.addingSource = true;
            this.editTableSources = this.fields.infoSources.length-1;
        },
        formatDate (date) {
          if (!date) return null
          date = date.substr(0, 10);
          const [year, month, day] = date.split('-')
          return `${month}/${day}/${year}`
        },
        getPilotName(){
            return `${this.pilotLastName},${this.pilotFirstName}`
        },
        getSources(){
            return _.join(this.fields.infoSources, ';');
        }
        
    },   
    computed:{
        getBoatID(){
            if(this.$route.params.id){
                return  this.$route.params.id;
            }
            else return localStorage.currentBoatID;
        },
        crashdate(){
            return this.formatDate(this.fields.crashdate);
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
        'fields.crashdate': function  (val) {
        this.dateFormatted = this.formatDate(this.date)
        },/* eslint-enable */
    },
}
</script>
