<template>
    <div>
          <v-card-title primary-title>
            Legal & Zoning
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">Ownerships</div>
                        <v-alert v-for="(item, i) in ownerships" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Ownership {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    label="Category of Property"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    :v-model="item"
                                    label="Comments"
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
                 <v-row>
                    <v-col cols="6">
                        <v-text-field 
                        :v-model="fields.zoning"
                        label="Zoning"
                        required
                        ></v-text-field>

                        <v-text-field 
                        :v-model="fields.townSiteMapNumber"
                        label="Town Site Map Number"
                        required
                        ></v-text-field>

                        <v-text-field 
                        :v-model="fields.siteDistrictNumber"
                        label="Site District"
                        required
                        ></v-text-field>

                        <v-text-field 
                        :v-model="fields.groupYHSI"
                        label="Group YHSI"
                        required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field 
                        :v-model="fields.lAGroup"
                        label="Group"
                        required
                        ></v-text-field>

                        <v-text-field 
                        :v-model="fields.lot"
                        label="Lot"
                        required
                        ></v-text-field>

                        <v-text-field 
                        :v-model="fields.block"
                        label="Block"
                        required
                        ></v-text-field>

                        <v-text-field 
                        :v-model="fields.planNumber"
                        label="Plan Number"
                        required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">Previous Ownerships</div>
                        <v-alert v-for="(item, i) in previous_ownerships" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Previous Ownership {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field 
                                    :v-model="item"
                                    label="Dates"
                                    required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    :v-model="item"
                                    label="Numbers"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field 
                                    :v-model="item"
                                    label="Names"
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
              </v-container>
            </v-form>
        </div>
</template>

<script>
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
    name: "formLegalAndZoning",
    data: () => ({
            valid: false,
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
            /* Placeholder variables below this line **Read above** */
            ownerships: ['item1','item2'],
            previous_ownerships: ['item1','item2'],
            functionalUses: [
                {useType: 'text1', category: ''},
                {useType: 'text2', category: ''}
            ],
            /*Field data from the swaggerhub api docs below this line*/
            fields:  {
                block: '',//
                groupYHSI: '',//
                lAGroup: '',//
                lot: '',//
                planNumber: '',//
                siteDistrictNumber: '',//
                townSiteMapNumber: '',//
                zoning: '',//
                }
    })
}
</script>