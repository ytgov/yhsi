<template>
	<div>
		<!-- Information source list -->
		<v-card>
			<v-list class="pa-0">
				<v-subheader>Information Source</v-subheader>
				<v-divider></v-divider>
				<template v-for="(item, index) in infoSources">
					<v-list-item :key="`nl-${index}`">
						<v-list-item-content>
							<v-list-item-title v-if="!isBeingEdited(index)">{{
								item.Source
							}}</v-list-item-title>
							<!-- Start of Editing -->
							<v-form
								v-model="validSource"
								v-if="!isViewingCrash"
								v-on:submit.prevent
							>
								<v-text-field
									outlined
									dense
									v-if="isBeingEdited(index)"
									label="Source"
									v-model="sourceText"
									:rules="sourceRules"
								></v-text-field>
							</v-form>

							<!-- End of Editing -->
						</v-list-item-content>
						<!-- Buttons -->
						<v-list-item-action class="d-flex flex-row">
							<div v-if="canAddOrRemoveSource">
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											v-bind="attrs"
											v-on="on"
											icon
											class="grey--text text--darken-2"
											@click="doDeleteSource(item, index)"
										>
											<v-icon small> mdi-delete</v-icon>
										</v-btn>
									</template>
									<span>Delete</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											v-bind="attrs"
											v-on="on"
											icon
											class="grey--text text--darken-2"
											@click="doEditSource(item, index)"
										>
											<v-icon small> mdi-pencil</v-icon>
										</v-btn>
									</template>
									<span>Edit</span>
								</v-tooltip>
							</div>
							<!-- Buttons for confirming edis -->
							<div v-if="isBeingEdited(index)">
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											v-bind="attrs"
											v-on="on"
											:disabled="!validSource"
											icon
											class="grey--text text--darken-2"
											color="success"
											@click="saveSource(item, index)"
										>
											<v-icon small>mdi-check</v-icon>
										</v-btn>
									</template>
									<span>Save changes</span>
								</v-tooltip>
								<v-tooltip bottom>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											v-bind="attrs"
											v-on="on"
											icon
											class="grey--text text--darken-2"
											@click="cancelEdit(item, index)"
										>
											<!-- <v-btn
											v-bind="attrs"
											v-on="on"
											icon
											class="grey--text text--darken-2"
											@click="cancelEditTableSources()"
										> -->
											<v-icon small>mdi-close</v-icon>
										</v-btn>
									</template>
									<span>Cancel</span>
								</v-tooltip>
							</div>
						</v-list-item-action>
						<!-- Buttons -->
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
					@click="addNewSource"
					v-if="canAddOrRemoveSource"
					>Add Source</v-btn
				>
			</v-col>
		</v-row>
	</div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
// import _ from 'lodash';
export default {
	name: 'InfoSources',
	props: {
		action: {
			type: String,
			default: 'view',
		},
	},
	data: () => ({
		validSource: false,
		deletedSources: [],
		sourceRules: [(v) => !!v || 'Source is required'],
		newSource: {},
		sourceText: '',
	}),

	computed: {
		...mapState('aircrash', ['indexOfSourceBeingEdited']),

		...mapGetters('aircrash', [
			'infoSources',
			'editedInfoSources',
			'removedInfoSources',
		]),

		canAddOrRemoveSource() {
			if (this.action == 'view') {
				return false;
			}
			if (this.indexOfSourceBeingEdited !== null) {
				return false;
			}
			return true;
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
		...mapActions('aircrash', [
			'newInfoSource',
			'addNewSource',
			'deleteSource',
		]),
		...mapMutations('aircrash', [
			'deleteInfoSource',
			'upsertInfoSource',
			'setEdit',
		]),

		isBeingEdited: function (index) {
			if (this.isViewingCrash) {
				return false;
			}
			return this.indexOfSourceBeingEdited === index;
		},
		doEditSource(item, index) {
			this.sourceText = item.Source;
			this.setEdit(index);
		},

		cancelEdit(item, index) {
			if (item.status == 'New') {
				this.deleteInfoSource({ item, index });
			}
			this.setEdit(null);
		},

		saveSource(item, index) {
			if (item.Source !== this.sourceText) {
				item.Source = this.sourceText;
				this.upsertInfoSource({ item, index });
			}
			this.sourceText = '';
			this.setEdit(null);
		},

		addSource() {
			this.newSource = this.newInfoSource();
		},
		doDeleteSource(item, index) {
			this.deleteInfoSource({ item, index });
		},
	},
};
</script>
