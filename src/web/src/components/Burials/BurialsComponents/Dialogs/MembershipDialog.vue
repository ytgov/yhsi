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
            <v-form v-model="valid" ref="membershipDialog">
              <v-row>
                  <v-col cols="6">
                      <v-select outlined dense
                          :items="data"
                          name="Membership"
                          item-text="Membership"
                          return-object
                          label="Membership"
                          v-model="Membership"
                          :rules="rules"
                      ></v-select>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field outlined dense
                          name="Chapter"
                          label="Chapter"
                          v-model="Chapter"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                   <v-col cols="12">
                      <v-text-field outlined dense
                          name="Notes"
                          label="Notes"
                          v-model="Notes"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
              </v-row>
            </v-form>       
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
            :disabled="!valid"
            @click="saveNew"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [ 'action', "data" ],
    data: () => ({
        dialog: false,
        valid: false,
        Membership: "",
        Chapter: "",
        Notes: "",
        rules: [
        value => !!value || 'Required.',
      ],
    }),
    methods:{
      saveNew(){
        const { Chapter, Notes } = this;

        const { Membership, MembershipLUpID } = this.Membership;
        this.$emit("newMembership",{ Membership, MembershipLUpID, Chapter, Notes });
        this.$refs.membershipDialog.reset();
        this.dialog = false;
      }
    }
}
</script>