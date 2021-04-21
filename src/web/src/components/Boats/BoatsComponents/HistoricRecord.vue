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
                        :footer-props="{'items-per-page-options': [10, 20, 30]}"
                    >
                        <template v-slot:body.prepend="{}" v-if="addingItem">
                            <tr>
                                <td>
                                    <v-text-field
                                    v-model="historicRecordHelper "
                                    ></v-text-field>
                                </td>
                                <td>
                                    <v-text-field 
                                    v-model="referenceHelper"
                                    ></v-text-field>
                                </td>
                                <td>
                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                v-bind="attrs"
                                                v-on="on" 
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
                                <v-text-field
                                v-model="historicRecordHelper "
                                ></v-text-field>
                            </div>
                            <div v-else>{{item.HistoryText}}</div>
                        </template>
                        <template v-slot:item.Reference="{ item, index }">
                            <div v-if="editTable == index">
                                <v-text-field 
                                v-model="referenceHelper"
                                ></v-text-field>
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
    </div>

    
</template>

<script>
export default {
    name: "historicRecord",
    props: ["historicRecords", "mode"],
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
        saveTable(index){
            this.data[index].Reference = this.referenceHelper;
            this.data[index].HistoryText = this.historicRecordHelper;
            this.editTable = -1;
        },
        addRecord(){
            //this.$emit('addRecord')
            this.historicRecordHelper = "";
            this.referenceHelper = "";
            this.addingItem = true;
        },
        //for adding a new item
        saveItem(){
            this.data.push({HistoryText: this.historicRecordHelper, Reference: this.referenceHelper });
            this.historicRecordHelper = "";
            this.referenceHelper = "";
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