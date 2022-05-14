<template>
	<v-dialog
		v-model="dialog"
		persistent
		max-width="290"
	>
		<template v-slot:activator="{ on, attrs }">
			<v-btn
				v-if="!tableMode"
				color="warning"
				text
				v-bind="attrs"
				v-on="on"
				>Delete
			</v-btn>
			<v-btn
				v-else
				color="danger"
				icon
				v-bind="attrs"
				v-on="on"
			>
				<v-icon> mdi-delete </v-icon>
			</v-btn>
		</template>
		<v-card>
			<v-card-title class="text-h5"> Confirmation </v-card-title>
			<v-card-text>
				Are you sure you want to delete this {{ type }}?</v-card-text
			>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="grey darken-1"
					text
					@click="dialog = false"
				>
					Cancel
				</v-btn>
				<v-btn
					color="red darken-1"
					text
					@click="confirmDelete"
				>
					Delete
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: 'deleteDialog',
	props: ['id', 'type', 'mode'],
	data: () => ({
		dialog: false,
	}),
	methods: {
		confirmDelete() {
			this.$emit('deleteItem', this.id);
			this.dialog = false;
		},
	},
	computed: {
		tableMode() {
			return this.mode === 'table';
		},
	},
};
</script>
