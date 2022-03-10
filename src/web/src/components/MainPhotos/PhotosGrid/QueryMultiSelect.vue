<template>
  <div>
    <v-autocomplete 
      v-model="itemValue"
      :items="options"
      item-text="label"
      item-value="value"
      class="default" 
      background-color="white"
      outlined 
      dense
      multiple
      hide-details
      clearable
    ></v-autocomplete>
</div>
</template>
 
<script>

export default {
  name: "querymultiselect",
  props: ["value"],
  data: () =>({
    options: [],
    itemValue: null,
  }),
  async mounted() {
    // Get the select options, defined in the parent 
    this.options = await this.getData();
    // Set the select value to the props value
    this.itemValue = this.value;
  },
  computed: {
  },
  methods: {
    getData() {
      return Promise.resolve([]);
    },
  },
  watch:{
    itemValue(val){
      this.$emit('input', val)
    },
  }
}
</script>                   