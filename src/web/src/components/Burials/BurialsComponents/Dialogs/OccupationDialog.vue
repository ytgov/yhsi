<template>
  <div>
        <v-dialog
        v-if="mode == 'new'"
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
              <v-form v-model="form1" ref="occupationDialog">
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
              :disabled="!form2"
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
          <span class="text-h5">Edit Occupation</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="form2" ref="occupationEditDialog">
              <v-row>
                   <v-col cols="12">
                      <v-select
                          :items="data"
                          return-object
                          item-text="Occupation"
                          v-model="occupationEdit"
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
    props: [ "data", "mode", "occupationToEdit"],
    data: () => ({
        dialog: false,
        editDialog: false,
        form1: false,
        form2: false,
        occupation: "",
        occupationEdit: "",
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
      },
      saveEdit(){
        console.log(this.occupationEdit);
        this.occupationEdit.edited = true;
        this.$emit("editOccupation", this.occupationEdit, this.occupationToEdit.index);
        this.$refs.occupationEditDialog.reset();
        this.editDialog = false;
      },
      openEditDialog(){
        this.occupationEdit = this.occupationToEdit.Occupation;
        this.editDialog = true;
      }
    },

    
}
</script>