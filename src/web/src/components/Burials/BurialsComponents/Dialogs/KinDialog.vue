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
          ADD NEXT OF KIN
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Next of Kin</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="kinDialog">
              <v-row>
                   <v-col cols="6">
                      <v-text-field outlined dense
                          name="Name"
                          label="Name"
                          v-model="name"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-select outlined dense
                          :items="data"
                          item-text="Relationship"
                          return-object
                          name="Relationship"
                          label="Relationship"
                          v-model="relationship"
                          :rules="rules"
                      ></v-select>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="6">
                      <v-text-field outlined dense
                          name="Location"
                          label="Location"
                          v-model="location"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field outlined dense
                          name="Quantity"
                          label="Quantity"
                          v-model="quantity"
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
    props: [ "data" ],
    data: () => ({
        dialog: false,
        valid: false,
        name: "",
        relationship: "",
        location: "",
        quantity: "",
        rules: [
          value => !!value || 'Required.',
        ],
    }),
    methods: {
        saveNew(){
          const { relationship, location, quantity, name } = this;
          const kinship = {
            relationship, location, quantity, name
          }
          this.$emit('newKinship', kinship);
          this.$refs.kinDialog.reset();
          this.dialog = false;
        }
    }
}
</script>