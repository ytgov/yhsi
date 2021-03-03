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
                ></v-text-field>

                <v-spacer></v-spacer>

                <v-btn class="black--text" v-if="mode != 'view'">Add Historic Record</v-btn>
            </v-col>
        </v-row>
        
        <v-row>
            <v-col cols="12" >
                <v-card>
                    <v-data-table
                        :headers="headers"
                        :items="historicRecords"
                        :search="search"
                    >
                        <template v-slot:item.historicRecord="{ item, index }">
                            <div v-if="editTable == index">
                                <v-text-field
                                :value="item.historicRecord"
                                @input="editHistoricRecord"
                                ></v-text-field>
                            </div>
                            <div v-else>{{item.historicRecord}}</div>
                        </template>
                        <template v-slot:item.reference="{ item, index }">
                            <div v-if="editTable == index">
                                <v-text-field 
                                :value="item.reference"
                                @change="editReference"
                                ></v-text-field>
                            </div>
                            <div v-else>{{item.reference}}</div>
                        </template>
                        <template v-slot:item.actions="{  index }">
                            <v-tooltip bottom v-if="editTable != index">
                                <template v-slot:activator="{ on, attrs }">
                                        <v-btn 
                                        v-bind="attrs"
                                        v-on="on"
                                        icon class="black--text"   @click="changeEditTable(index)">
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
                                        icon class="black--text" color="success"  @click="closeEditTable(index)">
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
                                        icon class="black--text"  @click="saveTable(index)">
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
            { text: "Historic Record", value: "historicRecord"},
            { text: "Reference", value: "reference"},
            { text: "Actions", value: "actions", sortable: false},
        ],
        editTable: -1,
    }),
    methods:{
        //functions for editing the table values
        changeEditTable(index){
            console.log(index);
            this.editTable = index;
        },
        closeEditTable(){
            this.editTable = -1;
        },
        saveTable(){
            this.editTable = -1;
        },
    }
}
</script>