<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          outlined
          class="ml-auto mr-1"
        >
          ADD OCUPATION
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Occupation</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="occupationDialog">
              <v-row>
                   <v-col cols="12">
                      <v-select
                          :items="data"
                          return-object
                          item-text="Occupation"
                          v-model="occupation"
                          label="Occupation"
                          :rules="rules"
                      ></v-select>
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
            @click="saveNew"
            :disabled="!valid"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [ "data" ],
    data: () => ({
        dialog: false,
        valid: false,
        occupation: "",
        rules: [
          value => !!value || 'Required.',
        ],
    }),
    methods: {
      saveNew(){
        this.occupation.new = true;
        this.$emit("newOccupation", this.occupation);
        this.$refs.occupationDialog.reset();
        this.dialog = false;
      }
    }
}
</script>