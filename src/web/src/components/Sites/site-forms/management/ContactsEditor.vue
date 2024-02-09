<template lang="pug">
v-card.default.mb-0(tag="section")
	v-card-title.mb-0.text-h6(tag="h3")
		| Contacts
	v-card-text(tag="form")
		div(
			v-for="(item, i) in contacts",
			:key="`contact-${i + 1}`"
		)
			v-row
				v-col(cols="6")
					ContactTypeSelect(
						v-model="item.contactType"
						background-color="white"
						dense
						outlined
						hide-details
					)
				v-col(cols="6")
					v-btn.my-0.float-right(
						v-if="isEditing"
						color="warning"
						x-small
						fab
						title="Remove"
						background-color="white"
						@click="removeContact(i)"
					)
						v-icon(dark) mdi-close
			v-row
				v-col(cols="6")
					v-text-field(
						:readonly="!isEditing"
						v-model="item.firstName"
						label="First Name"
						required
						dense
						outlined
						background-color="white"
					)
					v-text-field(
						:readonly="!isEditing"
						v-model="item.phoneNumber"
						label="Phone"
						required
						dense
						outlined
						background-color="white"
					)
					v-textarea(
						:readonly="!isEditing"
						v-model="item.mailingAddress"
						label="Mailing Address"
						dense
						outlined
						hide-details
						background-color="white"
					)
				v-col(cols="6")
					v-text-field(
						:readonly="!isEditing"
						v-model="item.lastName"
						label="Last Name"
						required
						dense
						outlined
						background-color="white"
					)
					v-text-field(
						:readonly="!isEditing"
						v-model="item.email"
						label="Email"
						required
						dense
						outlined
						background-color="white"
					)
					v-textarea(
						:readonly="!isEditing"
						v-model="item.description"
						label="Description"
						dense
						outlined
						hide-details
						background-color="white"
					)
			v-row.my-0(v-if="i < contacts.length - 1")
				v-col(cols="12")
					v-divider.my-1.black
	v-card-actions
		v-btn.my-0(
			v-if="isEditing"
			color="primary"
			@click="addContact"
		)
			| Add New
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
