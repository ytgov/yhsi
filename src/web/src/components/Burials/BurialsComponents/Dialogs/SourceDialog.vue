<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
          outlined
          class="ml-auto mr-1"
        >
          ADD SOURCE
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">New Source</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form v-model="valid" ref="sourceDialog">
              <v-row>
                   <v-col cols="12">
                      <v-test-field
                          v-model="Source"
                          label="Source"
                          :rules="rules"
                      ></v-test-field>
                  </v-col>
              </v-row>
            </v-form>
                
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="saveNew()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: [  ],
    data: () => ({
        dialog: false,
        Source: "",
        valid: false,
        rules: [
          value => !!value || 'Required.',
        ],
    }),
    methods: {
      saveNew(){
        this.$emit("newSource", { Source: this.Source, new: true });
        this.$refs.sourceDialog.reset();
        this.dialog = false;
      }
    }
}
</script>