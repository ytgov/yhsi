<template lang="pug">
v-card.mb-0(
  tag="section"
  outlined
  tile
)
  v-card-title.mb-0.text-h4(tag="h2")
    | Management
  v-card-text
    RevisionLogsEditor(
      v-model="fields.revisionLogs",
      :place-id="placeId"
    )
    v-divider.my-3
    ContactsEditor(
      v-model="fields.contacts",
      :place-id="placeId"
    )
    v-divider.my-3
    WebLinksEditor(
      v-model="fields.webLinks",
      :place-id="placeId"
    )
    v-divider.my-3
    v-row
      v-col(cols="6")
        v-card.default.mb-0(tag="section")
          v-card-title.mb-0.text-h6(tag="h3")
            | Designation Information
          v-card-text
            v-col(cols="12")
              v-combobox(
                v-model="fields.jurisdiction"
                label="Jurisdiction"
                dense
                outlined
                background-color="white"
              )
              v-menu(
                ref="recognitionDateMenu",
                :close-on-content-click="false"
                transition="scale-transition"
                nudge-top="26"
                offset-y
                min-width="auto"
              )
                template(v-slot:activator="{ on, attrs }")
                  v-text-field(
                    v-model="fields.recognitionDate"
                    label="Recognition Date"
                    append-icon="mdi-calendar"
                    readonly
                    dense
                    outlined
                    background-color="white"
                    v-bind="attrs"
                    v-on="on"
                  )
                v-date-picker(
                  ref="picker"
                  v-model="fields.recognitionDate",
                  :max="todaysDate"
                  min="1950-01-01"
                  @input="recognitionDateMenu = false"
                )
              v-combobox(
                v-model="fields.ownerConsent"
                label="Owner Consent"
                dense
                outlined
                background-color="white"
              )
              .rounded.white.px-2.pt-1.pb-2
                v-checkbox(
                  v-model="fields.showInRegister"
                  label="Publicly Accessible?"
                  dense
                  outlined
                  hide-details
                  color="info"
                  background-color="white"
                )
      v-col(cols="6")
        v-text-field(
          v-model="fields.yGBuildingNumber"
          label="YG Building Number"
          required
        )
        v-text-field(
          v-model="fields.yGReserveNumber"
          label="YG Reserve Number"
          required
        )
        v-text-field(
          v-model="fields.cIHBNumber"
          label=" CIHB Number"
          required
        )
        v-text-field(
          v-model="fields.fHBRONumber"
          label="FHBRO Number"
          required
        )
    v-row
      v-col(cols="12")
        v-combobox(
          v-model="fields.statuteId"
          label="Recognition Authority / Recognition Type / Statute"
        )
        v-combobox(
          v-model="fields.statute2Id"
          label="Recognition Authority / Recognition Type / Statute 2"
          hide-details
        )
  v-card-actions
    v-spacer
    v-btn.my-0(
      color="primary"
      @click="saveChanges"
    )
      | Save
</template>

<script>
import axios from 'axios';

import { PLACE_URL, STATIC_URL } from '@/urls';

import ContactsEditor from '@/components/Sites/site-forms/management/ContactsEditor';
import RevisionLogsEditor from '@/components/Sites/site-forms/management/RevisionLogsEditor';
import WebLinksEditor from '@/components/Sites/site-forms/management/WebLinksEditor';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
  name: 'Management',
  components: {
    ContactsEditor,
    RevisionLogsEditor,
    WebLinksEditor,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  data: () => ({
    recognitionDateMenu: false,

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
      webLinks: [],
      yGBuildingNumber: '',
      yGReserveNumber: '',
    },
  }),
  computed: {
    todaysDate() {
      return new Date().toISOString().substr(0, 10);
    },
  },
  mounted() {
    axios
      .get(`${PLACE_URL}/${this.placeId}`)
      .then((resp) => {
        this.fields = resp.data.data;
      })
      .catch((error) => console.error(error));

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
    saveChanges() {
      let body = {
        cIHBNumber: this.fields.cIHBNumber,
        doorCondition: this.fields.doorCondition,
        fHBRONumber: this.fields.fHBRONumber,
        jurisdiction: this.fields.jurisdiction,
        ownerConsent: this.fields.ownerConsent,
        recognitionDate: this.fields.recognitionDate,
        isPubliclyAccessible: this.fields.isPubliclyAccessible,
        statute2Id: this.fields.statute2Id,
        statuteId: this.fields.statuteId,
        yGBuildingNumber: this.fields.yGBuildingNumber,
        yGReserveNumber: this.fields.yGReserveNumber,
        links: this.fields.webLinks,
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
};
</script>
