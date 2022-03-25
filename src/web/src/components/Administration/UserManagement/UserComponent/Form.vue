<template>
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
                    <v-btn class="black--text" depressed elevation="0"
                      v-if="isEditable">
                        Reset Password
                    </v-btn>
                    -->
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
      FirstName: "",
      LastName: "",
      Email: "",
      ExpirationDate: null,
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
