<template>
  <v-card
    class="mb-0"
    tag="section"
    outlined
    tile
  >
    <v-card-title
      class="mb-0 text-h4"
      tag="h2"
    >
      Management
    </v-card-title>
    <v-card-text>
      <v-card
        class="default"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Revision Logs
        </v-card-title>
        <v-card-text tag="form">
          <div
            v-for="(item, i) in revisionLogs"
            :key="`log-${i + 1}`"
          >
            <v-row>
              <v-col cols="5">
                <v-combobox
                  v-model="item.revisionType"
                  label="Revision Type"
                  outlined
                  dense
                  background-color="white"
                />

                <v-text-field
                  v-model="item.revisedBy"
                  label="Revised By"
                  required
                  outlined
                  dense
                  hide-details
                  background-color="white"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="item.date"
                  label="Date"
                  required
                  outlined
                  dense
                  background-color="white"
                />

                <v-text-field
                  v-model="item.details"
                  label="Details"
                  required
                  outlined
                  dense
                  hide-details
                  background-color="white"
                />
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="warning"
                  x-small
                  fab
                  title="Remove"
                  class="my-0 float-right"
                  @click="removeLog(i)"
                >
                  <v-icon dark>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <hr
              v-if="i < revisionLogs.length - 1"
              class="my-3"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="info"
            @click="addLog"
          >
            Add New
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-divider class="my-3" />

      <v-card
        class="default mb-0"
        tag="section"
      >
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Contacts
        </v-card-title>
        <v-card-text tag="form">
          <div
            v-for="(item, i) in contacts"
            :key="`contact-${i + 1}`"
          >
            <v-row>
              <v-col cols="6">
                <v-combobox
                  v-model="item.type"
                  label="Type"
                  background-color="white"
                  dense
                  outlined
                  hide-details
                />
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="warning"
                  x-small
                  fab
                  title="Remove"
                  class="my-0 float-right"
                  background-color="white"
                  @click="removeContact(i)"
                >
                  <v-icon dark>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="item.firstName"
                  label="First Name"
                  required
                  dense
                  outlined
                  background-color="white"
                />

                <v-text-field
                  v-model="item.phone"
                  label="Phone"
                  required
                  dense
                  outlined
                  background-color="white"
                />

                <v-textarea
                  v-model="item.mailingAddress"
                  label="Mailing Address"
                  dense
                  outlined
                  hide-details
                  background-color="white"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="item.lastName"
                  label="Last Name"
                  required
                  dense
                  outlined
                  background-color="white"
                />

                <v-text-field
                  v-model="item.email"
                  label="Email"
                  required
                  dense
                  outlined
                  background-color="white"
                />

                <v-textarea
                  v-model="item.description"
                  label="Description"
                  dense
                  outlined
                  hide-details
                  background-color="white"
                />
              </v-col>
            </v-row>
            <hr
              v-if="i < contacts.length - 1"
              class="my-3"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="info"
            class="my-0"
            @click="addContact"
          >
            Add New
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-divider class="my-3" />
      <v-card class="default">
        <v-card-title
          tag="h3"
          class="mb-0 text-h6"
        >
          Web Links
        </v-card-title>
        <v-card-text tag="form">
          <div
            v-for="(item, i) in links"
            :key="`link-${i + 1}`"
          >
            <v-row>
              <v-col cols="5">
                <v-combobox
                  v-model="item.type"
                  label="Link Type"
                  dense
                  outlined
                  hide-details
                  background-color="white"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="item.webAddress"
                  label="Web Address"
                  required
                  dense
                  outlined
                  hide-details
                  background-color="white"
                />
              </v-col>
              <v-col cols="2">
                <v-btn
                  color="warning"
                  x-small
                  fab
                  title="Remove"
                  class="my-0 float-right"
                  @click="removeLink(i)"
                >
                  <v-icon dark>mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <hr
              v-if="i < links.length - 1"
              class="my-4"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="my-0"
            color="info"
            @click="addLink"
          >
            Add New
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-divider class="my-3" />
      <v-row>
        <v-col cols="6">
          <v-card
            class="default mb-0"
            tag="section"
          >
            <v-card-title
              tag="h3"
              class="mb-0 text-h6"
            >
              Designation Information
            </v-card-title>
            <v-card-text>
              <v-col cols="12">
                <v-combobox
                  v-model="fields.jurisdiction"
                  label="Jurisdiction"
                  dense
                  outlined
                  background-color="white"
                />

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
                      dense
                      outlined
                      background-color="white"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    ref="picker"
                    v-model="fields.recognitionDate"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1950-01-01"
                    @change="save"
                  />
                </v-menu>

                <v-combobox
                  v-model="fields.ownerConsent"
                  label="Owner Consent"
                  dense
                  outlined
                  background-color="white"
                />

                <div class="rounded white px-2 pt-1 pb-2">
                  <v-checkbox
                    v-model="fields.showInRegister"
                    label="Publicly Accessible?"
                    dense
                    outlined
                    hide-details
                    color="info"
                    background-color="white"
                  />
                </div>
              </v-col>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="fields.yGBuildingNumber"
            label="YG Building Number"
            required
          />

          <v-text-field
            v-model="fields.yGReserveNumber"
            label="YG Reserve Number"
            required
          />

          <v-text-field
            v-model="fields.cIHBNumber"
            label=" CIHB Number"
            required
          />

          <v-text-field
            v-model="fields.fHBRONumber"
            label="FHBRO Number"
            required
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-combobox
            v-model="fields.statuteId"
            label="Recognition Authority / Recognition Type / Statute"
          />

          <v-combobox
            v-model="fields.statute2Id"
            label="Recognition Authority / Recognition Type / Statute 2"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        class="my-0"
        color="primary"
        @click="saveChanges"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

import store from '@/store';
import { PLACE_URL, STATIC_URL } from '@/urls';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Management',
  data: () => ({
    valid: false,
    loadedId: -1,
    generalRules: [
      (v) => !!v || 'This input is required',
      (v) => v.length <= 20 || 'This input must be less than 20 characters',
    ],
    date: null,
    menu: false,
    currentUser: 'asd',

    revisionLogs: [],
    contacts: [],
    links: [],

    revisionTypeOptions: [],
    contactTypeOptions: [],
    linkTypeOptions: [],
    jurisdictionOptions: [],
    ownerConsentOptions: [],
    statuteOptions: [],

    fields: {
      cIHBNumber: '', //
      doorCondition: '',
      fHBRONumber: '', //
      jurisdiction: '', //
      ownerConsent: '', //
      recognitionDate: '', //
      isPubliclyAccessible: false, //
      statute2Id: '', //
      statuteId: '', //
      yGBuildingNumber: '', //
      yGReserveNumber: '', //
    },
  }),
  created: function () {
    let id = this.$route.params.id;
    this.loadedId = id;
    this.currentUser = store.getters.fullName;

    axios
      .get(`${PLACE_URL}/${id}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.fields.recognitionDate = this.fields.recognitionDate || '';
        this.revisionLogs = resp.data.relationships.revisionLogs.data;
        this.contacts = resp.data.relationships.contacts.data;
        this.links = resp.data.relationships.webLinks.data;
        store.dispatch('addSiteHistory', resp.data.data);
        this.$parent.siteName = this.fields.primaryName;
      })
      .catch((error) => console.error(error));

    axios.get(`${STATIC_URL}/revision-log-type`).then((resp) => {
      this.revisionTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/contact-type`).then((resp) => {
      this.contactTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/link-type`).then((resp) => {
      this.linkTypeOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/jurisdiction`).then((resp) => {
      this.jurisdictionOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/statute`).then((resp) => {
      this.statuteOptions = resp.data.data;
    });
    axios.get(`${STATIC_URL}/owner-consent`).then((resp) => {
      this.ownerConsentOptions = resp.data.data;
    });
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    addLog() {
      let date = new Date();
      let month = ('0' + (date.getMonth() + 1)).slice(-2);
      let day = ('0' + date.getDate()).slice(-2);

      this.revisionLogs.push({
        placeId: this.loadedId,
        revisionLogType: 5,
        revisionDate: `${date.getFullYear()}-${month}-${day}`,
        revisedBy: this.currentUser,
      });
    },
    removeLog(index) {
      this.revisionLogs.splice(index, 1);
    },
    addContact() {
      this.contacts.push({ placeId: this.loadedId, contactType: 1 });
    },
    removeContact(index) {
      this.contacts.splice(index, 1);
    },
    addLink() {
      this.links.push({ type: 1, address: 'https://', placeId: this.loadedId });
    },
    removeLink(index) {
      this.links.splice(index, 1);
    },
    saveChanges() {
      let body = {
        cIHBNumber: this.fields.cIHBNumber,
        doorCondition: this.fields.doorCondition,
        fHBRONumber: this.fields.fHBRONumber,
        jurisdiction: this.fields.jurisdiction,
        ownerConsent: this.fields.ownerConsent,
        recognitionDate: this.fields.recognitionDateDisplay,
        isPubliclyAccessible: this.fields.isPubliclyAccessible,
        statute2Id: this.fields.statute2Id,
        statuteId: this.fields.statuteId,
        yGBuildingNumber: this.fields.yGBuildingNumber,
        yGReserveNumber: this.fields.yGReserveNumber,
        links: this.links,
        contacts: this.contacts,
        revisionLogs: this.revisionLogs,
      };

      axios
        .put(`${PLACE_URL}/${this.loadedId}/management`, body)
        .then((resp) => {
          this.$emit('showAPIMessages', resp.data);
        })
        .catch((err) => {
          this.$emit('showError', err);
        });
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'));
    },
  },
};
</script>
