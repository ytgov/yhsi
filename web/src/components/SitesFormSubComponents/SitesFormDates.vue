<template>
    <div>
          <v-card-title primary-title>
            Dates & Condition
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col cols="12">
                        <div class="mb-2">Dates</div>
                        <v-alert v-for="(item, i) in dates" :key="`date:${i}`"
                                outlined
                                color="primary"
                            >
                            <div class="sub-title">
                                Date {{i+1}}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col
                                    cols="6"
                                >
                                    <v-combobox
                                    label="Date Type"
                                    ></v-combobox>
                                    <v-text-field
                                            v-model="item.details"
                                            label="Details"
                                            required
                                    ></v-text-field>
                                </v-col>
                                <v-col
                                    cols="6"
                                >
                                    <v-text-field
                                    v-model="item.from"
                                    label="From Date"
                                    required
                                    ></v-text-field>
                                    <v-text-field
                                    v-model="item.to"
                                    label="To Date"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-alert>  
                        <v-btn
                        outlined
                        color="primary"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                
                <v-divider class="mt-2 mb-2"></v-divider>
                <div class="mb-2">Construction Periods</div>
                <v-row>
                    <v-col cols="12">
                        <v-alert v-for="(item, i) in constructionPeriods" :key="`period:${i}`"
                                outlined
                                color="primary"
                            >
                            <div class="sub-title">
                                Construction Period {{i+1}}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col
                                    cols="12"
                                >
                                    <v-combobox
                                    v-model="selectedPeriod"
                                    :items="construction_periods"
                                    label=""
                                    dense
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="6"
                    >
                        <v-row>
                            <v-col cols="6">
                                <v-combobox
                                :v-model="fields.siteStatus"
                                item-text="name"
                                item-value="id"
                                label="Site Status"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="6">
                                <v-combobox
                                :v-model="fields.floorCondition"
                                item-text="name"
                                item-value="id"
                                label="Floor Condition"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                                <v-combobox
                                :v-model="fields.roofCondition"
                                item-text="name"
                                item-value="id"
                                label="Roof Condition"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="6">
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col
                        cols="6"
                    >
                            <v-row>
                            <v-col cols="6">
                                <v-combobox
                                :v-model="fields.wallCondition"
                                item-text="name"
                                item-value="id"
                                label="Wall Condition"
                                ></v-combobox>
                            </v-col>
                            <v-col cols="6">
                                <v-combobox
                                :v-model="fields.doorCondition"
                                item-text="name"
                                item-value="id"
                                label="Door Condition"
                                ></v-combobox>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="6">
                            </v-col>
                            <v-col cols="6">
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                        <v-col cols="6">
                            <v-text-field
                            :v-model="fields.buildingSize"
                            item-text="name"
                            item-value="id"
                            label="Building Size"
                            required
                            ></v-text-field>
                            <v-text-field
                            :v-model="fields.resourceType"
                            item-text="name"
                            item-value="id"
                            label="All Other Resource Types"
                            required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-textarea
                            :v-model="fields.conditionComment"
                            item-text="name"
                            item-value="id"
                            label="Condition Notes"
                            ></v-textarea>
                        </v-col>
                </v-row>
            </v-container>
        </v-form>
    </div>
</template>

<script>
export default {
    name: "formDates-Condition",
    data: () => ({
        valid: false,

        generalRules: [
            v => !!v || 'This input is required',
            v => v.length <= 20 || 'This input must be less than 20 characters',
        ],
        /* Placeholder variables below this line **Read disclaimer** */
        dates: [{type:"construction",details: "wasd",from:"",to:""}, {type:"construction",details: "wasd",from:"",to:""}],
        constructionPeriods: [{type:"construction",details: "wasd",from:"",to:""}],
        construction_periods: ['1','2'],
        selectedPeriod: '',
        /*Field data from the swaggerhub api docs below this line*/
        fields:  {
                buildingSize: '',//
                conditionComment: '',//
                doorCondition: '',//
                floorCondition: '',//
                resourceType: '',//
                roofCondition: '',//
                siteStatus: '',//
                wallCondition: '',//
            }
    })
}
</script>