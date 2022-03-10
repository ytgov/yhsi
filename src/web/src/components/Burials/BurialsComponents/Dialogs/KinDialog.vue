<template>
    <div>
        <v-dialog v-if="mode == 'new'"
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

            <!-- edit dialog -->
        <v-dialog
          v-if="mode == 'edit'"
          v-model="editDialog"
          persistent
          max-width="600px"
        >
        <template #activator="{ on: dialog }">
        <v-tooltip bottom>
          <template #activator="{ on: tooltip }">
            <v-btn 
              v-on="{ ...tooltip, ...dialog }"
              icon class="grey--text text--darken-2"  @click="openEditDialog()">
                  <v-icon
                  small
                  >mdi-pencil</v-icon>  
              </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
      </template>
          
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit Kin</span>
            </v-card-title>
            <v-card-text>
              <v-container>
              <v-form v-model="form2" ref="kinEditDialog">
                <v-row>
                    <v-col cols="6">
                        <v-text-field outlined dense
                            name="Name"
                            label="Name"
                            v-model="NameEdit"
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
                            v-model="RelationshipEdit"
                            :rules="rules"
                        ></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6">
                        <v-text-field outlined dense
                            name="Location"
                            label="Location"
                            v-model="LocationEdit"
                            :rules="rules"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field outlined dense
                            name="Quantity"
                            label="Quantity"
                            v-model="QuantityEdit"
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
                @click="editDialog = false"
              >
                Close
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="saveEdit()"
                :disabled="!form2"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    props: [ "data", "BurialID", "mode", "kinToEdit"],
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
        //edit dialog
        editDialog: false,
        form2: false,
        QuantityEdit: "",
        NameEdit: '',
        LocationEdit: '',
        RelationshipEdit: '',

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

          this.$emit('newKinship', kinship);
          this.$refs.kinDialog.reset();
          this.dialog = false;
        },
      saveEdit(){
        const { RelationshipEdit, LocationEdit, QuantityEdit, NameEdit } = this;

        const kinship = {
          RelationshipID: RelationshipEdit.RelationLUpID,
          RelationshipLUpID: RelationshipEdit.RelationLUpID,
          Relationship: RelationshipEdit.Relationship,
          Location: LocationEdit, 
          Quantity: QuantityEdit, 
          Name: NameEdit,
          BurialID: this.BurialID,
          edited: true,
          NOKID: this.kinToEdit.Kinship.NOKID
        }

        this.$emit("editKinship", kinship, this.kinToEdit.index);
        this.$refs.kinEditDialog.reset();
        this.editDialog = false;
      },
      openEditDialog(){
        const { Relationship, Location, Quantity, Name } = this.kinToEdit.Kinship;

        this.RelationshipEdit = Relationship; 
        this.LocationEdit = Location;
        this.QuantityEdit = Quantity;
        this.NameEdit = Name;
        this.editDialog = true;
      }
    }
}
</script>