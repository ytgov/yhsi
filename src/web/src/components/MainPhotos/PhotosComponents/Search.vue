<template>

<div>
    <v-autocomplete 
    dense
    filled
    solo-inverted
    flat
    append-icon="mdi-magnify"
    class="mx-4"
    hide-details
    color="white"
    v-model="search" 
    label="Search photos" 
    :items="dataSorted"
    item-text="featureName"
    return-object
    >
    <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.featureName"></v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon></v-icon>
        </v-list-item-action>
      </template>
    </v-autocomplete>
</div>
</template>

<script>
export default {
    name: 'search',
    props: [ 'data' ],
    data: ()=> ({
        search: null,
        loading: false,
        dataSorted: [],
    }),
    methods: {
      sortData() {
        if(this.dataSorted.length > 0) {
        this.dataSorted = this.data.slice()
          .sort((a, b) => (a.featureName.toLowerCase() > b.featureName.toLowerCase() ? 1 : b.featureName.toLowerCase() > a.featureName.toLowerCase() ? -1 : 0)
          );
        };
      }
    },
    watch:{
        search(val){
            if(this.$router.history.current.path != `/photos/${val.id}/feature`)
                this.$router.push(`/photos/${val.id}/feature`);
        },
        data: {
          handler() {
            this.sortData();
          },
          deep: true,
        },
    },
    mounted() {
      this.sortData();
    },
}
</script>