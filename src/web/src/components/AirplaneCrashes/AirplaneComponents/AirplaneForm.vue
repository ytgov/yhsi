<template>
    <div >
        <h3>Airplane Crash Sites</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1 v-if="isViewingCrash">{{fields.yacsinumber}} {{fields.aircrafttype}} ({{fields.aircraftregistration}})</h1>
                <h1 v-else-if="isEditingCrash">Edit: {{fields.yacsinumber}}</h1>
                <h1 v-else>New Crash Site</h1>
                <v-spacer></v-spacer>
<!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="isViewingCrash">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
                <PrintButton  
                    v-if="isViewingCrash" 
                    :data="fields" 
                    :yacsinumber="fields.yacsinumber" 
                    :selectedImage="selectedImage"
                    :loadingPhotos="loadingPhotos"/>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="isEditingCrash">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1 || yacsiWarning.length == 1" v-if="isEditingCrash" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Done
                </v-btn>
<!-- buttons for the new state -->
                <v-btn class="black--text mx-1" @click="cancelNew" v-if="mode == 'new'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1 || yacsiWarning.length == 1" v-if="mode == 'new'" @click="saveChanges">
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
                        <v-text-field outlined dense
                            label="YASCI number"
                            v-model="fields.yacsinumber"
                            :readonly="isViewingCrash"
                            :error-messages="yacsiWarning"
                            @blur="validateYACSI()"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                    <!-- Aircraft Maker -->
                        <v-text-field outlined dense
                            label="Aircraft Make/Model"
                            v-model="fields.aircrafttype"
                            :readonly="isViewingCrash"
                        ></v-text-field>
                    </v-col>
                    <v-col>
                    <!-- Aircraft Registration -->
                        <v-text-field outlined dense
                            label="Aircraft Registration"
                            v-model="fields.aircraftregistration"
                            :readonly="isViewingCrash"
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
                                        v-model="menu"
                                        :close-on-content-click="false"
                                        :return-value.sync="fields.crashdate"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                        :disabled="isViewingCrash"
                                    >
                                        <template v-slot:activator="{ on, attrs }">
                                        <v-text-field outlined dense
                                            v-model="crashdate"
                                            label="Crash Date"
                                            append-icon="mdi-calendar"
                                            readonly
                                            v-bind="attrs"
                                            v-on="on"
                                        ></v-text-field>
                                        </template>
                                        <v-date-picker
                                        v-model="fields.crashdate"
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
                                            @click="$refs.menu.save(fields.crashdate)"
                                        >
                                            OK
                                        </v-btn>
                                        </v-date-picker>
                                    </v-menu>
                                
                            </v-col>
                            <v-col cols="6">
                                <v-select outlined dense
                                    v-model="fields.datedescriptor"
                                    :items="dateDescriptorOptions"
                                    :readonly="isViewingCrash"
                                    label="Date Descriptor"
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field outlined dense
                                    v-model="fields.datenote"
                                    label="Date Note"
                                    :readonly="isViewingCrash"
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
                                    :readonly="isViewingCrash"
                                ></v-checkbox>
                                <v-checkbox
                                    label="American"
                                    value="American"
                                    v-model="fields.nation"
                                    :readonly="isViewingCrash"
                                ></v-checkbox>
                                <v-checkbox
                                    label="Other"
                                    v-model="otherNation"
                                    @click="changeNation"
                                    :readonly="isViewingCrash"
                                ></v-checkbox>
                                <v-text-field outlined dense
                                    v-if="otherNation"
                                    v-model="fields.nation"
                                    label="Other"
                                    :readonly="isViewingCrash"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <h4>Registration Type</h4>
                                <v-checkbox
                                    label="Civilian"
                                    value="Civilian"
                                    v-model="fields.militarycivilian"
                                    :readonly="isViewingCrash"
                                ></v-checkbox>
                                <v-checkbox
                                    label="Military"
                                    value="Military"
                                    v-model="fields.militarycivilian"
                                    :readonly="isViewingCrash"
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
                                    <v-text-field outlined dense
                                        v-model="fields.pilotfirstname"
                                        label="First Name"
                                        :readonly="isViewingCrash"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field outlined dense
                                        v-model="fields.pilotlastname"
                                        label="Last Name"
                                        :readonly="isViewingCrash"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field outlined dense
                                        v-model="fields.pilotrank"
                                        label="Rank"
                                        :readonly="isViewingCrash"
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
                        <Photos 
                        v-if="infoLoaded" 
                        :showDefault="isNewCrash" 
                        :yacsiNumber="getYACSINumber"
                        @updateSelectedImage="selectedImageChanged"
                        @loadingPhotosChange="loadingPhotosChange"/>
                    </v-col>
            </v-col>
        </v-row>
        <MapLoader v-if="infoLoaded"
            :mode="mode"
            @modifiedDataCoordinates="modifiedDataCoordinates"
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
                         <v-text-field outlined dense
                            v-model.number="fields.remainsonsite"
                            label="Remains on Site"
                            :readonly="isViewingCrash"
                            :rules="numberRules"
         
                        ></v-text-field>    
                        <v-textarea outlined dense
                            rows="5"
                            class="mt-0 pt-0"
                            v-model="fields.extentofremainsonsite"
                            label="Extent of Remains on Site"
                            :readonly="isViewingCrash"
                        ></v-textarea>
                    </v-col>
                    <v-col>
                        <v-textarea outlined dense
                            rows="7"
                            v-model="fields.otherlocationsofremains"
                            label="Other Location of Remains"
                            :readonly="isViewingCrash"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </v-col>
             <v-col col="6">
                 <v-row>
                      <v-col cols="6">
                                <v-text-field outlined dense
                                    v-model="fields.soulsonboard"
                                    label="Souls on Board"
                                    :readonly="isViewingCrash"
                                    :rules="numberRules"
                                ></v-text-field>
                                <v-text-field outlined dense
                                    v-model="fields.injuries"
                                    label="Injuries"
                                    :readonly="isViewingCrash"
                                    :rules="numberRules"
                                ></v-text-field>
                                <v-text-field outlined dense
                                    v-model="fields.fatalities"
                                    label="Fatalities"
                                    :readonly="isViewingCrash"
                                    :rules="numberRules"
                                ></v-text-field>
                        </v-col>
                         <v-col cols="6">
                            <v-textarea
                                rows="7" outlined dense
                                v-model="fields.descriptionofcrashevent"
                                label="Description of Crash Event"
                                :readonly="isViewingCrash"
                            ></v-textarea>
                        </v-col>
                 </v-row>
            </v-col>
        </v-row>
<!-- Additional information -->
        <v-row>
            <v-col cols="12">
                <v-textarea outlined dense
                    v-model="fields.comments"
                    label="Additional Information"
                    :readonly="isViewingCrash"
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
                                    <v-list-item-title v-if="index != editTableSources || isViewingCrash">{{item.Source}}</v-list-item-title>
                                    <v-form v-model="validSource" v-if="!isViewingCrash" v-on:submit.prevent>
                                        <v-text-field outlined dense
                                        v-if="editTableSources == index "
                                        label="Source"
                                        v-model="helperSource"
                                        :rules="sourceRules"
                                        ></v-text-field>
                                    </v-form>
                                    
                                </v-list-item-content>
                                <v-list-item-action class="d-flex flex-row">
                                    <v-tooltip bottom v-if="!isViewingCrash && editTableSources != index">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="grey--text text--darken-2"   @click="deleteSource(item,index)">
                                                    <v-icon
                                                        small
                                                    > mdi-delete</v-icon>
                                                </v-btn>
                                        </template>
                                        <span>Delete</span>
                                    </v-tooltip>
                                    <v-tooltip bottom v-if="!isViewingCrash && editTableSources != index">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="grey--text text--darken-2"   @click="changeEditTableSources(item,index)">
                                                    <v-icon
                                                        small
                                                    > mdi-pencil</v-icon>
                                                </v-btn>
                                        </template>
                                        <span>Edit</span>
                                    </v-tooltip>
                                    <v-tooltip bottom v-if="!isViewingCrash && editTableSources == index">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                v-bind="attrs"
                                                v-on="on" 
                                                :disabled="!validSource"
                                                icon class="grey--text text--darken-2" color="success"  @click="saveTableSources(index)">
                                                    <v-icon
                                                    small
                                                    >mdi-check</v-icon>  
                                                </v-btn>
                                        </template>
                                        <span>Save changes</span>
                                    </v-tooltip>
                                    <v-tooltip bottom v-if="!isViewingCrash && editTableSources == index">
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="grey--text text--darken-2"  @click="cancelEditTableSources()">
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
                        <v-btn class="mx-1 black--text align" @click="addSource" v-if="!isViewingCrash && editTableSources == -1">Add Source</v-btn>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="7">
                <v-textarea outlined dense
                    label="Significance of Aircraft"
                    v-model="fields.significanceofaircraft"
                    :readonly="isViewingCrash"
                ></v-textarea>
            </v-col>
        </v-row>


        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>

        <v-dialog
        v-model="dataDialog"
        max-width="490"
        >
            <v-card>
                <v-card-title class="text-h5">
                Double check your field data
                </v-card-title>
                <v-card-text>Make sure your YACSI number has not been entered previously, The YACSI number must be unique.</v-card-text>
                <v-card-actions>
                <v-btn
                    color="green darken-1"
                    text
                    @click="dataDialog = false"
                >
                    Ok
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Breadcrumbs from '../../Breadcrumbs.vue';
import Photos from "./Photos/Photos";
import PrintButton from "./PrintButton";
import aircrash from "../../../controllers/aircrash";
import MapLoader from "./MapLoader";
import _ from 'lodash';
export default {
    name: "crashForm",
    components: { Photos, Breadcrumbs, PrintButton, MapLoader },
    data: ()=> ({
        overlay: false,
    //helper vars used for the name list functions
        editTableSources: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingSource: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperSource: null,
        validSource: false,
        deletedSources: [],
        sourceRules: [
            v => !!v || 'Source is required',
        ],
    //helper vars, they are used to determine if the component is in an edit, view or add new state
        mode: "",
        edit: false,
        showSave: 0,
    //input fields, datatable, etc
        menu: "",
        activePicker: null,
        fields: {},
        fieldsHistory: null,
    // vessel typle select options
        vesselTypeOptions: ["Launch", "Sternwheeler", "Ferry", "Barge"],
        dateFormatted: "",
    // Select vars
        remainsOptions: ["Yes","No", "  ??"],
        dateDescriptorOptions: ["Estimate","Actual"],
        selectedImage: null,
    //modified coordinate fields
        modifiedMapFields: null,
        infoLoaded: false,
    //helper var for the nations checkboxes
        otherNation: false,
    // dialog to inform the user if a field has the wrong data
        dataDialog: false,
    //YACSINUMBER VALIDATION
        yacsiWarning: [],
    //number Rules
        numberRules: [ v =>{
            return /^[0-9]*$/.test(v) || 'A number is required';
        }],

        loadingPhotos: false
    }),
    async mounted(){
        if(this.checkPath("edit")){
            this.mode= "edit";
            //after this, the fields get filled with the info obtained from the api
            await this.getDataFromApi();
            this.fieldsHistory = JSON.parse(JSON.stringify(this.fields));
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
        /*
        console.log('regex');
        console.log(/^[0-9]*$/.test('12'));*/
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
        changeNation(){
            this.fields.nation = "";
        },
        async validateYACSI(){
            //console.log("original ", this.fieldsHistory.yacsinumber, "new",this.fields.yacsinumber);
            if(this.fieldsHistory){
                if(this.fieldsHistory.yacsinumber == this.fields.yacsinumber){
                    this.yacsiWarning = [];
                    return;
                }
            }
            

            let resp = await aircrash.getAvailableYACSI(this.fields.yacsinumber);
            if(resp.available){
                this.yacsiWarning = [];
            }
            else{
                this.yacsiWarning = ["The YACSI Number must be unique."]
            }
            
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
                infoSources:[],
                yacsinumber: "",
                pilotfirstname: "",
                pilotlastname: "",
                pilotrank: "",
                datenote: "",
                datedescriptor: ""
            };
            this.infoLoaded = true;
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
            this.fields.crashdate =  this.fields.crashdate ? this.fields.crashdate.substr(0, 10) : "";
            //this.fields.infoSources = this.fields.sources.includes(";") ? this.fields.sources.split(";") : [];
            if(this.fields.nation != 'Canadian' && this.fields.nation != 'American')    
                this.otherNation = true;
            //console.log(this.fields);
            this.infoLoaded = true;
            this.overlay = false;
        },
    //Functions dedicated to handle the edit, add, view modes
        cancelEdit(){
            if(this.fieldsHistory){
                this.fields = {...this.fieldsHistory};
            }
            this.mode="view";
            this.yacsiWarning = [];
            this.resetListVariables();
            this.$router.push(`/airplane/view/${this.fields.yacsinumber}`);
        },
        cancelNew(){
            this.$router.push(`/airplane/`);
        },
        viewMode(){
            this.mode="view";
            this.$router.push(`/airplane/view/${this.fields.yacsinumber}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.$router.push(`/airplane/edit/${this.fields.yacsinumber}`);
            this.showSave = 0;
            this.resetListVariables();
        },
        resetListVariables(){
            this.addingSource = false;  
            this.editTableSources = -1;
        },
        async saveChanges(){
            this.overlay = true;
            //console.log(this.fields);
        //Mapping coordinate data
            let { lat, long, inyukon, crashlocation, accuracy } = this.modifiedMapFields;
            this.fields.lat = lat;
            this.fields.long = long;
            this.fields.inyukon = inyukon;
            this.fields.crashlocation = crashlocation;
            this.fields.accuracy = accuracy;
        //Mapping general fields
            let crash = { ...this.fields }
            crash.pilot = this.getPilotName();
            crash.sources = this.getSources();
            crash.Location = `POINT(${crash.long} ${crash.lat})`
        //Removing useless values
            delete crash.pilotFirstName;
            delete crash.pilotLastName;
            delete crash.infoSources;
            delete crash.sources;
            delete crash.lat;
            delete crash.long;
        //Mapping infosources
            let editedInfoSources = this.fields.infoSources.filter(x => x.isEdited == true);
            let removedInfoSources = this.deletedSources;
            let newInfoSources = this.fields.infoSources.filter(x => x.isNew == true).map(x => ({Type: x.Type, Source: x.Source}));
        //Final data obj
             let data = {
                    aircrash: crash,
                    removedInfoSources,
                    newInfoSources,
                    editedInfoSources
                };
            
            if(this.mode == 'new'){
                console.log("api call");
                let resp = await aircrash.post(data);
                if(resp.response){
                    if(resp.status == 409){
                        this.$store.commit('alerts/setText', "The Yacsi number already exists.");
                        this.$store.commit('alerts/setType', "warning");
                        this.$store.commit('alerts/setTimeout', 5000);
                        this.$store.commit('alerts/setAlert', true);
                        this.overlay = false;
                    }
                }
                else{
                    this.overlay = false;
                    this.$router.push(`/airplane/`);
                }
                
            }
            else{
                await aircrash.put(localStorage.currentCrashNumber,data);
                this.overlay = false;
                this.mode = 'view';
                this.$router.push({name: 'airplaneView', params: { name: localStorage.currentCrashNumber, yacsinumber: localStorage.currentCrashNumber}});
            } 
        },
    //functions for editing the table "Sources" values
        changeEditTableSources(item,index){
            this.editTableSources = index;
            this.helperSource = item.Source;
        },
        deleteSource(item,index){            
            if (index > -1) {
                this.fields.infoSources.splice(index, 1);
                if(!item.isNew)
                    this.deletedSources.push(item);
            }
        },
        cancelEditTableSources(){
            if(this.addingSource){
                this.fields.infoSources.pop();
                this.addingSource = false;
                this.editTableSources = -1;
            }
            else{
                this.editTableNames = -1;
            }      
        },
        saveTableSources(index){
            if(this.addingSource)
                this.fields.infoSources[index] = { Source: this.helperSource, Type: 'Reference', isNew: true };
            else{
                this.fields.infoSources[index].Source = this.helperSource;
                if(!this.fields.infoSources[index].isNew)
                    this.fields.infoSources[index].isEdited = true;
            }
                
            this.addingSource = false;  
            this.editTableSources = -1;     
        },
        addSource(){
            this.helperSource="";
            this.fields.infoSources.push(""); 
            this.addingSource = true;
            this.editTableSources = this.fields.infoSources.length-1;
        },
        formatDate (date) {
          if (!date) return null
          //date = date.substr(0, 10);
          const [year, month, day] = date.split('-')
          return `${month}/${day}/${year}`
        },
        getPilotName(){
            return `${this.fields.pilotLastName},${this.fields.pilotFirstName}`
        },
        getSources(){
            return _.join(this.fields.infoSources, ';');
        },
        modifiedDataCoordinates(val){
            this.modifiedMapFields = val;
            this.showSave = this.showSave+1;
        },
        selectedImageChanged(val){
            this.selectedImage = val;
            //console.log(val);
        },
        loadingPhotosChange(val){
            this.loadingPhotos = val;
        }
        
    },   
    computed:{
        getYACSINumber(){
            if(this.$route.params.yacsinumber){
                return  this.$route.params.yacsinumber;
            }
            else return localStorage.currentCrashNumber;
        },
        crashdate(){
            return this.formatDate(this.fields.crashdate);
        },
        isNewCrash(){
            return this.mode == "new";
        },
        isEditingCrash(){
            return this.mode == "edit";
        },
        isViewingCrash(){
            return this.mode == "view";
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
            val && setTimeout(() => (this.activePicker  = 'YEAR'))
        },/* eslint-disable */
        'fields.crashdate': function  (val) {
        this.dateFormatted = this.formatDate(this.fields.crashdate)
        },/* eslint-enable */
    },
}
</script>
