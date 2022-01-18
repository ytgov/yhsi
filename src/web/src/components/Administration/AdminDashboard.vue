<template>
    <v-container>
        <h1>Administration</h1>
        <Breadcrumbs/>
        <v-row>
            <v-col
                cols="6"
                >
                    <v-card
                    elevation="1">
                        <v-toolbar
                            color="grey"
                            dark
                            flat
                            >

                            <v-toolbar-title>Administration</v-toolbar-title>

                            <v-spacer></v-spacer>

                        </v-toolbar>
                        <v-list class="pb-0 pt-0">
                            <v-list-item-group v-model="usermodel">
                                <v-list-item @click="goTo('/admin/users')">
                                <v-list-item-icon>
                                    <v-icon v-text="'mdi-account-group'"></v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title >User Management</v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    </v-card>
                </v-col>
             <v-col
                cols="6"
                >
                    <v-card
                    elevation="1">
                         <v-toolbar
                            color="grey"
                            dark
                            flat
                            >

                            <v-toolbar-title>Look-up Table Managment</v-toolbar-title>

                            <v-spacer></v-spacer>

                        </v-toolbar>
                        <v-list class="pb-0 pt-0">
                        <v-list-item-group v-model="tablemodel" >
                            <v-list-item
                            v-for="(item, i) in items"
                            :key="i"
                            @click="goTo(item.url)"
                            >
                            <v-list-item-icon>
                                <v-icon v-text="item.icon"></v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title v-text="item.text"></v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                        </v-list>
                    </v-card>
                </v-col>
        </v-row>
        
    </v-container>
</template>

<script>
import Breadcrumbs from "../Breadcrumbs";
export default {
    components: {
        Breadcrumbs
    },
    data: () =>({
        icon: null,
        usermodel: null,
        tablemodel: null,
        items: [
        {
          icon: 'mdi-ferry',
          text: 'Boats - Vessel Type',
          url: "/admin/vessel_type"
        },
        {
          icon: 'mdi-wrench',
          text: 'Burials - Occupations',
          url: "/admin/burials/occupations"
        },
        {
          icon: 'mdi-wallet-membership',
          text: 'Burials - Memberships',
          url: "/admin/burials/memberships"
        },
        {
          icon: 'mdi-database',
          text: 'Burials - Cementeries',
          url: "/admin/burials/cementeries"
        },
        {
          icon: 'mdi-shape',
          text: 'Burials - Religions',
          url: "/admin/burials/religions"
        },
        {
          icon: 'mdi-bug',
          text: 'Burials - Causes',
          url: "/admin/burials/causes"
        },
        {
          icon: 'mdi-camera',
          text: 'Photos - Owner',
          url: ""
        },
        {
          icon: 'mdi-map-marker-multiple',
          text: 'Community',
          url: ""
        },
        {
          icon: 'mdi-run',
          text: 'Contributing Resources',
          url: ""
        },
        {
          icon: 'mdi-map',
          text: 'Place Type',
          url: "/admin/placetype"
        },
        
      ],
      model: 1,
    }),
    methods:{
        goTo(url){
            if(url == "")
                return;
            this.$router.push(url);
        }
    }
}
</script>