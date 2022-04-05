<template lang="pug">
pre {{ value }}
</template>

<script>
export default {
	name: 'JsonViewer',
	props: {
		value: {
			type: [Object, Array],
			default: () => undefined,
		},
	},
};
</script>

<style scoped></style>
