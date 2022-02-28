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
          ADD SOURCE
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Source</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="sourceDialog">
              <v-row>
                   <v-col cols="12">
                      <v-text-field
                          v-model="Source"
                          label="Source"
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
            @click="saveNew()"
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
            <v-form v-model="form2" ref="sourceEditDialog">
              <v-row>
                   <v-col cols="12">
                      <v-text-field
                          v-model="SourceEdit"
                          label="Source"
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
    props: [ "mode", "sourceToEdit" ],
    data: () => ({
        dialog: false,
        Source: "",
        valid: false,
        rules: [
          value => !!value || 'Required.',
        ],
        //editDialog
        editDialog: false,
        form2: false,
        SourceEdit: "",
    }),
    methods: {
      saveNew(){
        this.$emit("newSource", { Source: this.Source, new: true });
        this.$refs.sourceDialog.reset();
        this.dialog = false;
      },
      saveEdit(){
        this.$emit("editSource",  { Source: this.SourceEdit, edited: true, SourceID: this.sourceToEdit.Source.SourceID }, this.sourceToEdit.index);
        this.$refs.sourceEditDialog.reset();
        this.editDialog = false;
      },
      openEditDialog(){
        this.SourceEdit = this.sourceToEdit.Source.Source;
        this.editDialog = true;
      }
    }
}
</script>