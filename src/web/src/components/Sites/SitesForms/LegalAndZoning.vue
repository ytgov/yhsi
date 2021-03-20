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
                        <v-alert v-for="(item, i) in fields.ownerships" :key="`theme-${i+1}`"
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
                                @click="removeItem('ownerships', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    v-model="item.category"
                                    label="Category of Property"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    v-model="item.comments"
                                    label="Comments"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('ownerships')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                 <v-row>
                    <v-col cols="6">
                        <v-text-field 
                        v-model="fields.zoning"
                        label="Zoning"
                        required
                        ></v-text-field>

                        <v-text-field 
                        v-model="fields.townSiteMapNumber"
                        label="Town Site Map Number"
                        required
                        ></v-text-field>

                        <v-text-field 
                        v-model="fields.siteDistrictNumber"
                        label="Site District"
                        required
                        ></v-text-field>

                        <v-text-field 
                        v-model="fields.groupYHSI"
                        label="Group YHSI"
                        required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field 
                        v-model="fields.lAGroup"
                        label="Group"
                        required
                        ></v-text-field>

                        <v-text-field 
                        v-model="fields.lot"
                        label="Lot"
                        required
                        ></v-text-field>

                        <v-text-field 
                        v-model="fields.block"
                        label="Block"
                        required
                        ></v-text-field>

                        <v-text-field 
                        v-model="fields.planNumber"
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
                        <v-alert v-for="(item, i) in fields.previous_ownerships" :key="`theme-${i+1}`"
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
                                @click="removeItem('previous_ownerships', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field 
                                    v-model="item.dates"
                                    label="Dates"
                                    required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    v-model="item.numbers"
                                    label="Numbers"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field 
                                    v-model="item.names"
                                    label="Names"
                                    required
                                    ></v-text-field>      
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('previous_ownerships')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="mt-2 mb-2"></v-divider>
                <v-btn color="success">Save Changes</v-btn>
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
            fields:  {
                /* Placeholder variables below this line **Read above** */
                ownerships: [{category: '', comments: ''}],
                previous_ownerships: [{dates: '', numbers: '', names:''}],
                /*Field data from the swaggerhub api docs below this line*/
                block: '',//
                groupYHSI: '',//
                lAGroup: '',//
                lot: '',//
                planNumber: '',//
                siteDistrictNumber: '',//
                townSiteMapNumber: '',//
                zoning: '',//
                }
    }),
    methods:{
        removeItem(objName, position){
            if (position > -1) {
              this.fields[objName].splice(position, 1);
            }
        },
        addItem(objName){
          switch(objName){// Selects which structure to add to the new element of the array
            case 'ownerships':
              this.fields[objName].push({category: '', comments: ''});
              break;
            case 'previous_ownerships':
              this.fields[objName].push({dates: '', numbers: '', names:''});
              break;
          }
        }
    }
}
</script>