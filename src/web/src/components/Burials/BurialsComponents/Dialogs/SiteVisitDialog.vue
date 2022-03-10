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
          ADD SITE VISIT
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Next of Kin</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="visitDialog" >
               <v-row>
                   <v-col cols="4">
                      <v-text-field
                          name="MarkerDescription"
                          label="Marker Description"
                          v-model="MarkerDescription"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                      <v-text-field
                          name="Inscription"
                          label="Inscription"
                          v-model="Inscription"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                      <v-text-field
                          name="Condition"
                          label="Condition"
                          v-model="Condition"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="6">
                      <v-text-field
                          name="YearRecorded"
                          label="Year Recorded"
                          v-model="VisitYear"
                          type="number"
                          :rules="numberRules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field
                          name="RecordedBy"
                          label="Recorded by"
                          v-model="RecordedBy"
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
            <v-form v-model="form2" ref="visitEditDialog">
               <v-row>
                   <v-col cols="4">
                      <v-text-field
                          name="MarkerDescription"
                          label="Marker Description"
                          v-model="MarkerDescriptionEdit"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                      <v-text-field
                          name="Inscription"
                          label="Inscription"
                          v-model="InscriptionEdit"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="4">
                      <v-text-field
                          name="Condition"
                          label="Condition"
                          v-model="ConditionEdit"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                  <v-col cols="6">
                      <v-text-field
                          name="YearRecorded"
                          label="Year Recorded"
                          v-model="VisitYearEdit"
                          type="number"
                          :rules="numberRules"
                      ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field
                          name="RecordedBy"
                          label="Recorded by"
                          v-model="RecordedByEdit"
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
    props: [ "mode", "visitToEdit" ],
    data: () => ({
        dialog: false,
        valid: false,
        MarkerDescription: "",
        Inscription: "",
        Condition: "",
        VisitYear: "",
        RecordedBy: "",
        rules: [
          value => !!value || 'Required.',
        ],
        numberRules: [
          value => !!value || 'A number is required.',
        ],
        //editDialog
        editDialog: false,
        form2: false,
        MarkerDescriptionEdit: "",
        InscriptionEdit: "",
        ConditionEdit: "",
        VisitYearEdit: "",
        RecordedByEdit: "",
    }),
    methods: {
      saveNew(){
        let { MarkerDescription, Inscription, Condition, VisitYear, RecordedBy } = this;

        const visit = {
          MarkerDescription, Inscription, Condition, VisitYear, RecordedBy, new: true
        }
        this.$emit("newSiteVisit", visit);
        this.dialog = false;
        this.$refs.visitDialog.reset();
      },
      saveEdit(){
        const {
          MarkerDescriptionEdit,
          InscriptionEdit,
          ConditionEdit,
          VisitYearEdit,
          RecordedByEdit
        } = this;
        const visit = {
          MarkerDescription: MarkerDescriptionEdit, 
          Inscription: InscriptionEdit, 
          Condition: ConditionEdit, 
          VisitYear: VisitYearEdit, 
          RecordedBy: RecordedByEdit, 
          edited: true,
          SiteVisitID: this.visitToEdit.SiteVisit.SiteVisitID
        }
        this.$emit("editSiteVisit", visit, this.visitToEdit.index);
        this.$refs.visitEditDialog.reset();
        this.editDialog = false;
      },
      openEditDialog(){
        const {
          MarkerDescription, Inscription, Condition, VisitYear, RecordedBy
        } = this.visitToEdit.SiteVisit;
          this.MarkerDescriptionEdit = MarkerDescription;
          this.InscriptionEdit = Inscription;
          this.ConditionEdit = Condition;
          this.VisitYearEdit = VisitYear;
          this.RecordedByEdit = RecordedBy;
      
        this.editDialog = true;
      }
    }
}
</script>