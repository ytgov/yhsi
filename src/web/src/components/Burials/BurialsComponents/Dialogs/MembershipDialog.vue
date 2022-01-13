<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          outlined
          class="ml-auto mr-1"
          v-bind="attrs"
          v-on="on"
        >
          ADD MEMBERSHIP
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Membership</span>
        </v-card-title>
        <v-card-text>
          <v-container>
              <v-row>
                  <v-col cols="6">
                      <v-text-field
                          name="Membership"
                          label="Membership"
                          v-model="membershipName"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field
                          name="Chapter"
                          label="Chapter"
                          v-model="chapter"
                      ></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                   <v-col cols="12">
                      <v-text-field
                          name="Notes"
                          label="Notes"
                          v-model="notes"
                      ></v-text-field>
                  </v-col>
              </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [ 'action' ],
    data: () => ({
        dialog: false,
        membershipName: "",
        chapter: "",
        notes: "",
    })
}
</script>