<template>
    <div>
        <h3>Boat Owner</h3>
        <Breadcrumbs/>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1 v-if="mode != 'new'">{{fields.OwnerName}}</h1>
                <h1 v-else>New Owner</h1>
                <v-spacer></v-spacer>
<!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="mode == 'view'">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
                <PrintButton  v-if="mode == 'view'" :name="name" :data="fields"/>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="mode == 'edit'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 2" v-if="mode == 'edit'" @click="saveChanges()" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Save Changes
                </v-btn>
<!-- buttons for the new state -->
                <v-btn class="black--text mx-1" @click="cancelNew" v-if="mode == 'new'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 2" v-if="mode == 'new'" @click="saveChanges()" >
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
                            v-model="fields.OwnerName"
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
                                                <v-form v-model="validAlias" v-if="mode != 'view'" v-on:submit.prevent>
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
                                <v-btn class="mx-1 black--text align" v-if="mode != 'view' && editTableAlias == -1" @click="addAlias()">Add Alias</v-btn>
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
                                    <template v-for="(item, i) in fields.boats" >
                                        <v-list-item :key="`nl-${i}`">
                                            <v-list-item-content>
                                                <v-list-item-title>{{item.Name}}</v-list-item-title>
                                            </v-list-item-content>
                                            <v-list-item-action>
                                            <v-tooltip bottom v-if="mode == 'view'">
                                                <template v-slot:activator="{ on, attrs }">
                                                        <v-btn 
                                                        v-bind="attrs"
                                                        v-on="on" @click="goToBoat(item)"
                                                        icon class="grey--text text--darken-2"   >
                                                            <v-icon
                                                                small
                                                            > mdi-information</v-icon>
                                                        </v-btn>
                                                </template>
                                                <span>Details</span>
                                            </v-tooltip>
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
        <HistoricRecord :historicRecords="fields.histories" :mode="mode"/>
    </div>
</template>

<script>
import Breadcrumbs from "../../../Breadcrumbs";
import HistoricRecord from "../HistoricRecord";
import PrintButton from "./PrintButton";
import owners from "../../../../controllers/owners";
export default {
    name: "ownerForm",
    components: { Breadcrumbs, HistoricRecord, PrintButton },
    data: ()=> ({
        name: "British Yukon Navigation Company",
    //helper vars, they are used to determine if the component is in an edit, view or add new state
        mode: "",
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
        fields: null,
        fieldsHistory: null,

    }),
    created(){
        if(this.$route.path.includes("edit")){
            this.mode= "edit";
            //after this, the fields get filled with the info obtained from the api
            this.getDataFromAPI();
        }
        else if(this.$route.path.includes("new")){
            this.mode="new";
            //inputs remain empty
            this.noData();
        }
        else if(this.$route.path.includes("view")){
            this.mode="view";
            this.getDataFromAPI();
        }
    },
    methods:{
        noData(){
            this.fields =  {
            OwnerName: "",
            alias: [],
            boats: [],
            histories: [],
          };
        },
        async getDataFromAPI(){
            console.log("SEEE DATA BELOW");
            this.fields = await owners.getById(this.$route.params.id);
            console.log(this.fields);
        },
        save (date) {//this function saves the state of the date picker
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
        goToBoat(item){
            this.$router.push(`/boats/view/${item}`);
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
        saveChanges(){
            if(this.mode == 'add'){
                //makes an axios post request
                //boats.post(somedata);
            }
            else{
                //makes an axios put request
                //boats.put(somedata);
            }
            this.mode = 'view';
            this.$router.push(`/boats/owner/view/${this.name}`);
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
    watch: {
        fields: {
            handler(newval){
                console.log("Value changed",newval);
                this.showSave = this.showSave+1;
            },
            deep: true
        },
    }
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