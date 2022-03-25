<template>
<<<<<<< HEAD
      <v-container fluid>
        <h3>User Management</h3>
        <Breadcrumbs/>
        <v-row>
          <v-col cols="12" class="d-flex">
            <div class="d-flex mb-2">
              <h1 class="mt-auto mb-auto ">{{fields.FirstName}} {{fields.LastName}}</h1>
            </div>
            <v-spacer></v-spacer>
            <!-- buttons for the view state -->
                <v-btn class="black--text mx-1" @click="editMode" v-if="mode == 'view'">
                    <v-icon class="mr-1">mdi-pencil</v-icon>
                    Edit
                </v-btn>
<!-- buttons for the edit state -->
                <v-btn class="black--text mx-1" @click="cancelEdit" v-if="mode == 'edit'">
                    <v-icon>mdi-close</v-icon>
                    Cancel
                </v-btn>
                <v-btn color="success" :disabled="showSave < 1" v-if="mode == 'edit'" @click="saveChanges" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Done
                </v-btn>
          </v-col>
        </v-row>
        
        <v-row>
          <v-col cols="12">
            <v-card  elevation="2">

              <v-card-title>
                General
              </v-card-title>
              <v-container fluid>
                <v-form>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                                v-model="fields.FirstName"
                                label="First Name"
                                required
                                :disabled="!isEditable"
                      ></v-text-field>
                      <v-text-field
                                v-model="fields.LastName"
                                label="Last Name"
                                required
                                :disabled="!isEditable"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                                v-model="fields.Email"
                                label="Email"
                                required
                                :disabled="!isEditable"
                      ></v-text-field>

                      <v-menu
                            ref="menu"
                            v-model="menu"
                            :close-on-content-click="false"
                            :return-value.sync="fields.ExpirationDate"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                            :disabled="!isEditable"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="fields.ExpirationDate"
                                label="Expiration Date"
                                append-icon="mdi-calendar"
                                readonly
                                :disabled="!isEditable"
                                v-bind="attrs"
                                v-on="on"
                            ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="fields.ExpirationDate"
                            no-title
                            scrollable
                            >
                            <v-spacer></v-spacer>
                            <v-btn
                                text
                                color="primary"
                                @click="menu = false"
                            >
                                Cancel
                            </v-btn>
                            <v-btn
                                text
                                color="primary"
                                @click="$refs.menu.save(fields.ExpirationDate)"
                            >
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu>

                    </v-col>
                  </v-row>
                </v-form>
                <v-row>
                  <v-col>
                    <!--
=======
  <div>
    <!-- <v-btn color="secondary" class="float-right mb-0 mt-2 pl-2" to="/admin/users" exact style="height: auto; font-size: .8rem; padding: 6px 10px;"
      ><v-icon class="mr-2" small>mdi-arrow-left</v-icon> Back to User Management</v-btn
    > -->
    <v-breadcrumbs
      :items="[
        { text: 'Adminstration', to: '/admin', exact: true },
        { text: 'User Management', to: '/admin/users', exact: true },
        { text: `${user.FirstName}  ${user.LastName}` },
      ]"
    ></v-breadcrumbs>
    <h1>
      User Editor:
      <small
        >{{ user.FirstName }} {{ user.LastName }}

        <small class="text-error" v-if="user.Status != 'Active'"
          >({{ user.Status }})</small
        >
      </small>
    </h1>

    <hr class="mb-4" />
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="default">
          <v-card-title>User Details</v-card-title>
          <v-card-text>
            <v-form>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.FirstName"
                    label="First name"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.LastName"
                    label="Last name"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="user.Email"
                    label="Email"
                    dense
                    outlined
                    background-color="white"
                    required
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    :return-value.sync="user.ExpirationDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="user.ExpirationDate"
                        label="Expiration date"
                        append-icon="mdi-calendar"
                        dense
                        outlined
                        background-color="white"
                        readonly
                        hide-details
                        v-bind="attrs"
                        v-on="on"
                        clearable
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="user.ExpirationDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="menu = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.menu.save(user.ExpirationDate)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-select
                    label="Roles"
                    :items="roles"
                    outlined
                    multiple
                    small-chips
                    clearable
                    item-value="RoleId"
                    item-text="RoleName"
                    v-model="user.Roles"
                    background-color="white"
                    hide-details
                  ></v-select>
                </v-col>
              </v-row>
            </v-form>
            <v-row>
              <v-col>
                <!--
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
                    <v-btn class="black--text" depressed elevation="0"
                      v-if="isEditable">
                        Reset Password
                    </v-btn>
                    -->
<<<<<<< HEAD
                  </v-col>
                </v-row>
                
                
              </v-container>
            </v-card>
            
          </v-col>
          <!-- this card will be disabled temporarily
          <v-col cols="12">
            <v-card
              elevation="2"
            >
              <v-card-title>
                YHSI
              </v-card-title>
              <v-container fluid>
                 <v-form
                    id="sitesAccess"
                    ref="sForm"
                    v-model="dataAccessValidation"
                  >
                  <v-row v-if="isEditable">
                    <v-col cols="6">
                      <v-select
                        :items="roles"
                        label="Role"
                        v-model="siteRole"
                        :rules="rules"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        :items="availableDataAccess"
                        v-model="siteDataAccess"
                        :rules="rules"
                        label="Data Access"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        color="primary"
                        v-if="isEditable"
                        :disabled="!dataAccessValidation"
                        @click="addSitePermissions()"
                        
                      >
                        Add Row
                      </v-btn>
                    </v-col>
                  </v-row>
                  
                  </v-form>
                  <v-row>
                      <v-col cols="6"
                        v-for="site in sites"
                        :key="`site-${site.id}`"
                        >
                        <v-alert
                        outlined
                        color="primary"
                        
                        >
                          <div class="sub-title">
                                {{site.dataAccess}}
                          </div>
                          <v-row>
                                <v-col>
                                    <v-text-field
                                        v-model="site.dataAccess"
                                        label="Data Access"
                                        :readonly="true"
                                    ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-text-field
                                        v-model="site.role"
                                        label="Role"
                                        :readonly="true"
                                    ></v-text-field>
                                </v-col>
                                <v-btn
                                  class="mx-2"
                                  fab 
                                  dark
                                  x-small
                                  color="primary"
                                  v-if="isEditable"
                                  @click="deleteAccess(site)"
                                >
                                  <v-icon dark>
                                    mdi-close
                                  </v-icon>
                                </v-btn>
                            </v-row>
                        </v-alert>
                      </v-col>
                    </v-row>
              </v-container>
             
            </v-card>
          </v-col>-->
        </v-row>
        
        <v-row>
          <v-col>
            <h3 class="mt-2">Section Acess</h3>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"
            v-for="sec in sections"
            :key="`card-${sec.SectionID}`"
            >
            <v-card
              elevation="2"
            >
            <v-toolbar
                :color="getColor(sec.AccessID)"
                dark
                flat
                >

                <v-card-title class="card-text">
                  <v-icon class="mr-1" color="rgb(0, 0, 0, 0.5)">mdi-{{sec.SectionIcon}}</v-icon> {{sec.SectionName}}
                </v-card-title>

                <v-spacer></v-spacer>

            </v-toolbar>
              
              <v-container fluid>
                 <v-form
                    ref="siteForm"
                    lazy-validation
                  >
                    <v-radio-group
                      v-model="sec.AccessID"
                      row
                    >
                    <v-row>

                        <v-col cols="4">
                          <v-radio
                            label="No Access"
                            :value="1"
                            :readonly="!isEditable"
                          ></v-radio>
                        </v-col>
                        <v-col cols="4">
                          <v-radio
                            label="View"
                            :value="2"
                            :readonly="!isEditable"
                          ></v-radio>
                        </v-col>
                        <v-col cols="4">
                          <v-radio
                            label="Edit"
                            :value="3"
                            :readonly="!isEditable"
                          ></v-radio>
                        </v-col>
                        
                    </v-row>
                    </v-radio-group>
                  </v-form>
              </v-container>  
            </v-card>
          </v-col>
        </v-row>
        <v-overlay :value="overlay">
            <v-progress-circular
                indeterminate
                size="64"
            ></v-progress-circular>
        </v-overlay>
      </v-container>
</template>

<script>
import Breadcrumbs from "../../../Breadcrumbs";
import users from "../../../../controllers/user";
export default {
  name: "edituser",
  components: {
    Breadcrumbs
  },
  data: () => ({
    username: 'username',
    overlay: false,
    items: null,
    selectedItem: null,
    mode: null,
    dialog: false, //tells the print dialog when to show itself
    siteDataAccess: "",
    siteRole: "",
    /* VALIDATION*/
    dataAccessValidation: false,
    rules: [
        value => !!value || 'Required.',
      ],
    /* FIELDS*/
    fields:{
=======
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="d-flex py-0">
                <v-spacer></v-spacer>
                <v-btn color="primary" class="mr-5 mt-0" @click="doSave">
                  Save user
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="default">
          <v-card-title>Site Access</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="[
                { text: 'Access type', value: 'AccessTypeDescription' },
                { text: 'Value', value: 'AccessTextDescription' },
              ]"
              :items="user.SiteAccess"
              hide-default-footer
              @click:row="openAccess"
              class="clickable-row"
            ></v-data-table>

            <v-row>
              <v-col cols="12" class="d-flex pt-5 mb">
                <v-spacer></v-spacer>
                <v-btn color="info mb-1" @click="addAccess"
                  >Add site access</v-btn
                >
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>

    <v-dialog v-model="showAccessDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>Add site access</v-card-title>
        <v-card-text class="pt-5">
          <v-select
            dense
            outlined
            background-color="white"
            label="Access type"
            v-model="accessItem.AccessType"
            :items="accessOptions"
            @change="accessItem.AccessText = ''"
          ></v-select>

          <v-text-field
            v-model="accessItem.AccessText"
            dense
            outlined
            background-color="white"
            label="Map sheet"
            v-if="accessItem.AccessType == 1"
          ></v-text-field>
          <v-select
            v-model="accessItem.AccessText"
            :items="communities"
            item-text="name"
            item-value="id"
            dense
            outlined
            background-color="white"
            label="Community"
            v-if="accessItem.AccessType == 2"
          ></v-select>
          <v-select
            v-model="accessItem.AccessText"
            :items="firstNations"
            item-text="description"
            item-value="id"
            dense
            outlined
            background-color="white"
            label="First Nation"
            v-if="accessItem.AccessType == 3"
          ></v-select>

          <div class="d-flex">
            <v-btn
              @click="showAccessDialog = false"
              color="secondary"
              class="my-0"
              >Cancel</v-btn
            >
            <v-spacer></v-spacer>
            <v-btn
              @click="removeAccess"
              color="error"
              class="my-0 mr-3"
              v-if="accessItem.Id"
              >Remove</v-btn
            >
            <v-btn
              @click="saveAccess"
              color="primary"
              class="my-0"
              :disabled="canSaveAccess"
              >Save</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    overlay: false,
    accessOptions: [
      { text: "Map sheet", value: 1 },
      { text: "Community", value: 2 },
      { text: "First Nation", value: 3 },
    ],
    accessItem: { AccessType: 1, AccessText: 1 },
    /* VALIDATION*/
    dataAccessValidation: false,
    menu: null,

    rules: [(value) => !!value || "Required."],

    user: {
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
      FirstName: "",
      LastName: "",
      Email: "",
      ExpirationDate: null,
<<<<<<< HEAD
    },
    fieldsHistory: null,
    sections: [],
    sites: [   
        {
          id: 1,
          role: "test",
          dataAccess: "Kluane"
        }
      ],
    dataAccessOptions: ["All Sites", "Kluane", "Nacho Nyak Dun", "Vuntut Gwitchin", "White River", 
          "City of Whitehorse", "Dawson City","105D","105E","117i"],
    roles: ["Site Admin", "Editor", "Viewer", "Viewer Limited"],
    menu: false,
    showSave: 0
  }),
  mounted(){
      if(this.checkPath("edit")){
          this.mode= "edit";
          //after this, the fields get filled with the info obtained from the api
          this.getDataFromApi();
      }
      else if(this.checkPath("view")){
          this.mode="view";
          //after this, the fields get filled with the info obtained from the api
          this.getDataFromApi();
      }
  },
  methods: {
    /*this function checks if the current path contains a specific word, this can be done with a simple includes but 
    //it causes confusion when a boat or owner has 'new' in its name, leading the component to think it should use the 'new' mode,
    this problem is solved by using this funtion.*/
    checkPath(word){
        let path = this.$route.path.split("/");
        if(path[3] == word){
            return true;
        }
        return false;
    },
    resetValidation() {
        this.$refs.sForm.reset();
      },
    deleteAccess(site){
      let index = this.sites.findIndex(x => x == site);
      if (index > -1) {
        this.sites.splice(index, 1);
      }
    },
    saveCurrentUser(){
        localStorage.currentUserID = this.$route.params.id;
    },
    addSitePermissions(){
      if(this.siteDataAccess == "" || this.siteRole == ""){
        return;
      }
      this.sites.push({
        id: this.sites.length +1,
        role: this.siteRole,
        dataAccess: this.siteDataAccess
      });
      this.resetValidation();

      
    },
    async getDataFromApi(){
        this.overlay = true;
        if(this.$route.params.id){
            this.saveCurrentUser();
        }
        let baseSections = await users.getSections();
        this.fields = await users.getById(localStorage.currentUserID);
        this.fields.ExpirationDate = this.fields.ExpirationDate ? this.fields.ExpirationDate.substr(0, 10): ""; 
        let access = await users.getAccess(localStorage.currentUserID);
        this.sections = baseSections.map((x)=>{
          let accessSection = access.filter(acc => acc.SectionID == x.SectionID).pop();
          if(accessSection){
            x.AccessID = accessSection.AccessID;
            x.UAID = accessSection.UAID;
          }
          else{
            x.AccessID = 1;
          }
          return x;
        });
        this.overlay = false;
    },
    getColor(access){
      if(!access || access == 1)
        return 'grey lighten-2';
      if(access == 3)
        return 'lime lighten-3';
      if(access == 2)
        return 'amber lighten-3';
    },
    showDialog(){
      this.dialog =  true;
    },
    closeDialog(){
      this.dialog = false;
    },
    viewMode(){
        this.mode="view";
        this.$router.push(`/admin/users/view/${this.$route.params.id}`);
    },
    editMode(){
        this.fieldsHistory = {...this.fields};
        this.mode="edit";
        this.$router.push(`/admin/users/edit/${this.$route.params.id}`);
        this.showSave = 0;
    },
    cancelEdit(){
        if(this.fieldsHistory){
            this.fields = {...this.fieldsHistory};
        }
        this.mode="view";
        //this.resetListVariables();
        this.$router.push(`/admin/users/view/${this.$route.params.id}`);
    },
    async saveChanges(){
            this.overlay = true; 
            let access = this.sections.map((x) =>{
              delete x.SectionName;
              delete x.SectionIcon;
              x.UserID = parseInt(localStorage.currentUserID);
              return x;
            })
            const accessData = {
              access
            };
            const {
              FirstName,
              LastName,
              Email,
              ExpirationDate
            } = this.fields;
            const data = {
              user: {
                FirstName,
                LastName,
                Email
              },
              expirationDate: ExpirationDate
            }

            await users.put(localStorage.currentUserID, data);
            await users.putAccess(localStorage.currentUserID, accessData);
            this.overlay = false;   
            this.$router.push({name: 'AdminUserGrid'});   
            //this.$router.go(); 
            
            
        },
    save (date) {
      this.$refs.menu.save(date);
    },
    formatDate (date) {
        if (!date) return null
        //date = date.substr(0, 10);
        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
    },
  },
  computed: {
    isEditable(){
      return this.mode == 'edit' ? true : false;
    },
    param() {
        return this.$route.params.id;
    },
    serviceEnd(){
        return this.formatDate(this.fields.ServiceEnd);
    },
    availableDataAccess(){
      return this.dataAccessOptions.filter(x => !this.sites.some(item => item.dataAccess === x));
    }
  },
  watch: {
    fields: {
        handler(){
            this.showSave = this.showSave+1;
        },
        deep: true
    },
    sections: {
      handler(){
            this.showSave = this.showSave+1;
        },
        deep: true
    }
  }
}
</script>


<style scoped>
.list-menu{
  padding: 0px 8px 0px 0px;
}
.card-text{
    color: #000; /* Fallback for older browsers */
    color: rgba(0, 0, 0, 0.5);
}
</style>
=======
      Roles: [],
    },

    showAccessDialog: false,
  }),
  async mounted() {
    this.loadRoles();
    this.loadFirstNations();
    this.loadCommunities();
    this.user = await this.loadUser(this.$route.params.id);
  },
  computed: {
    ...mapGetters("users", ["roles", "communities", "firstNations"]),
    canSaveAccess: function () {
      if (this.accessItem.AccessText) return false;
      return true;
    },
  },
  watch: {},
  methods: {
    ...mapActions("users", [
      "loadUser",
      "loadRoles",
      "loadFirstNations",
      "loadCommunities",
      "updateUser",
      "saveUserAccess",
      "removeUserAccess",
    ]),
    async doSave() {
      await this.updateUser(this.user);
      this.user = await this.loadUser(this.$route.params.id);
    },
    addAccess() {
      this.accessItem = {
        AccessType: 1,
        AccessText: "",
        UserId: this.user.UserId,
      };
      this.showAccessDialog = true;
    },
    async saveAccess() {
      await this.saveUserAccess(this.accessItem);
      this.user = await this.loadUser(this.$route.params.id);
      this.showAccessDialog = false;
    },
    openAccess(item) {
      if (item.AccessType != 1) item.AccessText = parseInt(item.AccessText);

      this.accessItem = item;
      this.showAccessDialog = true;
    },
    async removeAccess() {
      await this.removeUserAccess(this.accessItem);
      this.user = await this.loadUser(this.$route.params.id);
      this.showAccessDialog = false;
    },
  },
};
</script>
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
