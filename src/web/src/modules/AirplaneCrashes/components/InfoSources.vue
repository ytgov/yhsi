<template>
	<div>
		<!-- {{ deletedSources }} -->
		<!-- Information source list -->
		<v-card>
			<v-list class="pa-0">
				<v-subheader>Information Source</v-subheader>
				<v-divider></v-divider>
				<template v-for="(item, index) in infoSources">
					<v-list-item :key="`nl-${index}`">
						<v-list-item-content>
							<v-list-item-title
								v-if="index != editTableSources || isViewingCrash"
								>{{ item.Source }}</v-list-item-title
							>
							<v-form
								v-model="validSource"
								v-if="!isViewingCrash"
								v-on:submit.prevent
							>
								<v-text-field
									outlined
									dense
									v-if="editTableSources == index"
									label="Source"
									v-model="helperSource"
									:rules="sourceRules"
								></v-text-field>
							</v-form>
						</v-list-item-content>
						<v-list-item-action class="d-flex flex-row">
							<v-tooltip
								bottom
								v-if="!isViewingCrash && editTableSources != index"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										icon
										class="grey--text text--darken-2"
										@click="deleteSource(item, index)"
									>
										<v-icon small> mdi-delete</v-icon>
									</v-btn>
								</template>
								<span>Delete</span>
							</v-tooltip>
							<v-tooltip
								bottom
								v-if="!isViewingCrash && editTableSources != index"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										icon
										class="grey--text text--darken-2"
										@click="changeEditTableSources(item, index)"
									>
										<v-icon small> mdi-pencil</v-icon>
									</v-btn>
								</template>
								<span>Edit</span>
							</v-tooltip>
							<v-tooltip
								bottom
								v-if="!isViewingCrash && editTableSources == index"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										:disabled="!validSource"
										icon
										class="grey--text text--darken-2"
										color="success"
										@click="saveTableSources(index)"
									>
										<v-icon small>mdi-check</v-icon>
									</v-btn>
								</template>
								<span>Save changes</span>
							</v-tooltip>
							<v-tooltip
								bottom
								v-if="!isViewingCrash && editTableSources == index"
							>
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										v-bind="attrs"
										v-on="on"
										icon
										class="grey--text text--darken-2"
										@click="cancelEditTableSources()"
									>
										<v-icon small>mdi-close</v-icon>
									</v-btn>
								</template>
								<span>Cancel</span>
							</v-tooltip>
						</v-list-item-action>
					</v-list-item>
					<v-divider :key="`ldiv-${index}`"></v-divider>
				</template>
			</v-list>
		</v-card>
		<v-row>
			<v-col
				cols="12"
				class="d-flex"
			>
				<v-spacer></v-spacer>
				<v-btn
					class="mx-1 black--text align"
					@click="addSource"
					v-if="!isViewingCrash && editTableSources == -1"
					>Add Source</v-btn
				>
			</v-col>
		</v-row>
	</div>
</template>

<script>
// import _ from 'lodash';
export default {
	name: 'InfoSources',
	props: {
		action: {
			type: String,
			default: 'view',
		},
		infoSources: {
			type: Array,
			// default: () => [''],
		},
	},
	data: () => ({
		editTableSources: -1, // tells the list which element will be edited (it has problems with accuracy, i.e: you cant distinguish between an edit & a new element being added)
		addingSource: false, // tells the list if the user is adding a new element, this helps distinguish between an edit & a new element being added...
		helperSource: null,
		validSource: false,
		deletedSources: [],
		sourceRules: [(v) => !!v || 'Source is required'],
	}),

	computed: {
		editedInfoSources() {
			return this.infoSources.filter((x) => x.isEdited == true);
		},
		isNewCrash() {
			return this.action == 'new';
		},
		isEditingCrash() {
			return this.action == 'edit';
		},
		isViewingCrash() {
			return this.action == 'view';
		},
	},

	methods: {
		changeEditTableSources(item, index) {
			this.editTableSources = index;
			this.helperSource = item.Source;
		},
		deleteSource(item, index) {
			if (index > -1) {
				this.infoSources.splice(index, 1);
				if (!item.isNew) this.deletedSources.push(item);
			}
		},
		cancelEditTableSources() {
			if (this.addingSource) {
				this.infoSources.pop();
				this.addingSource = false;
				this.editTableSources = -1;
			} else {
				this.editTableNames = -1;
			}
		},
		saveTableSources(index) {
			if (this.addingSource)
				this.infoSources[index] = {
					Source: this.helperSource,
					Type: 'Reference',
					isNew: true,
				};
			else {
				this.infoSources[index].Source = this.helperSource;
				if (!this.infoSources[index].isNew)
					this.infoSources[index].isEdited = true;
			}

			this.addingSource = false;
			this.editTableSources = -1;
		},
		addSource() {
			if (!this.infoSources) this.infoSources = [];
			this.helperSource = '';
			this.infoSources.push('');
			this.addingSource = true;
			this.editTableSources = this.infoSources.length - 1;
		},
		// getSources() {
		// return _.join(this.infoSources, ';');
		// },
	},
};
</script>
