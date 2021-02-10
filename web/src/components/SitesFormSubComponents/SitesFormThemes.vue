<template>
    <div>
          <v-card-title primary-title>
            Themes & Function
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <v-textarea
                            label="YHS Themes"
                            v-model="yhsthemes"
                        ></v-textarea>
                        <div class="mb-2">Themes</div>
                        <v-alert v-for="(item, i) in themes" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Theme {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-combobox
                            label="Category / Type"
                            ></v-combobox>
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
                    <div class="mb-2">Functional Users</div>
                        <v-alert v-for="(item, i) in functionalUses" :key="`theme-${i+1}`"
                                        outlined
                                        color="primary"
                                        >
                            <div class="sub-title">
                                Funcitonal Use {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="4"> 
                                    <v-combobox
                                    label="Use Type"
                                    ></v-combobox>
                                </v-col>
                                <v-col cols="8">
                                    <v-combobox
                                    label="Functional Category / Type"
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
                    <v-col cols="6">
                        <v-textarea
                        label="YHS Current Use"
                        
                        ></v-textarea>
                    </v-col>
                    <v-col cols="6">
                        <v-textarea
                        label="YHS Past Use"
                        
                        ></v-textarea>
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
            valid: false,
            yhsthemes: '',
            themes: ['item1','item2'],
            functionalUses: [
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