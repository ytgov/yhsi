<template>
    <v-card>
        <div v-if="showDefault"
            class="center-children"
            style="height: 400px;"
            
        >

            <v-img 
            height="200"
            width="200"
            :src="require('../../../../assets/add_photo.png')"
            :lazy-src="require('../../../../assets/add_photo.png')"
            ></v-img>
        </div>
        <v-carousel v-else
            id="carousell"
            cycle
            height="400"
            hide-delimiter-background
        >
            <v-carousel-item 
            v-for="(item,i) in photos"
            :key="i"
            :src="item.File.base64"
            :lazy-src="item.File.base64"
            ></v-carousel-item>
        </v-carousel>
        <v-divider></v-divider>
        <v-row v-if="showDefault">
            <v-col cols="12">
                <p class="text-center font-weight-bold pt-3">Once you upload your new boat data, you will be able to attach photos</p>
            </v-col>
        </v-row>
        <v-row v-else>
            <v-col cols="12" class="d-flex">
                <v-dialog
                v-model="dialog1"
                max-width="600"
                scrollable
                @click:outside="reset()"
                >
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                        color="success"
                        dark
                        v-bind="attrs"
                        v-on="on"
                        class="ml-3"
                        >
                        <v-icon class="mr-1">mdi-plus</v-icon>
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
                                    <v-form 
                                        ref="photoForm"
                                        :lazy-validation="false"
                                        v-model="valid">
                                        <v-row >
                                            <v-col cols="12">
                                                    <v-row>
                                                        <v-col cols="12" class="d-flex my-0 py-0">
                                                        <v-spacer></v-spacer>
                                                        <v-checkbox
                                                            class="align-self-end"
                                                            label="Private"
                                                            v-model="fields.Private"
                                                        ></v-checkbox>
                                                    </v-col>
                                                    </v-row>       
                                                    
                                                    <v-text-field
                                                        v-model="fields.FeatureName"
                                                        label="Feature Name"
                                                        :rules="generalRules">
                                                        
                                                    </v-text-field>

                                                    <v-autocomplete
                                                        @click="getOwners"
                                                        v-model="fields.OwnerId"
                                                        :items="owners"
                                                        :loading="isLoadingOwner"
                                                        clearable
                                                        label="Owner Name"
                                                        :rules="ownerRules"
                                                        item-text="OwnerName"
                                                        item-value="ownerid"
                                                    ></v-autocomplete>
                                                    <v-combobox
                                                        v-model="fields.CommunityId"
                                                        label="Community"
                                                        :rules="generalRules">   
                                                    </v-combobox>
                                                    <v-combobox
                                                        v-model="fields.Copyright"
                                                        label="Copyright"
                                                        :rules="generalRules">
                                                    </v-combobox>
                                                    <v-combobox
                                                        v-model="fields.UsageRights"
                                                        label="Usage Rights"
                                                        :rules="generalRules">   
                                                    </v-combobox>   
                                                    <v-textarea
                                                        v-model="fields.Caption"
                                                        dense
                                                        label="Caption"
                                                        rows="2"
                                                        >
                                                    </v-textarea>
                                                    <v-textarea
                                                        v-model="fields.Comments"
                                                        dense
                                                        label="Comments"
                                                        rows="2">
                                                    </v-textarea>
                                                    <v-textarea
                                                        v-model="fields.CreditLine"
                                                        dense
                                                        label="Credit Line"
                                                        rows="2"
                                                        :rules="generalRules">
                                                    </v-textarea>

                                                    <v-file-input
                                                    accept="image/*"
                                                    label="Choose photo for upload"
                                                    prepend-icon="mdi-camera"
                                                    @change="onFileSelected"
                                                    :rules="generalRules"
                                                    ></v-file-input>                                          
                                            </v-col>
                                        </v-row>
                                        <v-divider></v-divider>
                                        <v-row>
                                            <v-col cols="12" class="d-flex">
                                                <v-btn
                                                    text
                                                    class="ma-1"
                                                    @click="reset()"
                                                >
                                                    Cancel
                                                </v-btn>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="primary darken-1"
                                                    text
                                                    class="ma-1"
                                                    @click="savePhoto"
                                                    :disabled="!valid"
                                                >
                                                    Save 
                                                </v-btn>    
                                            </v-col>
                                        </v-row>
                                    </v-form>
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
                                                    <v-card-text>{{item.FeatureName}}</v-card-text>
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
                                            @click="reset()"
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
                                                    <v-card-text v-if="item.FeatureName">{{item.FeatureName}}</v-card-text>
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
import photos from "../../../../controllers/photos";
import owners from "../../../../controllers/owners";
export default {
    name: "photos",
    props: ["boatID", "showDefault"],
    data: ()=>({
        searchPhotos: null,
        dialog1: false,
        dialog2: false,
        photos: [],
//form variables
        fields: {
            BoatId: 1,
            Caption: "",
            FeatureName: "",
            OwnerId: 328,
            UsageRights: 0,
            CommunityId: 46,
            Comments: "",
            CreditLine: "",  
            PhotoProjectId:79,
            IsOtherRecord:false,
            OriginalMediaId:1,
            MediaStorage:2,
            Copyright:1,
            Program:4,
            IsComplete:true,
            Rating:3,
        },
        file: false,
        isLoadingOwner: false,
        owners: [],   
        helperOwner: "",
        //helps to validate if the data in the form is correct and the post can be made
        valid: false,
    //input rules
        ownerRules: [
            v => !!v || 'Owner Name is required',
        ],
        generalRules: [
        v => !!v || 'This field is required',],
    
    }),
    mounted(){
        if(this.boatID && !this.showPhotosDefault)
            this.getDataFromAPI();
    },
    methods: {
        async getDataFromAPI(){
            let data = await photos.getByBoatId(this.boatID);
            console.log(data);
            for(let i=0;i<data.length; i++){
                if(data[i].File.data.length > 0){
                    data[i].File.base64 = `data:image/png;base64,${this.toBase64(data[i].File.data)}`;
                }
                data[i].selected = false;
            }
            this.photos = data;
        },
        async getOwners(){
            this.isLoadingOwner = true;
            let data = await owners.get();
            this.owners = data.body;
            console.log(this.owners);
            this.isLoadingOwner = false;
        },
        selectImage(item){
            let index = this.photos.indexOf(item);
            if(index >-1){
                this.photos[index].selected =  !this.photos[index].selected;
            }
        },
        async savePhoto(){
            this.fields.bBatId = this.boatID;
            const formData = new FormData();
            let prevFields = Object.entries(this.fields);
            for(let i=0;i<prevFields.length; i++){
                formData.append(prevFields[i][0],prevFields[i][1]);
            }
            formData.append("file", this.file);
            await photos.post(formData);
        },
        async saveAndLink(){
            //makes axios request to save the data
            
        },
        toBase64(arr) {
            return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
        },
        async onFileSelected(event){
            this.File = event;
        },
        getBase64(file) {//this function is not used currently
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                console.log(reader.result);
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        },
        validate () {
            this.$refs.photoForm.validate();
        },
        reset() {
            this.dialog1 = false;
            this.$refs.photoForm.reset();
        },
        resetValidation () {
            this.$refs.photoForm.resetValidation();
        },
    },
    computed: {
        filteredPhotos(){
            if(this.photos.length > 0 && this.searchPhotos ){
                return this.photos.filter(a => a.FeatureName ? a.FeatureName.toLowerCase().includes(this.searchPhotos.toLowerCase()) : false);
            }
            else{
                return this.photos;
            }
        }
    }
}
</script>


<style scoped>
.scroll{
    height: 720px;
    overflow: auto;
}
.center-children{
    display: grid;
    place-items: center;
}
</style>