<template>
    <v-dialog
    v-model="dialog2"
    width="500"
    >
    <template v-slot:activator="{ on, attrs }">
        <v-btn
        color="success"
        dark
        v-bind="attrs"
        v-on="on"
        class="mr-3"
        >
        <v-icon class="mr-1">mdi-view-grid</v-icon>
        View all Photos
        </v-btn>
    </template>
        <v-card>
            <v-card-title class=" ">
                All Photos
            </v-card-title>
            <v-divider></v-divider>
            <v-container class="scroll">
                        <v-row>
                            <v-col>
                                <v-text-field
                                v-model="searchPhotos"
                                label="Search">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="photos.length < 1">
                            <v-col cols="12">
                                <v-alert
                                dense
                                prominent
                                border="top"
                                type="info"
                                text
                                >
                                Search the photo library by <strong>Community, Address, Place, Feature or File Name</strong>, then press enter to start the search.
                                </v-alert>
                            </v-col>
                        </v-row>
                        <v-row class="pr-0">

                            <v-col
                            v-for="(item,i) in filteredPhotos"
                            :key="`ph-${i}`"
                            class="d-flex child-flex"
                            cols="4"
                            >
                            <v-card
                            outlined
                            hover
                            >
                                <v-img
                                    :src="item.File.base64"
                                    :lazy-src="item.File.base64"
                                    aspect-ratio="1"
                                    class="grey lighten-2"
                                >
                                    <template v-slot:placeholder>
                                    <v-row
                                        class="fill-height ma-0"
                                        align="center"
                                        justify="center"
                                    >
                                        <v-progress-circular
                                        indeterminate
                                        color="grey lighten-5"
                                        ></v-progress-circular>
                                    </v-row>
                                    </template>
                                </v-img>
                                <v-row>
                                    <v-col cols="12" class="d-flex">
                                        <v-card-text v-if="item.Caption" class="text-truncate text-caption">
                                            {{item.Caption}} 
                                        </v-card-text>
                                        <v-card-text v-else class="text-caption">
                                            No caption 
                                        </v-card-text>
                                        
                                    </v-col>
                                </v-row>     
                            </v-card>
                            </v-col>

                        </v-row>                   
                    </v-container>
            
            <v-divider></v-divider>

            <v-card-actions>
            <v-btn
                color="primary"
                text
                @click="dialog2 = false"
            >
                Close
            </v-btn>
            <v-spacer></v-spacer>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ["photos"],
    data: ()=>({
        dialog2: false,
        searchPhotos: null
    }),
    methods:{

    },
    computed:{
        filteredPhotos(){
            if(!this.photos)
                return [];

            if(this.photos.length > 0 && this.searchPhotos )
                return this.photos.filter(a => a.FeatureName ? a.FeatureName.toLowerCase().includes(this.searchPhotos.toLowerCase()) : false);
            else    
                return this.photos;
                
            
        }
    }
}
</script>