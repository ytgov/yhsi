<template>
    <div>
        <v-row>
            <v-col cols="12" class="d-flex">
                <v-text-field
                outlined dense
                prepend-icon="mdi-magnify"
                class="mx-4"
                hide-details
                label="Search"
                
                v-model="search"
                v-if="mode != 'new'"
                ></v-text-field>

                <v-spacer></v-spacer>

                <v-btn class="black--text" v-if="mode != 'view'" :disabled="addingItem" @click="addRecord">Add Historic Record</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" >
                <v-card>
                    <h2 class="mx-4 mt-2">{{ numberOfResults }} results out of {{pagination.itemsLength}}</h2>
                    <v-divider inset></v-divider>
                    <v-data-table
                        :headers="headers"
                        :items="data"
                        :search="search" @pagination="yourMethod"
                        :options="options"
                        :footer-props="{'items-per-page-options': [10, 20, 30, 100]}"
                    >
                        <template v-slot:body.prepend="{}" v-if="addingItem">
                            <tr>
                                <td>
                                    <v-textarea outlined dense class="mt-3"
                                    v-model="historicRecordHelper"
                                    ></v-textarea>
                                </td>
                                <td>
                                    <v-textarea outlined dense class="mt-3"
                                    v-model="referenceHelper"
                                    ></v-textarea>
                                </td>
                                <td>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn v-if="boatID"
                                                v-bind="attrs"
                                                v-on="on" 
                                                :disabled="!referenceHelper && !historicRecordHelper"
                                                icon class="black--text" color="success"  @click="newBoatItem()">
                                                    <v-icon
                                                    small
                                                    >mdi-check</v-icon>  
                                                </v-btn>
                                                <v-btn v-else
                                                v-bind="attrs"
                                                v-on="on" 
                                                :disabled="!referenceHelper && !historicRecordHelper"
                                                icon class="black--text" color="success"  @click="newOwnerItem()">
                                                    <v-icon
                                                    small
                                                    >mdi-check</v-icon>  
                                                </v-btn>
                                        </template>
                                        <span>Save changes</span>
                                    </v-tooltip>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn 
                                                v-bind="attrs"
                                                v-on="on"
                                                icon class="black--text"  @click="cancelItem() ">
                                                    <v-icon
                                                    small
                                                    >mdi-close</v-icon>  
                                                </v-btn>
                                        </template>
                                        <span>Cancel</span>
                                    </v-tooltip> 
                                </td>
                            </tr>  
                        </template>
                        <template v-slot:item.HistoryText="{ item, index }">
                            <div v-if="editTable == index">
                                <v-textarea outlined dense class="mt-3"
                                v-model="historicRecordHelper "
                                ></v-textarea>
                            </div>
                            <div v-else>{{item.HistoryText}}</div>
                        </template>
                        <template v-slot:item.Reference="{ item, index }">
                            <div v-if="editTable == index">
                                <v-textarea outlined dense class="mt-3"
                                v-model="referenceHelper"
                                ></v-textarea>
                            </div>
                            <div v-else>{{item.Reference}}</div>
                        </template>
                        <template v-slot:item.actions="{  index, item }">
                            <v-tooltip bottom v-if="editTable == index">
                                <template v-slot:activator="{ on, attrs }">
                                        <v-btn v-if="boatID"
                                        v-bind="attrs"
                                        v-on="on" 
                                        :disabled="referenceHelper === '' || historicRecordHelper === ''"
                                        icon class="black--text" color="success"  @click="saveTableToBoat(index)">
                                            <v-icon
                                            small
                                            >mdi-check</v-icon>  
                                        </v-btn>
                                        <v-btn v-else
                                        v-bind="attrs"
                                        v-on="on" 
                                        :disabled="referenceHelper === '' || historicRecordHelper === ''"
                                        icon class="black--text" color="success"  @click="saveTableToOwner(index)">
                                            <v-icon
                                            small
                                            >mdi-check</v-icon>  
                                        </v-btn>
                                </template>
                                <span>Save changes</span>
                            </v-tooltip>
                            <v-tooltip bottom v-if="editTable != index">
                                <template v-slot:activator="{ on, attrs }">
                                        <v-btn 
                                        v-bind="attrs"
                                        v-on="on"
                                        icon class="black--text"   @click="changeEditTable(index,item)">
                                            <v-icon
                                                small
                                            > mdi-pencil</v-icon>
                                        </v-btn>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>
                            
                            <v-tooltip bottom v-if="editTable == index">
                                <template v-slot:activator="{ on, attrs }">
                                        <v-btn 
                                        v-bind="attrs"
                                        v-on="on"
                                        icon class="black--text"  @click="closeEditTable(index) ">
                                            <v-icon
                                            small
                                            >mdi-close</v-icon>  
                                        </v-btn>
                                </template>
                                <span>Cancel</span>
                            </v-tooltip> 
                        </template>
                    </v-data-table>
                </v-card>
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
import histories from "../../../controllers/histories";
export default {
    name: "historicRecord",
    props: ["historicRecords", "mode", "boatID", "ownerID"],
    data: ()=>({
        search: "",
        headers: [
            { text: "Historic Record", value: "HistoryText"},
            { text: "Reference", value: "Reference"},
            { text: "Actions", value: "actions", sortable: false},
        ],
        editTable: -1,
        data: [],
    //helper vars for when v-model is not an option (inside the datatable)
        historicRecordHelper: "",
        referenceHelper: "",
        overlay: false,
        addingItem: false,
        options: { itemsPerPage: 20},
        pagination: { itemsLength: 0 }
    }),
    mounted(){
        this.data = this.historicRecords;
    },
    methods:{
        yourMethod(pagination) {
            console.log(pagination) // length of filtered/searched items in Vuetify data-table
            this.pagination = pagination;
        },
        //functions for editing the table values
        changeEditTable(index, item){
            this.editTable = index;
            this.historicRecordHelper = item.HistoryText;
            this.referenceHelper = item.Reference;
        },
        closeEditTable(){
            this.editTable = -1;
            //this.data.shift();
        },
        async saveTableToBoat(index){
            this.overlay = true;
            let data = {
                history: {
                    HistoryText: this.historicRecordHelper, 
                    Reference: this.referenceHelper, 
                    UID: this.boatID 
                }  
            };
            let resp = await histories.put(this.data[index].id, data);
            if(resp.message == "success"){
                this.data[index].Reference = this.referenceHelper;
                this.data[index].HistoryText = this.historicRecordHelper;
            }
            this.overlay = false;
            
            this.editTable = -1;
        },
        async saveTableToOwner(index){
            this.overlay = true;
            let data = {
                history: {
                    HistoryText: this.historicRecordHelper, 
                    Reference: this.referenceHelper, 
                    OwnerId: this.ownerID 
                }  
            };
            //console.log(this.data[index].id);
            let resp = await histories.putOwner(this.data[index].Id, data);
            if(resp.message == "success"){
                this.data[index].Reference = this.referenceHelper;
                this.data[index].HistoryText = this.historicRecordHelper;
            }
            this.overlay = false;
            
            this.editTable = -1;
        },
        addRecord(){
            //this.$emit('addRecord')
            this.historicRecordHelper = null;
            this.referenceHelper = null;
            this.addingItem = true;
        },
        //for adding a new item
        async newBoatItem(){
            this.overlay = true;
            let data = {
                history: {
                    HistoryText: this.historicRecordHelper, 
                    Reference: this.referenceHelper, 
                    UID: this.boatID 
                }  
            };
            let resp = await histories.post(data);

            if(resp[0].HistoryText);
                this.data.push(resp[0]);
            this.overlay = false;
            this.historicRecordHelper = null;
            this.referenceHelper = null;
            this.addingItem = false;
        },
         async newOwnerItem(){
            this.overlay = true;
            let data = {
                history: {
                    HistoryText: this.historicRecordHelper, 
                    Reference: this.referenceHelper, 
                    OwnerId: this.ownerID 
                }  
            };
            let resp = await histories.postOwner(data);
            //console.log(resp);
            if(resp[0].HistoryText);
                this.data.push(resp[0]);
            this.overlay = false;
            this.historicRecordHelper = null;
            this.referenceHelper = null;
            this.addingItem = false;
        },
        cancelItem(){
            this.addingItem = false;
        }
    },
    computed: {
        numberOfResults(){
           return this.pagination.itemsLength < this.pagination.itemsPerPage ? this.pagination.itemsLength :  this.pagination.itemsPerPage;
        }
    },
    watch:{
        data(val){
            if(val != undefined){
                this.$emit('historicRecordChange', val);
            }
            
        },

    }
}
</script>