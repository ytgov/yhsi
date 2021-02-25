<template>
    <div>
        <h3>Boats</h3>
        <v-row>
            <v-col cols="12" class="d-flex">
                <h1>{{name}}</h1>
                <v-spacer></v-spacer>
                <v-btn class="black--text mx-1" @click="changeEdit" v-if="!edit">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
                <v-btn class="black--text mx-1" @click="changeEdit" v-if="edit">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 2" v-if="edit" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Save Changes
                </v-btn>
                <v-btn class="black--text mx-1" v-if="!edit">
                    <v-icon class="mr-1">mdi-printer</v-icon>
                    Print
                </v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="5">
                <v-row>
                    <v-col cols="6">
                        <v-card>
                            <v-list class="pa-0" disabled>
                                <v-subheader>Name/s:</v-subheader>
                                <v-divider></v-divider>
                                <v-list-item-group
                                    color="primary"
                                >
                                <template v-for="(item, i) in fields.names">
                                    <v-list-item :key="`nl-${i}`">
                                        <v-list-item-content>
                                            <v-list-item-title>{{item}}</v-list-item-title>
                                        </v-list-item-content>
                                    </v-list-item>
                                    <v-divider  :key="`ldiv-${i}`"></v-divider>
                                </template>
                                </v-list-item-group>
                            </v-list>
                        </v-card>
                        <v-row>
                            <v-col cols="12" class="d-flex ">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-1 black--text align" v-if="edit">Add Name</v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" >
                                <v-text-field
                                    label="Registration Number"
                                    v-model="fields.registrationNumber"
                                    :readonly="!edit"
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
                            :disabled="!edit"
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
                            :disabled="!edit"
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
                            :disabled="!edit"
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
                                <v-subheader>Owners/s:</v-subheader>
                                <v-divider></v-divider>
                                <template v-for="(item, i) in fields.owners">
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
                            </v-list>
                        </v-card>
                        <v-row>
                            <v-col cols="12" class="d-flex ">
                                <v-spacer></v-spacer>
                                <v-btn class="mx-1 black--text align" v-if="edit">Add Owner</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row> 
            </v-col>
            <v-col cols="7">
                <v-row>
                    <v-col cols="6">
                        <v-combobox
                        v-model="fields.vesselType"
                        label="Vessel Type"
                        :readonly="!edit"
                        ></v-combobox>

                        <v-textarea
                            label="Current Location Description"
                            v-model="fields.currentLocationDescription"
                            :readonly="!edit"
                        ></v-textarea>

                        <v-textarea
                            label="Notes"
                            v-model="fields.notes"
                            :readonly="!edit"
                        ></v-textarea>
                    </v-col>
                    <v-col cols="6">
                        <v-img class="mx-auto"
                        contain
                        max-height="339"
                        max-width="339"
                        src="https://picsum.photos/id/11/500/300"
                        ></v-img>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-divider class="my-5"></v-divider>
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

                <v-btn class="black--text" v-if="edit">Add Historic Record</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" >
                <v-card>
                    <v-data-table
                        :headers="headers"
                        :items="fields.historicRecords"
                        :search="search"
                    >
                        <template v-slot:item.historicRecord="{ item }">
                            <div v-if="editTable">
                                <v-text-field
                                    v-model="fields.historicRecord"
                                ></v-text-field>
                            </div>
                            <div v-else>{{item.historicRecord}}</div>
                        </template>
                        <template v-slot:item.reference="{ item }">
                            <div v-if="editTable">
                                <v-text-field
                                    v-model="fields.reference"
                                ></v-text-field>
                            </div>
                            <div v-else>{{item.reference}}</div>
                        </template>
                        <template v-slot:item.actions="{ }">
                            <v-btn icon class="black--text" color="transparent"   v-if="!editTable">
                                <v-icon
                                    small
                                    class="mr-2"
                                > mdi-pencil</v-icon>
                                Edit
                            </v-btn>
                            <v-btn icon class="black--text" v-if="editTable"  >
                                <v-icon
                                small
                                >mdi-pencil</v-icon>  
                            </v-btn>
                            <v-btn icon class="black--text" color="success" v-if="editTable"  >
                                <v-icon
                                small
                                >mdi-check</v-icon>  
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "boatsForm",
    data: ()=> ({
        name: "Evelyn",
        //helper vars, they are used to determine if the component is in an edit state
        edit: false,
        editTable: false,
        showSave: 0,
        watch: null,
        //input fields, datatable, etc
        menu1: "",
        menu2: "",
        menu3: "",
        search: "",
        fields: {
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
        },
        fieldsHistory: null,
        headers: [
            { text: "Historic Record", value: "historicRecord"},
            { text: "Reference", value: "reference"},
            { text: "Actions", value: "actions", sortable: false},
        ]

    }),
    created(){
    },
    methods:{
        save (date) {
            this.$refs.menu.save(date)
        },
        changeEdit(){
            this.fieldsHistory = this.edit == false ? {...this.fields} : {...this.fieldsHistory};
            this.fields = this.edit == true ? {...this.fieldsHistory} : {...this.fields};
            this.showSave = 0;
            console.log(this.showSave);
            this.edit=!this.edit;
            
        }
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