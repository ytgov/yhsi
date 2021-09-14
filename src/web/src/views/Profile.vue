<template>
  <div>
    <h1>My Profile</h1>
    <p>** This information is all read-only</p>

    <div class="row">
      <div class="col-md-6 mb-3">
        <v-text-field
          v-model="firstName"
          dense
          outlined
          label="First name"
          readonly
          hide-details
        ></v-text-field>
      </div>
      <div class="col-md-6 mb-3">
        <v-text-field
          v-model="lastName"
          dense
          outlined
          label="Last name"
          readonly
          hide-details
        ></v-text-field>
      </div>

      <div class="col-md-6 mb-3">
        <v-text-field
          v-model="email"
          outlined
          dense
          label="Email"
          readonly
          hide-details
        ></v-text-field>
      </div>
      <div class="col-md-6">
        <v-text-field
          v-model="username"
          outlined
          dense
          label="Username"
          readonly
          hide-details
        ></v-text-field>
      </div>

      <div class="col-md-6">
        <h2>Roles</h2>
        <ul>
          <li v-for="item of roles" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <h2>Access</h2>
        <ul>
          <li v-for="item of access" :key="item.id">
            ({{ item.level }}) {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import store from "../store";

export default {
  name: "Profile",
  computed: {
    ...mapState("profile", [
      "firstName",
      "lastName",
      "username",
      "email",
      "roles",
      "access",
    ]),
  },
  data: () => ({}),
  async created() {
    await store.dispatch("profile/loadProfile");
  },
};
</script>
