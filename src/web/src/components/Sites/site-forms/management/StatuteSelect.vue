<template lang="pug">
v-autocomplete(
	:readonly="!isEditing",
	:label="$attrs.label || 'Statute: Recognition Authority / Recognition Type / Statute'",
	:items="statuteOptions"
	v-bind="$attrs"
	v-on="$listeners"
)
	template(
		v-for="(_, slot) of $scopedSlots"
		v-slot:[slot]="scope"
	)
		slot(
			:name="slot"
			v-bind="scope"
		)
</template>

<script>
import { isEmpty } from 'lodash';

import api from '@/apis/statutes-api';

export default {
	name: 'StatuteSelect',
	data: () => ({
		statuteOptions: [],
		loading: false,
	}),
	computed: {
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	mounted() {
		this.getStatuteOptions();
	},
	methods: {
		getStatuteOptions() {
			this.loading = true;
			return api
				.getAll()
				.then(({ data }) => {
					const formattedData = data.map(
						({ id, recognitionAuthority, recognitionType, allStatute }) => {
							return {
								value: id,
								text: [recognitionAuthority, recognitionType, allStatute]
									.filter((v) => !isEmpty(v))
									.join(' / '),
							};
						}
					);
					this.statuteOptions = formattedData;
					return data;
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
};
</script>

<style scoped></style>
