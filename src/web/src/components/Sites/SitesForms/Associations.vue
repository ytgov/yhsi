<template>
    <div>
          <v-card-title primary-title>
            Associations
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">Associations</div>
                        <v-alert v-for="(item, i) in fields.associations" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Association {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                                @click="removeItem('associations', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    v-model="item.type_name"
                                    label="Association Type"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    v-model="item.name"
                                    label="Association Name"
                                    required
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-alert>
                        <v-btn
                        outlined
                        color="primary"
                        @click="addItem('associations')"
                        >
                            Add New
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="mt-2 mb-2"></v-divider>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">First Nation Associations</div>
                        <v-alert v-for="(item, i) in fields.firstNationAssociations" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                First Nation Association {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                                @click="removeItem('firstNationAssociations', i)"
                            >
                                <v-icon dark>mdi-close-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    v-model="item.association"
                                    label="Association"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-combobox
                                    v-model="item.firstNation"
                                    label="First Nation"
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
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
                        @click="addItem('firstNationAssociations')"
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
    name: "formAssociation",
    data: () => ({
        /* input-fields */
            valid: false,
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
            /* Placeholder variables below this line **Read above** */
            fields:{
                associations: [{id:'', name: '',type_name:''}],
                firstNationAssociations: [
                    {name: '',firstNation:'', comments:''},
                    {name: '',firstNation:'', comments:''},
                ],
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
            case 'associations':
              this.fields[objName].push({name: '',type_name:''});
              break;
            case 'firstNationAssociations':
              this.fields[objName].push({name: '',firstNation:'', comments:''});
              break;
          }
        }
    }
}
</script>