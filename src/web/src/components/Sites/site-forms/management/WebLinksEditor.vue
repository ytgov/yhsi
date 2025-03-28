<template>
	<v-card class="default">
		<v-card-text tag="form">
			<h3>Web Links</h3>
			<div v-if="!webLinks.length">No web links found.</div>
			<div
				v-for="(item, i) in webLinks"
				:key="`web-link-${i + 1}`"
			>
				<v-row class="mb-2">
					<v-col cols="5">
						<WebLinkTypeSelect
							:readonly="!isEditing"
							v-model="item.type"
							dense
							outlined
							hide-details
							background-color="white"
						/>
					</v-col>
					<v-col cols="5">
						<v-text-field
							:readonly="!isEditing"
							v-model="item.address"
							label="Web Address"
							required
							dense
							outlined
							hide-details
							background-color="white"
						/>
					</v-col>
					<v-col cols="2">
						<v-btn
							class="my-0 float-right"
							v-if="isEditing"
							color="warning"
							x-small
							fab
							title="Remove"
							@click="removeLink(i)"
						>
							<v-icon dark>mdi-close</v-icon>
						</v-btn>
					</v-col>
				</v-row>
			</div>
		</v-card-text>
		<v-card-actions v-if="isEditing">
			<v-btn
				class="my-0"
				color="primary"
				@click="addLink"
			>
				Add New
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import WebLinkTypeSelect from '@/components/Sites/site-forms/management/WebLinkTypeSelect';

export default {
	name: 'WebLinksEditor',
	components: {
		WebLinkTypeSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
		placeId: {
			type: [String, Number],
			required: true,
		},
	},
	computed: {
		webLinks() {
			return this.value;
		},
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	methods: {
		addLink() {
			this.webLinks.push({
				placeId: this.placeId,
				type: 1,
				address: 'https://',
			});
		},
		removeLink(index) {
			this.webLinks.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
