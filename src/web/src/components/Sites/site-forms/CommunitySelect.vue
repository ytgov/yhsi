<template lang="pug">
v-select(
	label="Community",
	:items="communities",
	:loading="loading"
	item-value="id"
	item-text="name"
	v-bind="$attrs"
	v-on="$listeners",
	:readonly="!isEditing"
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
import { mapActions, mapGetters } from 'vuex';

export default {
	name: 'CommunitySelect',
	computed: {
		...mapGetters('communities', ['communities', 'loading']),
		isEditing() {
			return (
				this.$route.path.includes('/edit') ||
				this.$route.path.includes('/create')
			);
		},
	},
	mounted() {
		this.initialize();
	},
	methods: {
		...mapActions('communities', ['initialize']),
	},
};
</script>

<style scoped></style>
