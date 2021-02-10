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
                        <v-alert v-for="(item, i) in associations" :key="`theme-${i+1}`"
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
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    label="Association Type"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field 
                                    :v-model="item"
                                    label="Association Name"
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
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">First Nation Associations</div>
                        <v-alert v-for="(item, i) in firstNationAssociations" :key="`theme-${i+1}`"
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
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="6">
                                    <v-combobox
                                    label="Association"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="6">
                                    <v-combobox
                                    label="First Nation"
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
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
              </v-container>
            </v-form>
        </div>
</template>

<script>
export default {
    name: "formThemes",
    data: () => ({
        /* input-fields */
            valid: false,
            yhsthemes: '',
            associations: ['item1','item2'],
            firstNationAssociations: [
                {useType: 'text1', category: ''},
                {useType: 'text2', category: ''}
            ],
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
    })
}
</script>