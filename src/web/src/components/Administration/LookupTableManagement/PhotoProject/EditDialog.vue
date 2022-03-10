<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px" @click:outside="reset()">
      <v-card>
        <v-card-title>
          <span class="text-h5">Edit Photo Project</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-form
                  ref="editPhotoProjectForm"
                  :lazy-validation="false"
                  v-model="valid"
                >
                  <v-text-field
                    ref="editInput"
                    label="Photo Project Name"
                    v-model="fields.name"
                    :rules="generalRules"
                  ></v-text-field>
                  <v-text-field
                    label="Permit"
                    v-model="fields.permit"
                  ></v-text-field>
                  <v-select
                    v-model="fields.section"
                    label="Section"
                    :items="sectionOptions"
                    item-value="value"
                    item-text="text"
                  ></v-select>
                  <v-text-field
                    label="Year"
                    v-model="fields.year"
                  ></v-text-field>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="closeDialog"> Close </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="success" text :disabled="!valid" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import catalogs from "../../../../controllers/catalogs";
import { STATIC_URL } from "../../../../urls";
import axios from "axios";
export default {
  props: ["dialog", "data"],
  data: () => ({
    fields: { 
      name: null,
      permit: null,
      section: null,
      year: null, 
    },
    valid: false,
    generalRules: [(v) => !!v || "This field is required"],
    sectionOptions: [],
  }),
  created() {
    axios.get(`${STATIC_URL}/photo-project-section`).then((resp) => {
      this.sectionOptions = resp.data.data;
    });
  }, 
  methods: {
    closeDialog() {
      this.$emit("closeEditDialog");
    },
    async save() {
      let data = this.fields;
      await catalogs.putPhotoProject(this.data.Id, data);
      this.$router.go();
    },
    //not needed
    validate() {
      this.$refs.editPhotoProjectForm.validate();
    },
    reset() {
      this.$refs.editPhotoProjectForm.reset();
      this.$emit("closeEditDialog");
    },
    resetValidation() {
      this.$refs.editPhotoProjectForm.resetValidation();
    },
  },
  watch: {
    data: {
      handler() {
        this.fields.name = this.data.Name;
        this.fields.permit = this.data.Permit;
        this.fields.section = this.data.Section;
        this.fields.year = this.data.Year;
      },
      deep: true,
    },
  },
};
</script>