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
    label="Search Photo" 
    :items="data"
    item-text="name"
    return-object
    >
    <template v-slot:item="{ item }">
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
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
    }),
    methods:{

    },
    watch:{
        search(val){
            if(this.$router.history.current.path != `/photos/${val.id}/feature`)
                this.$router.push(`/photos/${val.id}/feature`);
        }
    }
}
</script>