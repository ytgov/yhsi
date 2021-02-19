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
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="d-flex mb-2">
              <v-icon>mdi-account</v-icon>
              <h2 class="mb-0 ml-3">Edit User {{username}}</h2>
            </div>
          </v-col>
        </v-row>
        <v-divider inset class="mb-2"></v-divider>
        <v-row>
          <v-col cols="6">
            
            <v-text-field
                      v-model="fields.name"
                      label="Name"
                      required
            ></v-text-field>

            <v-text-field
                      v-model="fields.email"
                      label="Email"
                      required
            ></v-text-field>

            <v-combobox
                    v-model="fields.roles"
                    label="Roles"
            ></v-combobox>

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
                    label="Recognition Date"
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

            <v-btn color="success">Save Changes</v-btn>

          </v-col>
          <v-col cols="6">
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
    dialog: false, //tells the print dialog when to show itself
    fields:{
      name: "",
      email: "",
      roles: "",
      date: null
    },
    menu: false,
  }),
  created(){
  },
  methods: {
    goBack(){
      this.$router.push('/users');
    },
    showDialog(){
      this.dialog =  true;
    },
    closeDialog(){
      this.dialog = false;
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

</style>