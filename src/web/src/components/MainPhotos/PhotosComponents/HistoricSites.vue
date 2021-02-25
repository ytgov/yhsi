<template>
  <div>
          <v-card-title primary-title>
            Historic Sites 
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                     <v-combobox
                        v-model="fields.program"
                        label="Program Type"
                    ></v-combobox>

                    <v-combobox
                        v-model="fields.photoProjectId"
                        label="Project"
                    ></v-combobox>

                    <v-text-field
                      v-model="fields.creator"
                      label="Creator"
                      required
                    ></v-text-field>

                    <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                    >
                        <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                            v-model="fields.dateCreated"
                            label="Date Photo Taken"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                        ></v-text-field>
                        </template>
                        <v-date-picker
                        ref="picker"
                        v-model="fields.recognitionDate"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="save"
                        ></v-date-picker>
                    </v-menu>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                    <v-combobox
                        v-model="fields.location"
                        label="Office Location"
                    ></v-combobox>

                     <v-combobox
                        v-model="fields.originalMediaId"
                        label="Original Media Type"
                    ></v-combobox>

                    <v-textarea
                      v-model="fields.originalRecord"
                      label="Original Media Record"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-btn color="success">Save Changes</v-btn>
              </v-container>
            </v-form>
        </div> 
</template>

<script>
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
    name: "formSummary",
    data: () =>({
            valid: false,
            generalRules: [
                v => !!v || 'This input is required',
                v => v.length <= 20 || 'This input must be less than 20 characters',
            ],
            date: null,
            menu: false,
            fields: {
                /* Placeholder variables below this line **Read above** */
                search: '',
                /*Field data from the swaggerhub api docs below this line*/
                creator: "",//
                dateCreated: "",//
                location: "",//
                originalMediaId: '',//
                originalRecord: "",//
                photoProjectId: '',//
                program: '',//
            }
    }),
    methods:{
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
