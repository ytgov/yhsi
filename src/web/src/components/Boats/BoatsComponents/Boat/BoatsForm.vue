<template>
    <div >
        <h3>Boats</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1 v-if="mode != 'new'">{{fields.Name}}</h1>
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
                <v-btn color="success" :disabled="showSave < 2" v-if="mode == 'edit'" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Save Changes
                </v-btn>
<!-- buttons for the new state -->
                <v-btn class="black--text mx-1" @click="cancelNew" v-if="mode == 'new'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 2" v-if="mode == 'new'" @click="saveChanges">
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Save Changes
                </v-btn>
            </v-col>
        </v-row>
        <v-row >
            <v-col cols="5">
                <v-row >
                    <v-col cols="6">
<!-- Names list -->
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Name/s:</v-subheader>
                                <v-divider></v-divider>
                                <template v-for="(item, index) in fields.names">
                                    <v-list-item :key="`nl-${index}`">
                                        <v-list-item-content>
                                            <v-list-item-title v-if="index != editTableNames || mode == 'view'">{{item}}</v-list-item-title>
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
                                v-model="fields.ConstructionDate"
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
                            min="1950-01-01"
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
                                v-model="fields.ServiceStart"
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
                            min="1950-01-01"
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
                                v-model="fields.ServiceEnd"
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
                            min="1950-01-01"
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
                                                <!--
                                                    v-model="helperOwner"
                                                :items="owners"
                                                -->
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
                                                        icon class="grey--text text--darken-2"   @click="changeEditTableOwners(item,index)">
                                                            <v-icon
                                                                small
                                                            > mdi-pencil</v-icon>
                                                        </v-btn>
                                                </template>
                                                <span>Edit</span>
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
                        <v-combobox
                        v-model="fields.VesselType"
                        label="Vessel Type"
                        :readonly="mode == 'view'"
                        ></v-combobox>

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
                            <Photos />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider> 
<!-- Historic Record component -->
        <HistoricRecord :historicRecords="fields.histories" :mode="mode"/>
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
import Photos from "./Photos";
import HistoricRecord from "../HistoricRecord";
import PrintButton from "./PrintButton";
import boats from "../../../../controllers/boats";
import owners from "../../../../controllers/owners";
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
        owners: []
    }),
    created(){
        if(this.$route.path.includes("edit")){
            this.mode= "edit";
            //after this, the fields get filled with the info obtained from the api
            this.getDataFromApi();
        }
        else if(this.$route.path.includes("new")){
            this.mode="new";
            //inputs remain empty
            this.noData();
        }
        else if(this.$route.path.includes("view")){
            this.mode="view";
            //after this, the fields get filled with the info obtained from the api
            this.getDataFromApi();
        }
    },
    methods:{
        noData(){
            this.fields = {
                Name: "",
                names: [],
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
            console.log("FIELDS");
            console.log(this.fields);
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
                    owners: this.fields.owners,
                    histories: this.fields.histories
                };
                console.log(data);
            if(this.mode == 'new'){
                //makes an axios post request
                console.log( await boats.post(data));
            }
            else{
                //makes an axios put request
                //boats.put(somedata);
                await boats.put(localStorage.currentBoatID,data);
            }
            this.overlay = false;
            this.mode = 'view';
            this.$router.push({name: 'boatView', params: { name: this.fields.Name, id: this.fields.Id}});
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
            this.helperName = item;
        },
        cancelEditTableNames(){
            if(this.addingName){
                this.fields.names.pop();
                this.addingName = false;
                this.editTableNames = -1;
            }
            else if(this.validName && this.addingName == false){
                this.editTableNames = -1;
            }
                
        },
        saveTableNames(index){
            this.fields.names[index] = this.helperName;
            this.addingName = false;  
            this.editTableNames = -1;      
        },
        addName(){
            this.helperName="";
            this.fields.names.push(""); 
            this.addingName = true;
            this.editTableNames = this.fields.names.length-1;
        },
    //functions for editing the table "Owners" values
        changeEditTableOwners(item,index){
            this.editTableOwners = index;
            this.helperOwner = item;
        },
        cancelEditTableOwners(){
            if(this.addingOwner){
                this.fields.owners.pop();
                this.addingOwner = false;  
                this.editTableOwners = -1;
            }
            else if(this.validOwner && this.addingOwner == false){
                this.editTableOwners = -1;
            }
                
        },
        saveTableOwners(index){
            this.fields.owners[index] = this.helperOwner.name ? this.helperOwner.name : this.helperOwner;   
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
            this.owners = await owners.get();
            this.isLoadingOwner = false;
        }
    },
    computed:{/* MIGHT NEED THIS LATER
        availableOwners(){
            let allowners = this.owners;
            let boatOwners = this.fields.owners;

            const index = array.indexOf(5);
            if (index > -1) {
            array.splice(index, 1);
            }
        }*/
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
        },
    },
}
</script>
