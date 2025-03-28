<template>
	<v-card
		class="default mb-0"
		tag="section"
	>
		<v-card-text tag="form">
			<h3>Contacts</h3>
			<div v-if="!contacts.length">No contacts found.</div>
			<div
				v-for="(item, i) in contacts"
				:key="`contact-${i + 1}`"
			>
				<v-row>
					<v-col cols="6">
						<ContactTypeSelect
							v-model="item.contactType"
							background-color="white"
							dense
							outlined
							hide-details
						/>
					</v-col>
					<v-col cols="6">
						<v-btn
							v-if="isEditing"
							class="my-0 float-right"
							color="warning"
							x-small
							fab
							title="Remove"
							background-color="white"
							@click="removeContact(i)"
						>
							<v-icon dark>mdi-close</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="6">
						<v-text-field
							:readonly="!isEditing"
							v-model="item.firstName"
							label="First Name"
							required
							dense
							outlined
							background-color="white"
						/>
						<v-text-field
							:readonly="!isEditing"
							v-model="item.phoneNumber"
							label="Phone"
							required
							dense
							outlined
							background-color="white"
						/>
						<v-textarea
							:readonly="!isEditing"
							v-model="item.mailingAddress"
							label="Mailing Address"
							dense
							outlined
							hide-details
							background-color="white"
						/>
					</v-col>
					<v-col cols="6">
						<v-text-field
							:readonly="!isEditing"
							v-model="item.lastName"
							label="Last Name"
							required
							dense
							outlined
							background-color="white"
						/>
						<v-text-field
							:readonly="!isEditing"
							v-model="item.email"
							label="Email"
							required
							dense
							outlined
							background-color="white"
						/>
						<v-textarea
							:readonly="!isEditing"
							v-model="item.description"
							label="Description"
							dense
							outlined
							hide-details
							background-color="white"
						/>
					</v-col>
				</v-row>
				<v-row
					class="my-0"
					v-if="i < contacts.length - 1"
				>
					<v-col cols="12">
						<v-divider class="my-1 black"></v-divider>
					</v-col>
				</v-row>
			</div>
		</v-card-text>
		<v-card-actions v-if="isEditing">
			<v-btn
				class="my-0"
				color="primary"
				@click="addContact"
			>
				Add New
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import ContactTypeSelect from '@/components/Sites/site-forms/management/ContactTypeSelect';

export default {
	name: 'ContactsEditor',
	components: {
		ContactTypeSelect,
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
		contacts() {
			return this.value;
		},
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	methods: {
		addContact() {
			this.contacts.push({ placeId: this.placeId, contactType: 1 });
		},
		removeContact(index) {
			this.contacts.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
