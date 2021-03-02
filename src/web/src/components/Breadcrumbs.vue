<template>
     <v-row>
        <v-col cols="12" class="d-flex">
            <div v-for="(item,i) in items" :key="`rl-${i}`">
                <router-link  :to="item.to">
                    {{item.text}} 
                </router-link>
                <v-icon v-if="i+1 < items.length">mdi-chevron-right</v-icon>
            </div>  
        </v-col>
    </v-row>   

</template>

<script>
export default {
    name: "breadcrumbs",
    data: () => ({
        items: []
    }),
    created(){
        let items = this.$route.path.split("/");
        items = items.filter(x => x != "");
        for(let i = 0; i < items.length; i++){
            this.items.push({text: items[i].replace("%20"," "), to: {path: "/"+items.slice(0,i+1).join("/")}, disabled: false });
        }
    },
    watch:{
        $route (to, from){
            console.log(to,from);
            this.items = []; 
            let items = this.$route.path.split("/");
            items = items.filter(x => x != "");
            for(let i = 0; i < items.length; i++){
                this.items.push({text: items[i].replace("%20"," "), to: {path: "/"+items.slice(0,i+1).join("/")}, disabled: false });
            }
        }
    } 
}
</script>