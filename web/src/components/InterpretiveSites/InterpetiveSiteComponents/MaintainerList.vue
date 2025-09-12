<template>
	<v-card class="mx-auto">
		<v-list
			subheader
			two-line
		>
			<v-subheader class="d-flex flex-row">
				<div>Maintainers</div>
				<MaintainerDialog
					v-if="mode === 'edit'"
					class="ml-auto mr-1"
					:type="'siteview'"
					:mode="'new'"
					@newMaintainer="newMaintainer"
				/>
			</v-subheader>

			<v-list-item
				v-for="item in filteredList"
				:key="`maint-${item.MaintID}`"
			>
				<v-list-item-content>
					<v-list-item-title v-text="item.Maintainer"></v-list-item-title>
				</v-list-item-content>

				<v-list-item-action>
					<DeleteDialog
						v-if="mode === 'edit'"
						:type="'Maintainer'"
						:id="item.MaintID"
						@deleteItem="deleteItem"
						:mode="'table'"
					/>
				</v-list-item-action>
			</v-list-item>
		</v-list>
	</v-card>
</template>

<script>
import MaintainerDialog from '../Dialogs/MaintainerDialog.vue';
import DeleteDialog from '../Dialogs/DeleteDialog.vue';
export default {
	props: ['list', 'mode'],
	components: { DeleteDialog, MaintainerDialog },
	data: () => ({}),
	methods: {
		deleteItem(id) {
			//api delete call
			this.$emit('deleteMaintainer', id);
		},
		newMaintainer(val) {
			this.$emit('newMaintainer', val);
		},
	},
	computed: {
		filteredList() {
			if (this.list) return this.list.filter((x) => x.deleted !== true);
			return [];
		},
	},
};
</script>
