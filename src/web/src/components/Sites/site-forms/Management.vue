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
      <RevisionLogsEditor
        v-model="fields.revisionLogs"
        :place-id="placeId"
      />
      <v-divider class="my-3" />
      <ContactsEditor
        v-model="fields.contacts"
        :place-id="placeId"
      />
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
              <v-col
                v-if="i < links.length - 1"
                cols="12"
              >
                <v-divider class="black" />
              </v-col>
            </v-row>
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

import { PLACE_URL, STATIC_URL } from '@/urls';

import ContactsEditor from '@/components/Sites/site-forms/management/ContactsEditor';
import RevisionLogsEditor from '@/components/Sites/site-forms/management/RevisionLogsEditor';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Management',
  components: {
    ContactsEditor,
    RevisionLogsEditor,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    date: null,
    menu: false,

    links: [],

    linkTypeOptions: [],
    jurisdictionOptions: [],
    ownerConsentOptions: [],
    statuteOptions: [],

    fields: {
      cIHBNumber: '',
      contacts: [],
      doorCondition: '',
      fHBRONumber: '',
      jurisdiction: '',
      ownerConsent: '',
      recognitionDate: '',
      isPubliclyAccessible: false,
      statute2Id: '',
      statuteId: '',
      yGBuildingNumber: '',
      yGReserveNumber: '',
    },
  }),
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
        this.fields.recognitionDate = this.fields.recognitionDate || '';
        this.links = resp.data.relationships.webLinks.data;
      })
      .catch((error) => console.error(error));

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
    addLink() {
      this.links.push({ type: 1, address: 'https://', placeId: this.placeId });
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
        contacts: this.fields.contacts,
        revisionLogs: this.fields.revisionLogs,
      };

      axios
        .put(`${PLACE_URL}/${this.placeId}/management`, body)
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
