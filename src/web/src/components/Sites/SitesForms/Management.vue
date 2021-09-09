<template>
  <div>
    <v-card-title style="width: 100%; display: block">
      Management
      <div class="float-right">
        <v-btn class="my-0" color="primary" @click="saveChanges()">Save</v-btn>
      </div>
    </v-card-title>
    <v-divider inset></v-divider>
    <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="mb-2">Revision Logs</div>
            <v-alert
              v-for="(item, i) in fields.revisionLogs"
              :key="`theme-${i + 1}`"
              outlined
              color="primary"
            >
              <div class="sub-title">Revision Log {{ i + 1 }}</div>
              <v-btn
                icon
                color="primary"
                class="top-right-button"
                @click="removeItem('revisionLogs', i)"
              >
                <v-icon dark>mdi-minus-circle</v-icon>
              </v-btn>
              <v-row>
                <v-col cols="6">
                  <v-combobox
                    v-model="item.revisionType"
                    label="Revision Type"
                  ></v-combobox>

                  <v-text-field
                    v-model="item.revisedBy"
                    label="Revised By"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="item.date"
                    label="Date"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.details"
                    label="Details"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-alert>
            <v-btn outlined color="primary" @click="addItem('revisionLogs')">
              Add New
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-row>
          <v-col cols="12">
            <div class="mb-2">Contacts</div>
            <v-alert
              v-for="(item, i) in fields.contacts"
              :key="`theme-${i + 1}`"
              outlined
              color="primary"
            >
              <div class="sub-title">Contact {{ i + 1 }}</div>
              <v-btn
                icon
                color="primary"
                class="top-right-button"
                @click="removeItem('contacts', i)"
              >
                <v-icon dark>mdi-minus-circle</v-icon>
              </v-btn>
              <v-row>
                <v-col cols="6">
                  <v-combobox v-model="item.type" label="Type"></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="item.firstName"
                    label="First Name"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.phone"
                    label="Phone"
                    required
                  ></v-text-field>

                  <v-textarea
                    label="Mailing Address"
                    v-model="item.mailingAddress"
                  ></v-textarea>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="item.lastName"
                    label="Last Name"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="item.email"
                    label="Email"
                    required
                  ></v-text-field>

                  <v-textarea
                    label="Description"
                    v-model="item.description"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-alert>
            <v-btn outlined color="primary" @click="addItem('contacts')">
              Add New
            </v-btn>
          </v-col>
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-row>
          <v-col cols="12">
            <div class="mb-2">Web Links</div>
            <v-alert
              v-for="(item, i) in fields.webLinks"
              :key="`theme-${i + 1}`"
              outlined
              color="primary"
            >
              <div class="sub-title">Web Link {{ i + 1 }}</div>
              <v-btn
                icon
                color="primary"
                class="top-right-button"
                @click="removeItem('webLinks', i)"
              >
                <v-icon dark>mdi-minus-circle</v-icon>
              </v-btn>
              <v-row>
                <v-col cols="6">
                  <v-combobox
                    v-model="item.type"
                    label="Link Type"
                  ></v-combobox>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="item.webAddress"
                    label="Web Address"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-alert>
            <v-btn outlined color="primary" @click="addItem('webLinks')">
              Add New
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-alert outlined color="primary">
              <div class="sub-title">Designation Information</div>
              <v-row>
                <v-col cols="12">
                  <v-combobox
                    v-model="fields.jurisdiction"
                    label="Jurisdiction"
                  ></v-combobox>

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
                        v-model="fields.recognitionDate"
                        label="Recognition Date"
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

                  <v-combobox
                    v-model="fields.ownerConsent"
                    label="Owner Consent"
                  ></v-combobox>

                  <v-checkbox
                    v-model="fields.showInRegister"
                    label="Publicly Accessible?"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="fields.yGBuildingNumber"
              label="YG Building Number"
              required
            ></v-text-field>

            <v-text-field
              v-model="fields.yGReserveNumber"
              label="YG Reserve Number"
              required
            ></v-text-field>

            <v-text-field
              v-model="fields.cIHBNumber"
              label=" CIHB Number"
              required
            ></v-text-field>

            <v-text-field
              v-model="fields.fHBRONumber"
              label="FHBRO Number"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-combobox
              v-model="fields.statuteId"
              label="Recognition Authority / Recognition Type / Statute"
            ></v-combobox>

            <v-combobox
              v-model="fields.statute2Id"
              label="Recognition Authority / Recognition Type / Statute 2"
            ></v-combobox>
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
  name: "formManagement",
  data: () => ({
    valid: false,
    generalRules: [
      (v) => !!v || "This input is required",
      (v) => v.length <= 20 || "This input must be less than 20 characters",
    ],
    date: null,
    menu: false,
    fields: {
      /* Placeholder variables below this line **Read above** */
      revisionLogs: [
        { revisionType: "", date: "", revisedBy: "", details: "" },
        { revisionType: "", date: "", revisedBy: "", details: "" },
      ],
      contacts: [
        {
          type: "",
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          mailingAddress: "",
          description: "",
        },
      ],
      webLinks: [{ type: "", webAddress: "" }],
      /*Field data from the swaggerhub api docs below this line*/
      cIHBNumber: "", //
      doorCondition: "",
      fHBRONumber: "", //
      jurisdiction: "", //
      ownerConsent: "", //
      recognitionDate: "", //
      showInRegister: "", //
      statute2Id: "", //
      statuteId: "", //
      yGBuildingNumber: "", //
      yGReserveNumber: "", //
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
    save(date) {
      this.$refs.menu.save(date);
    },
    removeItem(objName, position) {
      if (position > -1) {
        this.fields[objName].splice(position, 1);
      }
    },
    addItem(objName) {
      switch (
        objName // Selects which structure to add to the new element of the array
      ) {
        case "revisionLogs":
          this.fields[objName].push({
            revisionType: "",
            date: "",
            revisedBy: "",
            details: "",
          });
          break;
        case "contacts":
          this.fields[objName].push({
            type: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            mailingAddress: "",
            description: "",
          });
          break;
        case "webLinks":
          this.fields[objName].push({ type: "", webAddress: "" });
          break;
      }
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    },
  },
};
</script>