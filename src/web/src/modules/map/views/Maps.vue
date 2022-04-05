<template>
	<div>
		<h1>Maps</h1>
		<div id="mapHost">
			<advanced-map></advanced-map>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import { UserRoles } from '../../../authorization';
import AdvancedMap from '../components/AdvancedMap.vue';

export default {
	components: { AdvancedMap },
	data: () => {
		return {
			showAdvanced: true,
		};
	},
	computed: {
		...mapGetters(['userInRole', 'user']),
	},
	mounted: function () {
		this.showAdvanced = this.userInRole(UserRoles.ADVANCED_MAPS);

		this.$nextTick(() => {
			window.addEventListener('resize', this.adjustMapHeight);
		});

		this.adjustMapHeight();
	},
	methods: {
		adjustMapHeight() {
			let host = document.getElementById('mapHost');
			let offset = host.offsetTop + 95;
			let remainder = window.innerHeight - offset;
			remainder = Math.max(400, remainder);
			host.style.height = remainder + 'px';
		},
	},
};
</script>
