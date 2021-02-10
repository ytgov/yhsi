<template>
    <div>
          <v-card-title primary-title>
            Photos
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <v-text-field 
                        :v-model="item"
                        label="Category of Property"
                        required
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>  
                    <v-col cols="6" v-for="(item, i) in photos" :key="`theme-${i+1}`">
                        <v-alert 
                            outlined
                            color="primary"
                        >
                            <div class="sub-title">
                                Photo {{ i+1 }}
                            </div>
                            <v-btn
                                icon
                                color="primary"
                                class="top-right-button"
                            >
                                <v-icon dark>mdi-minus-circle</v-icon>
                            </v-btn>
                            <v-row>
                                <v-col cols="12">
                                    <v-img
                                    lazy-src="https://picsum.photos/id/11/10/6"
                                    max-height="150"
                                    max-width="250"
                                    src="https://picsum.photos/id/11/500/300"
                                    ></v-img>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field 
                                    :v-model="item"
                                    label="Feature Name"
                                    required
                                    ></v-text-field>

                                    <v-text-field 
                                    :v-model="item"
                                    label="Caption"
                                    required
                                    ></v-text-field>

                                    <v-text-field 
                                    :v-model="item"
                                    label="Comments"
                                    required
                                    ></v-text-field>

                                    <v-text-field 
                                    :v-model="item"
                                    label="CreditLine"
                                    required
                                    ></v-text-field>

                                    <v-text-field 
                                    :v-model="item"
                                    label="Location"
                                    required
                                    ></v-text-field>

                                    <v-file-input
                                        label="Photo"
                                        prepend-icon="mdi-camera"
                                        hide-input
                                    ></v-file-input>
                                </v-col>
                            </v-row>
                        </v-alert>
                    </v-col>
                    <v-col cols="12">
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
            slideNegativeIndex: '',
            photos: ['item1','item2'],
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
    })
}
</script>