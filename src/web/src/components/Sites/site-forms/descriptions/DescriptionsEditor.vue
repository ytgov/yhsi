<template lang="pug">
v-card.default
	v-card-title.mb-0.text-h6(tag="h3")
		| Descriptions
	v-card-text(tag="form")
		div(
			v-for="(item, i) in descriptions",
			:key="`description-${i + 1}`"
		)
			v-row
				v-col(cols="6")
					v-select(
						v-model="item.type",
						:items="typeOptions"
						label="Decription type"
						dense
						outlined
						background-color="white"
						hide-details
					)
				v-col(cols="6")
					v-btn.my-0.float-right(
						color="warning"
						x-small
						fab
						title="Remove"
						@click="removeDescription(i)"
					)
						v-icon mdi-close
			v-row
				v-col(cols="10")
					v-textarea(
						v-model="item.descriptionText"
						label
						dense
						outlined
						background-color="white"
						hide-details
					)
			v-row.mt-0(v-if="i < descriptions.length - 1")
				v-col(cols="12")
					v-divider.my-1.black
	v-card-actions
		v-btn.my-0(
			color="info"
			@click="addDescription()"
		)
			| Add Description
</template>

<script>
import axios from 'axios';
import { STATIC_URL } from '@/urls';

export default {
	name: 'DescriptionsEditor',
	components: {},
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
		value: {
			type: Array,
			default: () => [],
		},
	},
	data: () => ({
		typeOptions: [],
	}),
	computed: {
		descriptions() {
			return this.value;
		},
	},
	mounted() {
		axios.get(`${STATIC_URL}/description-type`).then((resp) => {
			this.typeOptions = resp.data.data;
		});
	},
	methods: {
		addDescription() {
			this.descriptions.push({ placeId: this.placeId, type: 1 });
		},
		removeDescription(index) {
			this.descriptions.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
