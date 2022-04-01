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
          <span class="text-h5">Edit Membership</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="form2" ref="membershipEditDialog">
              <v-row>
                  <v-col cols="6">
                      <v-select outlined dense
                          :items="data"
                          name="Membership"
                          item-text="Membership"
                          return-object
                          label="Membership"
                          v-model="MembershipEdit"
                          :rules="rules"
                      ></v-select>
                  </v-col>
                  <v-col cols="6">
                      <v-text-field outlined dense
                          name="Chapter"
                          label="Chapter"
                          v-model="ChapterEdit"
                          :rules="rules"
                      ></v-text-field>
                  </v-col>
              </v-row>
              <v-row>
                   <v-col cols="12">
                      <v-text-field outlined dense
                          name="Notes"
                          label="Notes"
                          v-model="NotesEdit"
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
    props: [ 'action', "data",  "mode", "membershipToEdit" ],
    data: () => ({
      //new Dialog
        dialog: false,
        valid: false,
        Membership: "",
        Chapter: "",
        Notes: "",
        rules: [
        value => !!value || 'Required.',
      ],
      //edit dialog
      form2: false,
      editDialog: false,
      MembershipEdit: "",
      ChapterEdit: "",
      NotesEdit: "",
    }),
    methods:{
      saveNew(){
        const { Chapter, Notes } = this;

        const { Membership, MembershipLUpID } = this.Membership;
        this.$emit("newMembership",{ Membership, MembershipLUpID, Chapter, Notes, new: true });
        this.$refs.membershipDialog.reset();
        this.dialog = false;
      },
      saveEdit(){
        const { ChapterEdit, NotesEdit } = this;

        const { Membership, MembershipLUpID } = this.MembershipEdit;
        //console.log({ Membership, MembershipLUpID, Chapter:ChapterEdit, Notes: NotesEdit, edited: true });
        this.$emit("editMembership",{ Membership, MembershipLUpID, Chapter:ChapterEdit, Notes: NotesEdit, edited: true, ID: this.membershipToEdit.Membership.ID }, this.membershipToEdit.index);
        this.$refs.membershipEditDialog.reset();
        this.editDialog = false;
      },
      openEditDialog(){
        const { Chapter, Notes, Membership, MembershipLUpID } = this.membershipToEdit.Membership;
        //console.log( this.membershipToEdit.Membership);
        this.MembershipEdit = {Membership, MembershipLUpID};
        this.ChapterEdit = Chapter;
        this.NotesEdit = Notes;

        this.editDialog = true;
      }
    }
}
</script>