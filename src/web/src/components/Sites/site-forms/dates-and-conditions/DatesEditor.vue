<template>
	<v-card
		tag="section"
		class="default mb-4"
	>
		<v-card-title
			tag="h3"
			class="mb-0 text-h6"
		>
			Dates
		</v-card-title>
		<v-card-text tag="form">
			<div
				v-for="(date, i) in dates"
				:key="i"
			>
				<v-row>
					<v-col cols="5">
						<DateTypesSelect
							v-model="date.type"
							dense
							outlined
							background-color="white"
							hide-details
						/>
					</v-col>
					<v-col cols="5">
						<v-text-field
							v-model="date.details"
							:readonly="!isEditing"
							label="Details"
							dense
							outlined
							background-color="white"
							hide-details
						/>
					</v-col>
					<v-col cols="2">
						<v-btn
							v-if="isEditing"
							color="warning"
							x-small
							fab
							class="my-0"
							@click="removeDate(i)"
						>
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="5">
						<v-menu
							v-model="datesFromMenus[i]"
							:close-on-content-click="false"
							transition="scale-transition"
							left
							nudge-top="26"
							offset-y
							min-width="auto"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="date.fromDate"
									label="From date"
									append-icon="mdi-calendar"
									readonly
									outlined
									dense
									hide-details
									background-color="white"
									v-bind="attrs"
									v-on="on"
								/>
							</template>
							<v-date-picker
								v-model="date.fromDate"
								@input="datesFromMenus[i] = false"
							/>
						</v-menu>
					</v-col>
					<v-col col="5">
						<v-menu
							v-model="datesToMenus[i]"
							:close-on-content-click="false"
							transition="scale-transition"
							left
							nudge-top="26"
							offset-y
							min-width="auto"
						>
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="date.toDate"
									label="To date"
									append-icon="mdi-calendar"
									readonly
									outlined
									dense
									hide-details
									background-color="white"
									v-bind="attrs"
									v-on="on"
								/>
							</template>
							<v-date-picker
								v-model="date.toDate"
								@input="datesToMenus[i] = false"
							/>
						</v-menu>
					</v-col>
					<v-col cols="2" />
				</v-row>
				<v-row
					v-if="i < dates.length - 1"
					class="my-0"
				>
					<v-col cols="10">
						<v-divider class="black" />
					</v-col>
				</v-row>
			</div>
		</v-card-text>
		<v-card-actions>
			<v-btn
				v-if="isEditing"
				class="my-0"
				color="primary"
				@click="addDate"
			>
				Add date
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import DateTypesSelect from '@/components/Sites/site-forms/DateTypesSelect';

export default {
	name: 'DatesEditor',
	components: {
		DateTypesSelect,
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
	data: () => ({
		datesFromMenus: [],
		datesToMenus: [],
	}),
	computed: {
		dates() {
			return this.value;
		},
		isEditing() {
			return this.$route.path.includes('/edit');
		},
	},
	watch: {},
	mounted() {
		this.datesFromMenus = this.dates.map(() => false);
		this.datesToMenus = this.dates.map(() => false);
	},
	methods: {
		addDate() {
			this.dates.push({
				placeId: this.placeId,
				type: 1,
				fromDate: '1900-01-01',
				toDate: '1901-01-01',
			});
		},
		removeDate(index) {
			this.dates.splice(index, 1);
		},
	},
};
</script>

<style scoped></style>
