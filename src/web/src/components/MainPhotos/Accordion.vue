<template>
	<div>
		<button
			@click="toggleAccordion()"
			class="flex items-center space-x-3"
			:aria-controls="`collapse${_uid}`"
		>
			<v-icon
				v-if="isOpen"
				class="chevron"
				v-text="'mdi-chevron-up'"
			/>
			<v-icon
				v-if="!isOpen"
				class="chevron"
				v-text="'mdi-chevron-down'"
			/>
			<slot name="title"></slot>
		</button>

		<v-divider />

		<div
			v-show="isOpen"
			:id="`collapse${_uid}`"
		>
			<slot name="content" />
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isOpen: true,
		};
	},
	methods: {
		toggleAccordion() {
			this.isOpen = !this.isOpen;
		},
	},
};
</script>

<style scoped>
.v-icon.v-icon.chevron {
	font-size: 36px;
}
</style>
