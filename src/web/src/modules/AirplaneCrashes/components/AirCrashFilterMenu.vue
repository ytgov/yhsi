<template>
	<div>
		<!-- <v-menu
		transition="slide-y-transition"
		bottom
		:close-on-content-click="false"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				color="transparent"
				class="black--text"
				v-bind="attrs"
				v-on="on"
			>
				<v-icon class="black--text mr-1">mdi-filter</v-icon>
				Filter

				<v-icon class="black--text">mdi-chevron-right</v-icon>
			</v-btn>
		</template> -->

		<!-- <v-list>
			<v-list-item
				v-for="(item, i) in filterOptions"
				:key="i"
				link
			> -->
		<v-row>
			<v-col
				:cols="numCols"
				v-for="(item, i) in filterOptions"
				:key="i"
				link
			>
				<v-text-field
					clearable
					v-model="item.value"
					:label="item.name"
				></v-text-field>
			</v-col>
		</v-row>
		<!-- </v-list-item> -->
		<!-- </v-list> -->

		<!-- </v-menu> -->
	</div>
</template>

<script>
export default {
	name: 'FilterMenu',
	props: {
		filterOptions: {
			type: Array,
			required: true,
		},
	},
	data: () => ({}),
	computed: {
		numCols() {
			const rows = 2;
			const colsInGrid = 12;
			return Math.floor(colsInGrid / (this.filterOptions.length / rows));
		},
	},
	watch: {
		filterOptions: {
			handler: function (val) {
				this.$emit('update:filterOptions', val);
			},
			deep: true,
		},
	},
};
</script>

<style></style>
