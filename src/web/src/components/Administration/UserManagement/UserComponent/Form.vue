<template>
 <div>
   <v-app-bar
      color="primary"
      dark
      flat    
    >
      <v-btn color="primary" @click="goBack()">
        <v-icon>mdi-arrow-left-drop-circle</v-icon>
        <div class="ml-2">
           Back to Users
        </div>
      </v-btn>
      <v-spacer></v-spacer>
    </v-app-bar>
    <div>
      <v-container fluid>
        <v-row>
          <v-col cols="12" class="d-flex">
            <div class="d-flex mb-2">
              <v-icon>mdi-account</v-icon>
              <h2 class="mt-auto mb-auto ml-3">Edit User {{username}}</h2>
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
        <v-divider inset class="mb-4"></v-divider>
        
        <v-row>
          <v-col cols="6">
            <v-card  elevation="2">
              <v-card-title>
                General
              </v-card-title>
              <v-container fluid>
                <v-text-field
                          v-model="fields.name"
                          label="First Name"
                          required
                ></v-text-field>
                <v-text-field
                          v-model="fields.lastname"
                          label="Last Name"
                          required
                ></v-text-field>
                <v-text-field
                          v-model="fields.email"
                          label="Email"
                          required
                ></v-text-field>

                <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        v-model="fields.date"
                        label="Expiration Date"
                        append-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                    </template>
                    <v-date-picker
                    ref="picker"
                    v-model="fields.date"
                    :max="new Date().toISOString().substr(0, 10)"
                    min="1950-01-01"
                    @change="save"
                    ></v-date-picker>
                </v-menu>

                <v-btn class="black--text" depressed elevation="1">
                    Reset Password
                </v-btn>
              </v-container>
            </v-card>
            
          </v-col>
          <v-col cols="6">
            <v-card
              elevation="2"
            >
              <v-card-title>
                YHSI
              </v-card-title>
              <v-container fluid>
                 <v-form
                    ref="form"
                    lazy-validation
                  >

                    <v-select
                      :items="roles"
                      label="Role"
                    ></v-select>

                    <v-select
                      :items="dataAccessOptions"
                      label="Data Access"
                    ></v-select>

                    <v-btn
                      color="primary"
                    >
                      Add Row
                    </v-btn>
                  </v-form>
              </v-container>
             
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4"
            v-for="sec in sections"
            :key="`card-${sec.id}`"
            >
            <v-card
              elevation="2"
            >
            <v-toolbar
                :color="getColor(sec.access)"
                dark
                flat
                >

                <v-card-title class="card-text">
                  <v-icon class="mr-1" color="rgb(0, 0, 0, 0.5)">mdi-{{sec.icon}}</v-icon> {{sec.title}}
                </v-card-title>

                <v-spacer></v-spacer>

            </v-toolbar>
              
              <v-container fluid>
                 <v-form
                    ref="form"
                    lazy-validation
                  >
                    <v-row>
                      <v-col cols="4">
                        <v-checkbox
                          label="No Access"
                          value="No Access"
                          v-model="sec.access"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4">
                        <v-checkbox
                          label="View"
                          value="View"
                          v-model="sec.access"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="4">
                        <v-checkbox
                          label="Edit"
                          value="Edit"
                          v-model="sec.access"
                        ></v-checkbox>
                      </v-col>
                    </v-row>
                  </v-form>
              </v-container>  
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "edituser",
  components: {
    
  },
  data: () => ({
    username: 'username',
    items: null,
    selectedItem: null,
    mode: null,
    dialog: false, //tells the print dialog when to show itself
    fields:{
      name: "",
      lastname: "",
      email: "",
      roles: "",
      date: null
    },
    fieldsHistory: null,
    sections: [
      { id: 1, access: null, title: "Photos", icon:"camera" },
      { id: 2, access: null, title: "Airplane Crash", icon:"airplane-landing" },
      { id: 3, access: null, title: "Places", icon:"routes" },
      { id: 4, access: null, title: "Boats", icon:"ferry" },
      { id: 5, access: null, title: "People", icon:"human-male-female" },
      { id: 6, access: null, title: "Interpretive Signs", icon:"image" },
      { id: 7, access: null, title: "Burials", icon:"grave-stone"},
      { id: 8, access: null, title: "Map", icon:"buffer" },
      { id: 9, access: null, title: "Administration", icon:"cube" },
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
          //this.getDataFromApi();
      }
      else if(this.checkPath("view")){
          this.mode="view";
          //after this, the fields get filled with the info obtained from the api
          //this.getDataFromApi();
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
    goBack(){
      this.$router.push('/admin/users');
    },
    getColor(access){
      if(!access || access == 'No Access')
        return 'grey lighten-2';

      if(access == 'Edit')
        return 'lime lighten-3';

      if(access == 'View')
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
        this.$router.push(`/admin/users/view/${this.fields.Name}`);
    },
    editMode(){
        this.fieldsHistory = {...this.fields};
        this.mode="edit";
        this.$router.push(`/admin/users/edit/${this.fields.Name}`);
        this.showSave = 0;
    },
    save (date) {
      this.$refs.menu.save(date);
    },
  },
  computed: {
    param() {
        return this.$route.params.id;
    }
  },
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