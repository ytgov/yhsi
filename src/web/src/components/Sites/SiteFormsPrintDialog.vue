<template>
	<v-dialog
		v-model="dialog"
		max-width="600"
		scrollable
	>
		<v-card>
			<v-card-title>Print {{ sitename }}</v-card-title>
			<v-card-text>
				<v-divider class="mb-4"></v-divider>
				<v-row>
					<v-col
						class="py-0"
						cols="6"
					>
						<v-checkbox
							v-model="selectAll"
							dense
							label="Include all sections"
							@click="toggleAll()"
							hide-details
						></v-checkbox>
					</v-col>
					<v-col
						class="py-0"
						cols="6"
						v-for="(item, i) in sections"
						:key="`dcheck-${i}`"
					>
						<v-checkbox
							v-model="item.print"
							dense
							hide-details
							:label="`Include ${item.name}`"
						></v-checkbox>
					</v-col>
				</v-row>
			</v-card-text>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn
					color="primary"
					@click="doPrint"
					:disabled="hasChecks"
				>
					Print
				</v-btn>
				<v-spacer></v-spacer>
				<v-btn
					color="secondary"
					@click="closeDialog"
				>
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
//import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { PLACE_URL } from '@/urls';
//import _ from 'lodash';
export default {
	props: ['dialog', 'sitename', 'siteId'],
	data: () => ({
		selectAll: false,
		sections: [
			{ name: 'Summary', print: true },
			{ name: 'Location', print: false },
			{ name: 'Dates & Condition', print: false },
			{ name: 'Themes & Function', print: false },
			{ name: 'Associations', print: false },
			{ name: 'Legal & Zoning', print: false },
			{ name: 'Photos', print: false },
			{ name: 'Management', print: false },
			{ name: 'Description', print: false },
		],
	}),
	computed: {
		hasChecks: function () {
			let test = this.sections.filter((s) => s.print);
			return test.length == 0;
		},
	},
	methods: {
		toggleAll() {
			let newVal = this.selectAll;

			this.sections.forEach((s) => (s.print = newVal));
		},
		doPrint() {
			// if you replace /html with /pdf, it will generate a pdf to download
			// it currently doesn't support choosing sections but that will be done once it's all working
			window.open(`${PLACE_URL}/${this.siteId}/print/html`);
			this.$emit('closeDialog');
			this.$emit('showSuccess', 'PRINTING COMPLETE');
		},
		closeDialog() {
			this.$emit('closeDialog');
		},
	},
};
</script>
