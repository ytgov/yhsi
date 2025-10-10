<template lang="pug">
v-card.mb-0(
  tag="section"
  outlined
  tile
)
  v-card-title.mb-0.text-h4(tag="h2")
    | Legal &amp; Zoning
  v-card-text(tag="section")
    OwnershipsViewer(:value="place.ownerships")
    v-divider.my-3
    v-row
      v-col(cols="6")
        v-text-field(
          :value="place.zoning"
          label="Zoning"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          :value="place.townSiteMapNumber"
          label="Town site map number"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
    v-row
      v-col(cols="6")
        v-text-field(
          :value="place.siteDistrictNumber"
          label="Site district"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          :value="place.groupYHSI"
          label="Group YHSI"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
    v-row
      v-col(cols="6")
        v-text-field(
          :value="place.lAGroup"
          label="Group"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          :value="place.lot"
          label="Lot"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
    v-row
      v-col(cols="6")
        v-text-field(
          :value="place.block"
          label="Block"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
      v-col(cols="6")
        v-text-field(
          :value="place.planNumber"
          label="Plan number"
          readonly
          dense
          outlined
          background-color="white"
          hide-details
        )
    v-divider.my-3
    PreviousOwnershipsViewer(:value="place.previousOwnerships")
  v-card-actions
    v-spacer
    v-tooltip(left)
      template(#activator="{ on, attrs }")
        div(v-on="on")
          v-btn.my-0(
            color="primary"
            disabled
          ) Save
      span There are pending site change requests against this site's legal and zoning information.
</template>

<script>
import { mapGetters } from 'vuex';

import OwnershipsViewer from '@/components/Sites/site-forms/legal-and-zoning/OwnershipsViewer';
import PreviousOwnershipsViewer from '@/components/Sites/site-forms/legal-and-zoning/PreviousOwnershipsViewer';

export default {
  name: 'LegalAndZoningViewer',
  components: {
    OwnershipsViewer,
    PreviousOwnershipsViewer,
  },
  props: {
    placeId: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      place: 'places/place',
    }),
  },
};
</script>
