<template>
    <v-dialog
      v-model="dialog"
      max-width="600"
      scrollable
    >
      <v-card>
        <v-card-title>Print {{photoname}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row class="mt-2">
              <v-col class="pa-0" cols="6" v-for="(item, i) in sections" :key="`dcheck-${i}`">
                <v-checkbox 
                  v-model="item.print"
                  :label="`Include ${item.name}?`"
                  class="ma-0 pa-0"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="primary darken-1"
            text
            @click="closeDialog"
          >
            Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [ 'dialog', 'photoname' ],
    data: () => ({
        sections: [{ name: 'Feature', print: false},
                  { name: 'Site Record', print: false},
                  { name: 'Historic Sites', print: false},
                  { name: 'Photo', print: false},]
    }),
    methods:{
      closeDialog(){
        this.$emit('closeDialog');
      }
    }
}
</script>