<template>
  <div>
    <h3>Boat Owner</h3>
    <Breadcrumbs />
    <v-row>
      <v-col cols="12" class="d-flex">
        <h1 v-if="mode == 'view'">{{ fields.OwnerName }}</h1>
        <h1 v-else-if="mode == 'edit'"></h1>
        <h1 v-else>New Owner</h1>
        <v-spacer></v-spacer>
        <!-- buttons for the view state -->
        <v-btn class="black--text mx-1" @click="editMode" v-if="mode == 'view'">
          <v-icon class="mr-1">mdi-pencil</v-icon>
          Edit
        </v-btn>
        <PrintButton
          v-if="mode == 'view'"
          :name="fields.OwnerName"
          :data="fields"
        />
        <!-- buttons for the edit state -->
        <v-btn
          class="black--text mx-1"
          @click="cancelEdit"
          v-if="mode == 'edit'"
        >
          <v-icon>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="success"
          :disabled="showSave < 2"
          v-if="mode == 'edit'"
          @click="saveChanges()"
        >
          <v-icon class="mr-1">mdi-check</v-icon>
          Done
        </v-btn>
        <!-- buttons for the new state -->
        <v-btn class="black--text mx-1" @click="cancelNew" v-if="mode == 'new'">
          <v-icon>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="success"
          :disabled="showSave < 2"
          v-if="mode == 'new'"
          @click="saveChanges()"
        >
          <v-icon class="mr-1">mdi-check</v-icon>
          Create owner
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-row>
          <v-col cols="6">
            <v-text-field outlined dense
              v-if="mode != 'view'"
              v-model="fields.OwnerName"
              label="Owner Name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <v-card>
              <v-list class="pa-0">
                <v-subheader>Alias:</v-subheader>
                <v-divider></v-divider>
                <div class="scrollAlias">
                  <template v-for="(item, index) in fields.alias">
                    <v-list-item :key="`nl-${index}`">
                      <v-list-item-content>
                        <v-list-item-title
                          v-if="index != editTableAlias || mode == 'view'"
                          >{{ item.Alias }}</v-list-item-title
                        >
                        <v-form
                          v-model="validAlias"
                          v-if="mode != 'view'"
                          v-on:submit.prevent
                        >
                          <v-text-field outlined dense
                            v-if="editTableAlias == index"
                            label="Alias"
                            v-model="helperAlias"
                            :rules="aliasRules"
                          ></v-text-field>
                        </v-form>
                      </v-list-item-content>
                      <v-list-item-action class="d-flex flex-row">
                        <v-tooltip
                          bottom
                          v-if="mode != 'view' && editTableAlias != index"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              icon
                              class="grey--text text--darken-2"
                              @click="changeEditTableAlias(item, index)"
                            >
                              <v-icon small> mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>Edit</span>
                        </v-tooltip>
                        <v-tooltip
                          bottom
                          v-if="mode != 'view' && editTableAlias == index"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              icon
                              class="grey--text text--darken-2"
                              color="success"
                              @click="saveTableAlias(index)"
                            >
                              <v-icon small>mdi-check</v-icon>
                            </v-btn>
                          </template>
                          <span>Save changes</span>
                        </v-tooltip>
                        <v-tooltip
                          bottom
                          v-if="mode != 'view' && editTableAlias == index"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              icon
                              class="grey--text text--darken-2"
                              @click="cancelEditTableAlias()"
                            >
                              <v-icon small>mdi-close</v-icon>
                            </v-btn>
                          </template>
                          <span>Cancel</span>
                        </v-tooltip>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider :key="`ldiv-${index}`"></v-divider>
                  </template>
                </div>
              </v-list>
            </v-card>
            <v-row>
              <v-col cols="12" class="d-flex">
                <v-spacer></v-spacer>
                <v-btn
                  class="mx-1 black--text align"
                  v-if="mode != 'view' && editTableAlias == -1"
                  @click="addAlias()"
                  >Add Alias</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="5"></v-col>
          <v-col cols="7">
            <v-card>
              <v-list class="pa-0">
                <v-subheader>Boats Owned:</v-subheader>
                <v-divider></v-divider>
                <div class="scrollBoats">
                  <template v-for="(item, i) in fields.boats">
                    <v-list-item :key="`nl-${i}`">
                      <v-list-item-content>
                        <v-list-item-title>{{ item.Name }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-tooltip bottom v-if="mode == 'view'">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              @click="goToBoat(item)"
                              icon
                              class="grey--text text--darken-2"
                            >
                              <v-icon small> mdi-information</v-icon>
                            </v-btn>
                          </template>
                          <span>Details</span>
                        </v-tooltip>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider :key="`ldiv-${i}`"></v-divider>
                  </template>
                </div>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!--
        <v-divider class="my-5"></v-divider>
        
        <HistoricRecord :historicRecords="fields.histories" :mode="'view'"/>
        -->
    <HistoricRecord
      v-if="fields.histories != undefined && mode != 'new'"
      :historicRecords="fields.histories"
      :mode="'edit'"
      :ownerID="getOwnerID"
    />
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import Breadcrumbs from "../../../Breadcrumbs";
import HistoricRecord from "../HistoricRecord";
import PrintButton from "./PrintButton";
import owners from "../../../../controllers/owners";
export default {
  name: "ownerForm",
  components: { Breadcrumbs, PrintButton, HistoricRecord },
  data: () => ({
    overlay: false,
    //helper vars, they are used to determine if the component is in an edit, view or add new state
    mode: "",
    showSave: 0,
    //helper vars used for the Alias list functions
    editTableAlias: -1, // tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
    addingAlias: false, // tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
    helperAlias: null,
    validAlias: false,
    aliasRules: [(v) => !!v || "Alias is required"],
    aliasArray: [],
    //helper vars for when v-model is not an option (inside the datatable)
    historiRecordHelper: "",
    recordHelper: "",
    //input fields, datatable, etc
    menu1: "",
    menu2: "",
    menu3: "",
    search: "",
    fields: {},
    fieldsHistory: null,
  }),
  mounted() {
    if (this.checkPath("edit")) {
      this.mode = "edit";
      //after this, the fields get filled with the info obtained from the api
      this.getDataFromAPI();
    } else if (this.checkPath("new")) {
      this.mode = "new";
      //inputs remain empty
      this.noData();
    } else if (this.checkPath("view")) {
      this.mode = "view";
      this.getDataFromAPI();
    }
  },
  methods: {
    /*this function checks if the current path contains a specific word, this can be done with a simple includes but 
        //it causes confusion when a boat or owner has 'new' in its name, leading the component to think it should use the 'new' mode,
        this problem is solved by using this funtion.*/
    checkPath(word) {
      let path = this.$route.path.split("/");
      if (path[3] == word) {
        return true;
      }
      return false;
    },
    noData() {
      this.fields = {
        OwnerName: "",
        alias: [],
        boats: [],
        histories: [],
      };
    },
    saveCurrentOwner() {
      localStorage.currentOwnerID = this.$route.params.id;
    },
    async getDataFromAPI() {
      this.overlay = true;
      if (this.$route.params.id) {
        this.saveCurrentOwner();
      }
      this.fields = await owners.getById(localStorage.currentOwnerID);
      this.fields.alias = this.fields.alias.map((x) => ({
        ...x,
        isEdited: false,
      }));
      //console.log(this.fields);
      this.overlay = false;
    },
    changeEdit() {
      //this method handles the logic behind the top edit, cancel & save changes buttons
      this.fieldsHistory =
        this.edit == false ? { ...this.fields } : { ...this.fieldsHistory };
      this.fields =
        this.edit == true ? { ...this.fieldsHistory } : { ...this.fields };
      this.showSave = 0;
      if (this.edit == true) {
        this.$router.push(`/boats/owner/view/${this.fields.OwnerName}`);
      } else {
        this.$router.push(`/boats/owner/edit/${this.fields.OwnerName}`);
      }
      this.edit = !this.edit;
    },
    goToBoat(value) {
      this.$router.push({
        name: "boatView",
        params: { name: value.Name, id: value.Id },
      });
    },
    //Functions dedicated to handle the edit, add, view modes
    cancelEdit() {
      if (this.fieldsHistory) {
        this.fields = { ...this.fieldsHistory };
      }
      this.mode = "view";
      this.resetListVariables();
      this.$router.push(`/boats/owner/view/${this.fields.OwnerName}`);
    },
    cancelNew() {
      this.$router.push(`/boats/owner/`);
    },
    viewMode() {
      this.mode = "view";
      this.$router.push(`/boats/owner/view/${this.fields.OwnerName}`);
    },
    editMode() {
      this.fieldsHistory = { ...this.fields };
      this.mode = "edit";
      this.$router.push(`/boats/owner/edit/${this.fields.OwnerName}`);
      this.showSave = 0;
      this.resetListVariables();
    },
    async saveChanges() {
      this.overlay = true;
      //console.log(this.fields);
      let newOwnerAlias = this.fields.alias.filter((x) => x.isNew == true);
      newOwnerAlias.map((x) => {
        delete x.isNew;
      });
      let editOwnerAlias = this.fields.alias.filter((x) => x.isEdited == true);
      editOwnerAlias.map((x) => {
        delete x.isEdited;
      });

      let data = {
        owner: {
          OwnerName: this.fields.OwnerName,
        },
        newOwnerAlias,
        editOwnerAlias,
      };
      //console.log(data);
      let currentOwner = {};

      if (this.mode == "new") {
        await owners.post(data);
        this.$router.push(`/boats/owner`);
      } else {
        await owners.put(localStorage.currentOwnerID, data);
        currentOwner.id = localStorage.currentOwnerID;
        currentOwner.name = this.fields.OwnerName;
        this.mode = "view";
        this.$router.push({
          name: "ownerView",
          params: { name: currentOwner.name, id: currentOwner.id },
        });
        this.$router.go();
      }
    },
    editHistoricRecord(newVal) {
      this.historiRecordHelper = newVal;
    },
    editReference(newVal) {
      this.referenceHelper = newVal;
    },
    resetListVariables() {
      this.addingOwner = false;
      this.editTableOwners = -1;
      this.addingName = false;
      this.editTableNames = -1;
    },
    //functions for editing the table "Owners" values
    changeEditTableAlias(item, index) {
      this.editTableAlias = index;
      //this.fields.alias[index].isEdited = true;
      this.helperAlias = item.Alias;
    },
    cancelEditTableAlias() {
      if (this.addingAlias) {
        this.editTableAlias = -1;
        this.addingAlias = false;
        this.fields.alias.pop();
      } else {
        this.editTableAlias = -1;
      }
    },
    saveTableAlias(index) {
      if (this.addingAlias)
        this.fields.alias[index] = { Alias: this.helperAlias, isNew: true };
      else {
        this.fields.alias[index].Alias = this.helperAlias;
        this.fields.alias[index].isEdited = true;
      }
      this.addingAlias = false;
      this.showSave = this.showSave + 1;
      this.editTableAlias = -1;
    },
    addAlias() {
      this.helperAlias = "";
      this.addingAlias = true;
      this.fields.alias.push({ Alias: "", isNew: true });
      this.editTableAlias = this.fields.alias.length - 1;
    },
  },
  computed: {
    getOwnerID() {
      if (this.$route.params.id) {
        return this.$route.params.id;
      } else return localStorage.currentOwnerID;
    },
  },
  watch: {
    fields: {
      handler() {
        this.showSave = this.showSave + 1;
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.scrollAlias {
  height: 277px;
  overflow: auto;
}
.scrollBoats {
  height: 360px;
  overflow: auto;
}
</style>