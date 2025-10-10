<template>
	<v-container>
		<!-- SELECTED SYSTEM  == DMS -->
		<v-row v-if="selectedSystem.id == 3 && selectedProjection.id == 1">
			<v-col cols="2.4">
				<h4>Latitude</h4>
			</v-col>
			<v-col>
				<h4>Degrees</h4>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lat.deg"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
			<v-col>
				<h4>Minutes</h4>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lat.min"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
			<v-col>
				<h4>Seconds</h4>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lat.sec"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
			<v-col>
				<h4>Direction</h4>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lat.dir"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
		</v-row>
		<v-row v-if="selectedSystem.id == 3 && selectedProjection.id == 1">
			<v-col cols="2.4">
				<h4>Longitude</h4>
			</v-col>
			<v-col>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lng.deg"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
			<v-col>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lng.min"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
			<v-col>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lng.sec"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
			<v-col>
				<v-text-field
					outlined
					dense
					@change="changedLocation"
					v-model="dms.lng.dir"
					:readonly="mode == 'view'"
				></v-text-field>
			</v-col>
		</v-row>
	</v-container>
</template>
<!-- End DMS -->
<script>
export default {
	name: 'dmsCoordinateWidget',
};
</script>
