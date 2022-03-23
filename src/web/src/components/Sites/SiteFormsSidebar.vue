<template>
  <v-navigation-drawer app permanent clipped color="#f1f1f1">
    <v-list dense nav class="mt-4">
      <v-list-item
        v-for="section in sections"
        :key="section.name"
        link
        nav
        :title="section.name"
        :to="section.to"
      >
        <v-list-item-icon>
          <v-icon>{{ section.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ section.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SiteFormsSidebar',
  props: {
    siteId: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    sections() {
      return [
        {
          name: 'Summary',
          icon: 'mdi-note-text-outline',
          to: `/sites/${this.siteId}#summary`,
        },
        {
          name: 'Location',
          icon: 'mdi-map-check',
          to: `/sites/${this.siteId}#location`,
        },
        {
          name: 'Dates & Condition',
          icon: 'mdi-calendar-range',
          to: `/sites/${this.siteId}#dates-and-condition`,
        },
        {
          name: 'Themes & Function',
          icon: 'mdi-shape',
          to: `/sites/${this.siteId}#themes-and-function`,
        },
        {
          name: 'Associations',
          icon: 'mdi-account-group',
          to: `/sites/${this.siteId}#associations`,
        },
        {
          name: 'Legal & Zoning',
          icon: 'mdi-script-text-outline',
          to: `/sites/${this.siteId}#legal-and-zoning`,
        },
        {
          name: 'Photos (combined)',
          icon: 'mdi-image',
          to: `/sites/${this.siteId}#photos`,
        },
        {
          name: 'Management',
          icon: 'mdi-hammer-wrench',
          to: `/sites/${this.siteId}#management`,
        },
        {
          name: 'Description',
          icon: 'mdi-alphabetical',
          to: `/sites/${this.siteId}#description`,
        },
      ];
    },
  },
};
</script>
