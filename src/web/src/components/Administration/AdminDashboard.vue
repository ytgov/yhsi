<template>
    <v-container>
        <h1>Administration</h1>
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
                        <v-list class="pb-0">
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
export default {
    data: () =>({
        icon: null,
        usermodel: null,
        tablemodel: null,
        items: [
        {
          icon: 'mdi-inbox',
          text: 'Photo Owner',
          url: ""
        },
        {
          icon: 'mdi-star',
          text: 'Community',
          url: ""
        },
        {
          icon: 'mdi-send',
          text: 'Contributing Resources',
          url: ""
        },
        {
          icon: 'mdi-email-open',
          text: 'Vessel Type',
          url: ""
        },
      ],
      model: 1,
    }),
    methods:{
        goTo(url){
            this.$router.push(url);
        }
    }
}
</script>