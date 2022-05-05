<template>
	<v-row>
		<v-col cols="12">
			<v-row>
				<v-col
					cols="12"
					class="d-flex flex-row"
				>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						outlined
						class="ml-auto mr-1"
						@click="newDocument"
					>
						ADD DOCUMENT
					</v-btn></v-col
				>
			</v-row>
			<v-row>
				<v-col cols="12">
					<v-data-table
						:headers="headers"
						:items="data"
						:items-per-page="5"
						class="elevation-0"
					></v-data-table>
				</v-col>
			</v-row>
		</v-col>
	</v-row>
</template>

<script>
export default {
	name: 'DocumentHandler',
	props: ['data'],
	data: () => ({
		headers: [
			{ text: 'Document Name', value: 'DocumentName' },
			{ text: 'Date Uploaded', value: 'DateUploaded' },
			{ text: 'Uploader', value: 'Uploader' },
		],
	}),
	mounted() {},
	methods: {
		newDocument() {
			console.log('newDocument');
			//this.$emit("newDocument", val)
		},
	},
};
</script>
