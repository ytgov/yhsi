<template>
    <div>
        <v-row>
            <v-col cols="12" class="d-flex">
                <v-text-field
                flat
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
                    <v-data-table
                        :headers="headers"
                        :items="data"
                        :search="search"
                        :footer-props="{'items-per-page-options': [10, 30, 100]}"
                    >
                        <template v-slot:body.prepend="{}" v-if="addingItem">
                            <tr>
                                <td>
                                    <v-textarea
                                    v-model="historicRecordHelper"
                                    ></v-textarea>
                                </td>
                                <td>
                                    <v-textarea
                                    v-model="referenceHelper"
                                    ></v-textarea>
                                </td>
                                <td>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                v-bind="attrs"
                                                v-on="on" 
                                                :disabled="!referenceHelper && !historicRecordHelper"
                                                icon class="black--text" color="success"  @click="saveItem()">
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
                                <v-textarea
                                v-model="historicRecordHelper "
                                ></v-textarea>
                            </div>
                            <div v-else>{{item.HistoryText}}</div>
                        </template>
                        <template v-slot:item.Reference="{ item, index }">
                            <div v-if="editTable == index">
                                <v-textarea
                                v-model="referenceHelper"
                                ></v-textarea>
                            </div>
                            <div v-else>{{item.Reference}}</div>
                        </template>
                        <template v-slot:item.actions="{  index, item }">
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
                                        :disabled="referenceHelper === '' || historicRecordHelper === ''"
                                        icon class="black--text" color="success"  @click="saveTable(index)">
                                            <v-icon
                                            small
                                            >mdi-check</v-icon>  
                                        </v-btn>
                                </template>
                                <span>Save changes</span>
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
    props: ["historicRecords", "mode", "boatID"],
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
    }),
    mounted(){
        this.data = this.historicRecords;
    },
    methods:{
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
        async saveTable(index){
            this.overlay = true;
            let data = {
                history: {
                    HistoryText: this.historicRecordHelper, 
                    Reference: this.referenceHelper, 
                    UID: this.boatID 
                }  
            };
            const resp = await histories.put(this.data[index].id, data);
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
        async saveItem(){
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
        cancelItem(){
            this.addingItem = false;
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