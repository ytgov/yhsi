<template>
    <div>
          <v-card-title primary-title>
            Description
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                    <v-col
                        cols="12"
                    >
                        <div class="mb-2">Descriptions</div>
                        <v-alert v-for="(item, i) in photos" :key="`theme-${i+1}`"
                          outlined
                          color="primary"
                        >
                            <div class="sub-title">
                                Description {{ i+1 }}
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
                                    label="Decription Type"
                                    ></v-combobox>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-textarea
                                    label=""
                                    ></v-textarea>
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
            slideNegativeIndex: '',
            photos: ['item1','item2'],
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
            date: null,
            menu: false,
    }),
    methods: {
      save (date) {
        this.$refs.menu.save(date)
      },
    },
    watch: {
      menu (val) {
        val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
      },
    },
}
</script>