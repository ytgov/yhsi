<template>
    <div>
        <h3>Boat Owner</h3>
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
                <v-btn class="black--text mx-1" v-if="mode == 'view'">
                    <v-icon class="mr-1">mdi-printer</v-icon>
                    Print
                </v-btn>
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
        <v-row>
            <v-col cols="6">
                <v-row>
                    <v-col cols="6">
                        <v-text-field
                            label="Owner Name"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="8">
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Alias:</v-subheader>
                                <v-divider></v-divider>
                                <div class="scrollAlias">
                                    <template v-for="(item, index) in fields.alias">
                                        <v-list-item :key="`nl-${index}`">
                                            <v-list-item-content>
                                                <v-list-item-title v-if="index != editTableAlias || mode == 'view'">{{item}}</v-list-item-title>
                                                <v-form v-model="validAlias" v-if="mode != 'view'">
                                                    <v-text-field
                                                    v-if="editTableAlias == index"
                                                    label="Alias"
                                                    v-model="helperAlias"
                                                    :rules="aliasRules"
                                                    ></v-text-field>
                                                </v-form>
                                                
                                            </v-list-item-content>
                                            <v-list-item-action class="d-flex flex-row">
                                                <v-tooltip bottom v-if="mode != 'view' && editTableAlias != index">
                                                    <template v-slot:activator="{ on, attrs }">
                                                            <v-btn 
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            icon class="grey--text text--darken-2"   @click="changeEditTableAlias(item,index)">
                                                                <v-icon
                                                                    small
                                                                > mdi-pencil</v-icon>
                                                            </v-btn>
                                                    </template>
                                                    <span>Edit</span>
                                                </v-tooltip>
                                                <v-tooltip bottom v-if="mode != 'view' && editTableAlias == index">
                                                    <template v-slot:activator="{ on, attrs }">
                                                            <v-btn
                                                            v-bind="attrs"
                                                            v-on="on" 
                                                            icon class="grey--text text--darken-2" color="success"  @click="saveTableAlias(index)">
                                                                <v-icon
                                                                small
                                                                >mdi-check</v-icon>  
                                                            </v-btn>
                                                    </template>
                                                    <span>Save changes</span>
                                                </v-tooltip>
                                                <v-tooltip bottom v-if="mode != 'view' && editTableAlias == index">
                                                    <template v-slot:activator="{ on, attrs }">
                                                            <v-btn 
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            icon class="grey--text text--darken-2"  @click="cancelEditTableAlias()">
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
                                </div>
                            </v-list>
                        </v-card>
                        <v-row>
                            <v-col cols="12" class="d-flex ">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-1 black--text align" v-if="mode != 'view' && editTableAlias == -1">Add Alias</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row> 
            </v-col>
            <v-col cols="6">
                <v-row>
                    <v-col cols="5"></v-col>
                    <v-col cols="7">
                        <v-card>
                            <v-list class="pa-0" >
                                <v-subheader>Boats Owned:</v-subheader>
                                <v-divider></v-divider>
                                <div class="scrollBoats">
                                    <template v-for="(item, i) in fields.boatsOwned" >
                                        <v-list-item :key="`nl-${i}`">
                                            <v-list-item-content>
                                                <v-list-item-title>{{item}}</v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                            <v-btn class="grey--text text--darken-2 my-0">
                                                <v-icon color="grey darken-2" class="mr-2">mdi-information</v-icon>
                                                Details
                                            </v-btn>
                                            </v-list-item-action>
                                        </v-list-item>
                                        <v-divider  :key="`ldiv-${i}`"></v-divider>
                                    </template>
                                </div>      
                            </v-list>
                        </v-card>
                    </v-col>
                </v-row>     
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
        <HistoricRecord :historicRecords="fields.historicRecords" :mode="mode"/>
    </div>
</template>

<script>
import Breadcrumbs from "../../../Breadcrumbs";
import HistoricRecord from "../HistoricRecord";
export default {
    name: "ownerForm",
    components: { Breadcrumbs, HistoricRecord },
    data: ()=> ({
        name: "British Yukon Navigation Company",
    //helper vars, they are used to determine if the component is in an edit, view or add new state
        mode: "",
        edit: false,
        showSave: 0,
    //helper vars used for the Alias list functions
        editTableAlias: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingAlias: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperAlias: null,
        validAlias: false,
        aliasRules: [
            v => !!v || 'Alias is required',
        ],
    //helper vars for when v-model is not an option (inside the datatable)
        historiRecordHelper: "",
        recordHelper: "",
    //input fields, datatable, etc
        menu1: "",
        menu2: "",
        menu3: "",
        search: "",
        fields: {
            alias: [ "Alias 1", "Alias 2", "Alias 3"],
            boatsOwned: ["Boat 1","Boat 2","Boat 3","Boat 4","Boat 4","Boat 4","Boat 4"],
            historicRecords: [
                {historicRecord: "some text", reference: "wdadwdawdad"},
                {historicRecord: "historic record 2", reference: "adawddad"}
            ],
            
        },
        fieldsHistory: null,
        headers: [
            { text: "Historic Record", value: "historicRecord"},
            { text: "Reference", value: "reference"},
            { text: "Actions", value: "actions", sortable: false},
        ],

    }),
    created(){
        if(this.$route.path.includes("edit")){
            this.mode= "edit";
            this.edit = true;
            //after this, the fields get filled with the info obtained from the api
        }
        else if(this.$route.path.includes("new")){
            this.mode="new";
            //inputs remain empty
        }
        else if(this.$route.path.includes("view")){
            this.mode="view";
            this.edit = false;
        }
    },
    methods:{
        save (date) {
            this.$refs.menu.save(date)
        },
        changeEdit(){//this method handles the logic behind the top edit, cancel & save changes buttons
            this.fieldsHistory = this.edit == false ? {...this.fields} : {...this.fieldsHistory};
            this.fields = this.edit == true ? {...this.fieldsHistory} : {...this.fields};
            this.showSave = 0;
            if(this.edit == true){
                this.$router.push(`/boats/owner/view/${this.name}`);
            }
            else{
                this.$router.push(`/boats/owner/edit/${this.name}`);
            }
            this.edit=!this.edit;
        },
    //Functions dedicated to handle the edit, add, view modes
        cancelEdit(){
            if(this.fieldsHistory){
                this.fields = {...this.fieldsHistory};
            }
            this.mode="view";
            this.resetListVariables();
            this.$router.push(`/boats/owner/view/${this.name}`);
        },
        cancelNew(){
            this.$router.push(`/boats/owner/`);
        },
        viewMode(){
            this.mode="view";
            this.$router.push(`/boats/owner/view/${this.name}`);
        },
        editMode(){
            this.fieldsHistory = {...this.fields};
            this.mode="edit";
            this.resetListVariables();
            this.$router.push(`/boats/owner/edit/${this.name}`);
            this.showSave = 0;
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
    //functions for editing the table "Owners" values
        changeEditTableAlias(item,index){
            this.editTableAlias = index;
            this.helperAlias = item;
        },
        cancelEditTableAlias(){
            if(this.validAlias && this.addingAlias){
                this.editTableAlias = -1;
                this.fields.alias.pop();
            }
            else if(this.validAlias && this.addingAlias == false){
                this.editTableAlias = -1;
            }
                
        },
        saveTableAlias(index){
            if(this.validAlias){
                this.fields.alias[index] = this.helperAlias;
                this.editTableAlias = -1;
            }           
        },
        addAlias(){
            this.helperAlias="";
            this.fields.alias.push(""); 
            this.editTableAlias = this.fields.alias.length-1;
        },
    },
}
</script>

<style scoped>
.scrollAlias{
    height: 277px;
    overflow: auto;
}
.scrollBoats{
    height: 360px;
    overflow: auto;
}
</style>