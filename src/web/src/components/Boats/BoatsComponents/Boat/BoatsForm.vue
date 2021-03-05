<template>
    <div >
        
        <h3>Boats</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1 v-if="mode != 'new'">{{name}}</h1>
                <h1 v-else>New Boat</h1>
                <v-spacer></v-spacer>
<!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="mode == 'view'">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
                <PrintButton  v-if="mode == 'view'" :data="fields" :name="name"/>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="mode == 'edit'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 2" v-if="mode == 'edit'" @click="mode = 'view'" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Save Changes
                </v-btn>
<!-- buttons for the new state -->
                <v-btn class="black--text mx-1" @click="cancelNew" v-if="mode == 'new'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 2" v-if="mode == 'new'" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Save Changes
                </v-btn>
            </v-col>
        </v-row>
        <v-row >
            <v-col cols="5">
                <v-row >
                    <v-col cols="6">
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Name/s:</v-subheader>
                                <v-divider></v-divider>
                                <template v-for="(item, index) in fields.names">
                                    <v-list-item :key="`nl-${index}`">
                                        <v-list-item-content>
                                            <v-list-item-title v-if="index != editTableNames || mode == 'view'">{{item}}</v-list-item-title>
                                            <v-form v-model="validName" v-if="mode != 'view'">
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
                                    v-model="fields.registrationNumber"
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
                                v-model="fields.constructionDate"
                                label="Construction Date"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            ref="picker"
                            v-model="fields.constructionDate"
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
                                v-model="fields.serviceStartDate"
                                label="Service Start Date"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            ref="picker"
                            v-model="fields.serviceStartDate"
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
                                v-model="fields.serviceEndDate"
                                label="Service End Date"
                                append-icon="mdi-calendar"
                                readonly
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            ref="picker"
                            v-model="fields.serviceEndDate"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1950-01-01"
                            @change="save"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Owner/s:</v-subheader>
                                <v-divider></v-divider>
                                <template v-for="(item, index) in fields.owners">
                                    <v-list-item :key="`nl-${index}`">
                                        <v-list-item-content>
                                            <v-list-item-title v-if="editTableOwners != index || mode == 'view'">{{item}}</v-list-item-title>
                                            <v-form v-model="validOwner" v-if="mode != 'view'">
                                                <v-text-field
                                                v-if="editTableOwners == index"
                                                label="Owner Name"
                                                v-model="helperOwner"
                                                :rules="ownerRules"
                                                ></v-text-field>
                                            </v-form>
                                        </v-list-item-content>
                                        <v-list-item-action class="d-flex flex-row">
                                            <v-tooltip bottom v-if="mode == 'view'">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on"
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
                        v-model="fields.vesselType"
                        label="Vessel Type"
                        :readonly="mode == 'view'"
                        ></v-combobox>

                        <v-textarea
                            label="Current Location Description"
                            v-model="fields.currentLocationDescription"
                            :readonly="mode == 'view'"
                        ></v-textarea>

                        <v-textarea
                            label="Notes"
                            v-model="fields.notes"
                            :readonly="mode == 'view'"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="8">
                            <Photos :photos="photos" />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <HistoricRecord :historicRecords="fields.historicRecords" :mode="mode"/>

    </div>
</template>

<script>
import Breadcrumbs from '../../../Breadcrumbs.vue';
import Photos from "./Photos";
import HistoricRecord from "../HistoricRecord";
import PrintButton from "./PrintButton";
export default {
    name: "boatsForm",
    components: { Photos, Breadcrumbs, HistoricRecord, PrintButton },
    data: ()=> ({
        name: "Evelyn",
    //helper vars used for the name list functions
        editTableNames: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingName: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperName: null,
        validName: false,
        nameRules: [
            v => !!v || 'Name is required',
        ],
    //helper vars used for the name list functions
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
    //helper vars for when v-model is not an option (inside the datatable)
        historiRecordHelper: "",
        referenceHelper: "",
    //input fields, datatable, etc
        menu1: "",
        menu2: "",
        menu3: "",
        search: "",
        fields: {},
        fieldsHistory: null,
        photos: [
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
          },
          {
            src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
          },
        ],


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
                names: [],
                constructionDate: "",
                serviceStartDate: "",
                serviceEndDate: "",
                registrationNumber: "",
                vesselType: "",
                currentLocationDescription: "",
                notes: "",
                photos: [],
                owners: [],
                historicRecords: []
            };
        },
        getDataFromApi(){
            this.fields = {
                names: ["Evelyn", "Norcom"],
                constructionDate: "",
                serviceStartDate: "",
                serviceEndDate: "",
                registrationNumber: "registrationNumber",
                vesselType: "vesselType",
                currentLocationDescription: "currentLocationDescription",
                notes: "notesnotesnotesnotesnotesnotesnotes",
                photos: [],
                owners: [ "Owner 1", "Owner 2", "Owner 3"],
                historicRecords: [
                    {historicRecord: "some text", reference: "wdadwdawdad"},
                    {historicRecord: "historic record 2", reference: "adawddad"}
                ]
            };
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
            this.$router.push(`/boats/view/${this.name}`);
        },
        cancelNew(){
            this.$router.push(`/boats/`);
        },
        viewMode(){
            this.mode="view";
            this.$router.push(`/boats/view/${this.name}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.$router.push(`/boats/edit/${this.name}`);
            this.showSave = 0;
            this.resetListVariables();
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
            this.fields.owners[index] = this.helperOwner;   
            this.addingOwner = false;  
            this.editTableOwners = -1;    
        },
        addOwner(){
            this.helperOwner="";
            this.fields.owners.push(""); 
            this.addingOwner = true;  
            this.editTableOwners = this.fields.owners.length-1;
        },
    },
    watch: {
        fields: {
            handler(newval){
                console.log("Value changed",newval);
                this.showSave = this.showSave+1;
            },
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
