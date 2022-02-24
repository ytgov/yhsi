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
                          v-model="Name"
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
                          v-model="Relationship"
                          :rules="rules"
                      ></v-select>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="6">
                      <v-text-field outlined dense
                          name="Location"
                          label="Location"
                          v-model="Location"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field outlined dense
                          name="Quantity"
                          label="Quantity"
                          v-model="Quantity"
                          type="number"
                          :rules="numberRules"
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
    props: [ "data",  "BurialID"],
    data: () => ({
        dialog: false,
        valid: false,
        Quantity: "",
        Name: '',
        Location: '',
       // RelationLUpID: 2,
        Relationship: '',
        rules: [
          value => !!value || 'Required.',
        ],
        numberRules: [
          value => !!value || 'A number is required.',
        ],
    }),
    methods: {
        saveNew(){
          const { Relationship, Location, Quantity, Name } = this;

          const kinship = {
            RelationshipID: Relationship.RelationLUpID,
            RelationshipLUpID: Relationship.RelationLUpID,
            Relationship: Relationship.Relationship,
            Location, 
            Quantity, 
            Name,
            BurialID: this.BurialID,
            new: true
          }
          console.log(kinship);
/*
          NOKID: 1230,
    BurialID: 3700,
    RelationshipID: 2,
    Quantity: null,
    Name: 'member Seattle City Police force',
    Location: '',
    RelationLUpID: 2,
    Relationship: 'Brother'
    */
          this.$emit('newKinship', kinship);
          this.$refs.kinDialog.reset();
          this.dialog = false;
        }
    }
}
</script>