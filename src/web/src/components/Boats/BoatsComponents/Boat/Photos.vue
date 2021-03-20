<template>
    <v-card>
        <v-carousel
            id="carousell"
            cycle
            height="400"
            hide-delimiter-background
        >
            <v-carousel-item
            v-for="(item,i) in photos"
            :key="i"
            :src="item.src"
            ></v-carousel-item>
        </v-carousel>
        <v-row>
            <v-col cols="12" class="d-flex">
                <v-dialog
                v-model="dialog1"
                max-width="600"
                scrollable
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="success"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        class="ml-3"
                        >
                        Add Photo
                        </v-btn>
                    </template>

                    <v-card>
                        <v-tabs
                        color="primary"
                        >
                        <v-tab>Add Photo</v-tab>
                        <v-tab>Search Photo Library</v-tab>
                            <v-tab-item>
                                <v-divider></v-divider>
                                <v-container>
                                    <v-row >
                                        <v-col cols="12">
                                            <v-row>
                                                <v-col cols="12" class="d-flex my-0 py-0">
                                                <v-spacer></v-spacer>
                                                <v-checkbox
                                                    class="align-self-end"
                                                    label="Private"
                                                    v-model="fields.private"
                                                ></v-checkbox>
                                            </v-col>
                                            </v-row>       
                                            
                                            <v-text-field
                                                v-model="fields.featureName"
                                                label="Feature Name">
                                            </v-text-field>
                                            <v-combobox
                                                v-model="fields.owner"
                                                label="Owner">   
                                            </v-combobox>
                                            <v-combobox
                                                v-model="fields.community"
                                                label="Community">   
                                            </v-combobox>
                                            <v-combobox
                                                v-model="fields.copyright"
                                                label="Copyright">
                                            </v-combobox>
                                            <v-combobox
                                                v-model="fields.usageRights"
                                                label="Usage Rights">   
                                            </v-combobox>   
                                            <v-textarea
                                                v-model="fields.caption"
                                                dense
                                                label="Caption"
                                                rows="2">
                                            </v-textarea>
                                            <v-textarea
                                                v-model="fields.comments"
                                                dense
                                                label="Comments"
                                                rows="2">
                                            </v-textarea>
                                            <v-textarea
                                                v-model="fields.creditLine"
                                                dense
                                                label="Credit Line"
                                                rows="2">
                                            </v-textarea>

                                            <v-file-input
                                            label="Choose photo for upload"
                                            prepend-icon="mdi-camera"
                                            ></v-file-input>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
                                    <v-row>
                                        <v-col cols="12" class="d-flex">
                                            <v-btn
                                                text
                                                class="ma-1"
                                                @click="dialog1 = false"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-spacer></v-spacer>
                                            <v-btn
                                                color="primary darken-1"
                                                text
                                                class="ma-1"
                                                @click="savePhoto"
                                            >
                                                Save 
                                            </v-btn>    
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-tab-item>
                            <v-tab-item>
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
                                    <v-row class="pr-0">
                                        <v-col
                                        v-for="(item,i) in filteredPhotos"
                                        :key="`ph-${i}`"
                                        class="d-flex child-flex"
                                        cols="4"
                                        >
                                        <v-card
                                        outlined
                                        @click="selectImage(item)"
                                        hover
                                        >
                                            <v-img
                                                :src="item.photo"
                                                :lazy-src="item.photo"
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
                                                    <v-card-text>{{item.name}}</v-card-text>
                                                    <v-checkbox
                                                    readonly
                                                    v-model="item.selected"
                                                    ></v-checkbox>
                                                </v-col>
                                            </v-row>     
                                        </v-card>
                                        </v-col>
                                    </v-row>                   
                                </v-container>
                                <v-divider  class=""></v-divider>
                                <v-row class="">
                                    <v-col cols="12" class="d-flex">
                                        <v-btn
                                            text
                                            class="ma-1"
                                            @click="dialog1 = false"
                                        >
                                            Cancel
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn
                                            color="primary darken-1"
                                            text
                                            class="ma-1"
                                            @click="saveAndLink"
                                        >
                                            Save and Link
                                        </v-btn>    
                                    </v-col>
                                </v-row>
                            </v-tab-item>
                        </v-tabs>
                    </v-card>
                </v-dialog>

                <v-spacer></v-spacer>
                
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
                                                :src="item.photo"
                                                :lazy-src="item.photo"
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
                                                    <v-card-text>{{item.name}}</v-card-text>
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
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import boats from "../../../../controllers/boats";
export default {
    name: "photos",
    props: ["photos"],
    data: ()=>({
        searchPhotos: "",
        dialog1: false,
        dialog2: false,
        fields: {
            private: false,
            featureName: "",
            owner: "",
            community: "",
            copyright: "",
            usageRights: "",
            caption: "",
            comments: "",
            creditLine: "",
            photo: null,
        },
        photos1: [],
    }),
    created(){
        this.getDataFromAPI();
        this.photos1= [
            { selected: false, name: "photo-1", photo: "https://picsum.photos/500/300?image=1",},
            { selected: false, name: "photo-2", photo: "https://picsum.photos/500/300?image=2",},
            { selected: false, name: "photo-3", photo: "https://picsum.photos/500/300?image=3",},
            { selected: false, name: "photo-4", photo: "https://picsum.photos/500/300?image=4",},
            { selected: false, name: "photo-5", photo: "https://picsum.photos/500/300?image=5",},
            { selected: false, name: "photo-6", photo: "https://picsum.photos/500/300?image=6",},
            { selected: false, name: "photo-7", photo: "https://picsum.photos/500/300?image=7",},
            { selected: false, name: "photo-8", photo: "https://picsum.photos/500/300?image=8",},
            { selected: false, name: "photo-6", photo: "https://picsum.photos/500/300?image=6",},
            { selected: false, name: "photo-7", photo: "https://picsum.photos/500/300?image=7",},
            { selected: false, name: "photo-8", photo: "https://picsum.photos/500/300?image=8",},
        ];
    },
    methods: {
        async getDataFromAPI(){
            await boats.get();
        },
        selectImage(item){
            let index = this.photos1.indexOf(item);
            if(index >-1){
                this.photos1[index].selected =  !this.photos1[index].selected;
            }
        },
        savePhoto(){
            //makes axios request to save the data
            //boats.post();
        },
        saveAndLink(){
            //makes axios request to save the data
            //boats.post();
        }
    },
    computed: {
        filteredPhotos(){
            return this.photos1.filter(a => a.name.includes(this.searchPhotos));
        }
    }
}
</script>


<style scoped>
.scroll{
    height: 720px;
    overflow: auto;
}
</style>