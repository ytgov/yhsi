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
						v-if="!isDeafault"
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
						:no-data-text="
							isDeafault
								? 'You will be able to add documments once the general object is created'
								: 'No documments added'
						"
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
	props: ['data', 'default'],
	data: () => ({
		headers: [
			{ text: 'Document Name', value: 'DocumentName' },
			{ text: 'Date Uploaded', value: 'DateUploaded' },
			{ text: 'Uploader', value: 'Uploader' },
		],
	}),
	methods: {
		newDocument() {
			console.log('newDocument');
			//this.$emit("newDocument", val)
		},
		textData() {
			return this.default
				? 'You will be able to add documments once the general object is created'
				: 'No documments added';
		},
	},
	computed: {
		isDeafault() {
			return this.default;
		},
	},
};
</script>
