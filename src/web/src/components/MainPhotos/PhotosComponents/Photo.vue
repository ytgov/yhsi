<template>
  <div>
          <v-card-title primary-title>
            Photo
          </v-card-title>
          <v-divider inset></v-divider>
          <v-form v-model="valid">
              <v-container>
                <v-row>
                  <v-col
                    cols="6"
                  >
                    <v-img v-if="fields.photo == null"
                      class="mr-auto ml-auto"
                      max-width="128"
                      :src="require('../../../assets/add_photo.png')">
                      </v-img>
                      <v-img v-else
                      class="mr-auto ml-auto"
                      max-width="128"
                      :src="fields.photo">
                    </v-img>

                    <v-file-input
                        label="Choose photo to upload"
                        prepend-icon="mdi-camera"
                        accept="image/*"
                        @change="onFileSelection($event)"
                    ></v-file-input>

                    <v-combobox
                        v-model="fields.ownerId"
                        label="Owner"
                    ></v-combobox>

                    <v-combobox
                        v-model="fields.copyright"
                        label="Copyright"
                    ></v-combobox>

                    <v-combobox
                        v-model="fields.usageRights"
                        label="Usage Rights"
                    ></v-combobox>

                    <v-checkbox
                      v-model="fields.isComplete"
                      :label="'Is Complete?'"
                    ></v-checkbox>
                  </v-col>

                  <v-col
                    cols="6"
                  >
                    <v-combobox
                        v-model="fields.subjects"
                        label="Subjects"
                    ></v-combobox>

                    <v-textarea
                      v-model="fields.caption"
                      label="Caption"
                      required
                    ></v-textarea>

                    <v-textarea
                      v-model="fields.comments"
                      label="Comments"
                      required
                    ></v-textarea>

                    <v-textarea
                      v-model="fields.creditLine"
                      label="Credit Line"
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
            fields: {
                /* Placeholder variables below this line **Read above** */
                photo: null,
                /*Field data from the swaggerhub api docs below this line*/
                caption: "",//
                comments: "",//
                copyright: "",//
                creditLine: "",//
                isComplete: false,//
                ownerId: "",//
                photoProjectId: "",//
                subjects: "",//
            }
    }),
    methods:{
        onFileSelection(event){
            if(event) {
                //this.fields.photos[i].img = URL.createObjectURL(event.target.files[0]);
                this.fields.photo = URL.createObjectURL(event);
            }
            else {
                this.fields.photo = null;
            }
        },
    },
}
</script>
