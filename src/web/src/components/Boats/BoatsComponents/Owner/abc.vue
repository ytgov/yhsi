<template>
    <v-list-item :key="`nl-${index}`">
                                            <v-list-item-content>
                                                <v-list-item-title v-if="index != editTableAlias">{{item}}</v-list-item-title>
                                                <v-form v-model="validAlias">
                                                    <v-text-field
                                                    v-if="editTableAlias == index"
                                                    label="Alias"
                                                    v-model="helperAlias"
                                                    :rules="aliasRules"
                                                    ></v-text-field>
                                                </v-form>
                                                
                                            </v-list-item-content>
                                            <v-list-item-action class="d-flex flex-row">
                                                <v-tooltip bottom v-if="mode != 'view' && editTableAlias != index">
                                                    <template v-slot:activator="{ on, attrs }">
                                                            <v-btn 
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            icon class="grey--text text--darken-2"   @click="changeEditTableAlias(item,index)">
                                                                <v-icon
                                                                    small
                                                                > mdi-pencil</v-icon>
                                                            </v-btn>
                                                    </template>
                                                    <span>Edit</span>
                                                </v-tooltip>
                                                <v-tooltip bottom v-if="mode != 'view' && editTableAlias == index">
                                                    <template v-slot:activator="{ on, attrs }">
                                                            <v-btn
                                                            v-bind="attrs"
                                                            v-on="on" 
                                                            icon class="grey--text text--darken-2" color="success"  @click="saveTableAlias(index)">
                                                                <v-icon
                                                                small
                                                                >mdi-check</v-icon>  
                                                            </v-btn>
                                                    </template>
                                                    <span>Save changes</span>
                                                </v-tooltip>
                                                <v-tooltip bottom v-if="mode != 'view' && editTableAlias == index">
                                                    <template v-slot:activator="{ on, attrs }">
                                                            <v-btn 
                                                            v-bind="attrs"
                                                            v-on="on"
                                                            icon class="grey--text text--darken-2"  @click="cancelEditTableAlias()">
                                                                <v-icon
                                                                small
                                                                >mdi-close</v-icon>  
                                                            </v-btn>
                                                    </template>
                                                    <span>Cancel</span>
                                                </v-tooltip> 
                                            </v-list-item-action>
                                        </v-list-item>
                                        <v-divider  :key="`ldiv-${index}`"></v-divider>
</template>

<script>
export default {
            //helper vars used for the Alias list functions
        editTableAlias: -1,// tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
        addingAlias: false,// tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
        helperAlias: null,
        validAlias: false,
        aliasRules: [
            v => !!v || 'Alias is required',
        ],


        //functions for editing the table "Owners" values
        changeEditTableAlias(item,index){
            this.editTableAlias = index;
            this.helperAlias = item;
        },
        cancelEditTableAlias(){
            if(this.validAlias && this.addingAlias){
                this.editTableAlias = -1;
                this.fields.alias.pop();
            }
            else if(this.validAlias && this.addingAlias == false){
                this.editTableAlias = -1;
            }
                
        },
        saveTableAlias(index){
            if(this.validAlias){
                this.fields.alias[index] = this.helperAlias;
                this.editTableAlias = -1;
            }           
        },
        addAlias(){
            this.helperAlias="";
            this.fields.alias.push(""); 
            this.editTableAlias = this.fields.alias.length-1;
        },
}
</script>