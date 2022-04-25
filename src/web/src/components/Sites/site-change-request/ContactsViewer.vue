<template lang="pug">
.px-5.py-3
	h3 Contacts
	template(v-if="contacts.length === 0")
		span No contacts
	template(v-else)
		div(
			v-for="(item, i) in contacts",
			:key="`contact-${i + 1}`"
		)
			v-row
				v-col(cols="6")
					ContactTypeSelect(
						:value="item.contactType"
						readonly
						dense
						outlined
						hide-details
					)
			v-row
				v-col(cols="6")
					v-text-field(
						:value="item.firstName"
						label="First Name"
						readonly
						required
						dense
						outlined
					)
					v-text-field(
						:value="item.phoneNumber"
						label="Phone"
						readonly
						required
						dense
						outlined
					)
					v-textarea(
						:value="item.mailingAddress"
						label="Mailing Address"
						readonly
						dense
						outlined
						hide-details
					)
				v-col(cols="6")
					v-text-field(
						:value="item.lastName"
						label="Last Name"
						readonly
						required
						dense
						outlined
					)
					v-text-field(
						:value="item.email"
						label="Email"
						readonly
						required
						dense
						outlined
					)
					v-textarea(
						:value="item.description"
						label="Description"
						readonly
						dense
						outlined
						hide-details
					)
			v-row.my-0(v-if="i < contacts.length - 1")
				v-col(cols="12")
					v-divider.my-1.black
</template>

<script>
import ContactTypeSelect from '@/components/Sites/site-forms/management/ContactTypeSelect';

export default {
	name: 'ContactsViewer',
	components: {
		ContactTypeSelect,
	},
	props: {
		value: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		contacts() {
			return this.value;
		},
	},
};
</script>

<style scoped></style>
