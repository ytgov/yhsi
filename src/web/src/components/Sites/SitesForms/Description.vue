<template>
  <div>
    <v-card-title primary-title> Description </v-card-title>
    <v-divider inset></v-divider>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="mb-2">Descriptions</div>
            <v-alert
              v-for="(item, i) in fields.descriptions"
              :key="`theme-${i + 1}`"
              outlined
              color="primary"
            >
              <div class="sub-title">Description {{ i + 1 }}</div>
              <v-btn
                icon
                color="primary"
                class="top-right-button"
                @click="removeItem('descriptions', i)"
              >
                <v-icon dark>mdi-minus-circle</v-icon>
              </v-btn>
              <v-row>
                <v-col cols="6">
                  <v-combobox
                    v-model="item.type"
                    label="Decription Type"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea v-model="item.description" label=""></v-textarea>
                </v-col>
              </v-row>
            </v-alert>
            <v-btn outlined color="primary" @click="addItem('descriptions')">
              Add New
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { PLACE_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formDescription",
  data: () => ({
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],
    /* Placeholder variables below this line **Read above** */
    fields: {
      descriptions: [{ type: "", description: "" }],
    },
  }),
  created: function () {
    let id = this.$route.params.id;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        console.log("PLACE", this.fields);
      })
      .catch((error) => console.error(error));
  },
  methods: {
    removeItem(objName, position) {
      if (position > -1) {
        this.fields[objName].splice(position, 1);
      }
    },
    addItem(objName) {
      switch (
        objName // Selects which structure to add to the new element of the array
      ) {
        case "descriptions":
          this.fields[objName].push({ type: "", description: "" });
          break;
      }
    },
  },
};
</script>