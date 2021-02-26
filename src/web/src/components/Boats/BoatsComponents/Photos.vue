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
                <v-btn color="success" class="ml-3" @click="showDialog">Add Photo</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="success" class="mr-3">View all Photos</v-btn>
            </v-col>
        </v-row>
        <v-dialog
        v-model="dialog"
        max-width="600"
        scrollable
        @click:outside="closeDialog"
        >
            <v-card>
                <v-tabs
                color="deep-purple accent-4"
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
                                        ></v-checkbox>
                                    </v-col>
                                    </v-row>       
                                    
                                    <v-text-field
                                        
                                        label="Feature Name">
                                    </v-text-field>
                                    <v-combobox
                                        
                                        label="Owner">   
                                    </v-combobox>
                                    <v-combobox
                                        
                                        label="Community">   
                                    </v-combobox>
                                    <v-combobox
                                        
                                        label="Copyright">
                                    <v-combobox
                                        
                                        label="Usage Rights">   
                                    </v-combobox>   
                                    </v-combobox>
                                    <v-textarea
                                        dense
                                        label="Caption"
                                        rows="3">
                                    </v-textarea>
                                    <v-textarea
                                        dense
                                        label="Comments"
                                        rows="3">
                                    </v-textarea>
                                    <v-textarea
                                        dense
                                        label="Credit Line"
                                        rows="3">
                                    </v-textarea>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row>
                                <v-col cols="12" class="d-flex">
                                    <v-btn
                                        text
                                        class="ma-1"
                                        @click="closeDialog"
                                    >
                                        Cancel
                                    </v-btn>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                        color="primary darken-1"
                                        text
                                        class="ma-1"
                                    >
                                        Save 
                                    </v-btn>    
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-tab-item>
                </v-tabs>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
export default {
    name: "photos",
    props: ["photos", "dialog"],
    data: ()=>({

    }),
    methods: {
        closeDialog(){
            this.$emit('closeDialog');
        },
        showDialog(){
            this.$emit('showDialog');
        },
    }
    
}
</script>
