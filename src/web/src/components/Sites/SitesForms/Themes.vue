<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Themes & Function
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider class="mb-5"></v-divider>
    <v-form v-model="valid">
      <div class="row mx-1">
        <div class="col-md-6"><h3>Themes</h3>
          <v-alert
            v-for="(item, i) in fields.themes"
            :key="`theme-${i + 1}`"
            outlined
            color="primary"
          >
            <div class="sub-title">Theme {{ i + 1 }}</div>
            <v-btn
              icon
              color="primary"
              class="top-right-button"
              @click="removeItem('themes', i)"
            >
              <v-icon dark>mdi-minus-circle</v-icon>
            </v-btn>
            <v-combobox
              v-model="item.category"
              label="Category / Type"
              dense
              outlined
              background-color="white"
            ></v-combobox>
          </v-alert>
          <v-btn color="info" @click="addItem('themes')"> Add theme </v-btn>
         
        </div>
        <div class="col-md-6"> <v-textarea
            label="YHS Themes"
            v-model="fields.yHSThemes"
            dense
            outlined
            background-color="white"
          ></v-textarea>
          
        </div>
        <div class="col-md-12">
          <div class="mb-2">Functional Users</div>
          <v-alert
            v-for="(item, i) in fields.functionalUses"
            :key="`theme-${i + 1}`"
            outlined
            color="primary"
          >
            <div class="sub-title">Funcitonal Use {{ i + 1 }}</div>
            <v-btn
              icon
              color="primary"
              class="top-right-button"
              @click="removeItem('functionalUses', i)"
            >
              <v-icon dark>mdi-minus-circle</v-icon>
            </v-btn>
            <v-row>
              <v-col cols="4">
                <v-combobox
                  label="Use Type"
                  v-model="item.useType"
                  dense
                  outlined
                  background-color="white"
                ></v-combobox>
              </v-col>
              <v-col cols="8">
                <v-combobox
                  v-model="item.category"
                  label="Functional Category / Type"
                  dense
                  outlined
                  background-color="white"
                ></v-combobox>
              </v-col>
            </v-row>
          </v-alert>
          <v-btn color="info" @click="addItem('functionalUses')">
            Add New
          </v-btn>
        </div>
        <div class="col-md-12">
          <v-textarea
            label="YHS Current Use"
            v-model="fields.currentUseComment"
            dense
            outlined
            background-color="white"
          ></v-textarea>
        </div>
        <div class="col-md-12">
          <v-textarea
            label="YHS Past Use"
            v-model="fields.yHSPastUse"
            dense
            outlined
            background-color="white"
          ></v-textarea>
        </div>
      </div>
    </v-form>
  </div>
</template>

<script>
import axios from "axios";
import { PLACE_URL } from "../../../urls";
/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: "formThemes",
  data: () => ({
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],
    fields: {
      /* Placeholder variables below this line **Read above** */
      themes: [{ category: "" }],
      functionalUses: [
        { useType: "text1", category: "" },
        { useType: "text2", category: "" },
      ],
      /*Field data from the swaggerhub api docs below this line*/
      currentUseComment: "", //
      yHSPastUse: "", //
      yHSThemes: "", //
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
        case "themes":
          this.fields[objName].push({ category: "" });
          break;
        case "functionalUses":
          this.fields[objName].push({ useType: "", category: "" });
          break;
      }
    },
  },
};
</script>