<template>
	<v-card
		class="mb-0"
		tag="section"
		outlined
		tile
	>
		<v-card-title
			class="mb-0 text-h4"
			tag="h2"
		>
			Photos
		</v-card-title>
		<v-card-text tag="section">
			<v-row>
				<v-col cols="12">
					<v-text-field
						v-model="categoryOfProperty"
						label="Category of Property"
						dense
						outlined
						background-color="white"
					/>
				</v-col>
			</v-row>
			<v-card
				class="default mb-0"
				tag="section"
			>
				<v-card-title
					tag="h3"
					class="mb-0 text-h6"
				>
					Photos
				</v-card-title>
				<v-card-text tag="form">
					<v-row>
						<v-col
							v-for="(item, index) in photos"
							:key="`photo-${index + 1}`"
							cols="6"
						>
							<v-row>
								<v-col cols="10">
									<v-img
										v-if="item.img == null"
										class="center-img"
										max-width="128"
										:src="require('../../../assets/add_photo.png')"
									/>
									<v-img
										v-else
										class="center-img"
										max-width="128"
										:src="item.img"
									/>
								</v-col>
								<v-col cols="2">
									<v-btn
										color="warning"
										x-small
										fab
										title="Remove"
										class="my-0 float-right"
										@click="removePhoto(index)"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
								</v-col>
							</v-row>
							<v-text-field
								v-model="item.featureName"
								label="Feature name"
								dense
								outlined
								background-color="white"
							/>

							<v-text-field
								v-model="item.caption"
								label="Caption"
								dense
								outlined
								background-color="white"
							/>

							<v-text-field
								v-model="item.comments"
								label="Comments"
								dense
								outlined
								background-color="white"
							/>

							<v-text-field
								v-model="item.creditLine"
								label="Credit line"
								dense
								outlined
								background-color="white"
							/>

							<v-text-field
								v-model="item.location"
								label="Location"
								dense
								outlined
								background-color="white"
							/>
							<v-file-input
								:id="`fi-${index}`"
								label="Upload image"
								prepend-icon="mdi-camera"
								accept="image/*"
								dense
								outlined
								background-color="white"
								@change="onFileSelection($event, index)"
							/>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-btn
						class="my-0"
						color="primary"
						@click="addPhoto"
					>
						Add Photo
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-card-text>
		<v-card-actions>
			<v-spacer />
			<v-btn
				class="my-0"
				color="primary"
				@click="save"
			>
				Save
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import axios from 'axios';

import store from '@/store';
import { PLACE_URL } from '@/urls';

/* Important**, field data that was not found on the swaggerhub api docs provided was assumed to be in development, hence, some placeholder variables were created. */
export default {
	name: 'Photos',
	data: () => ({
		valid: false,
		generalRules: [
			(v) => !!v || 'This input is required',
			(v) => v.length <= 20 || 'This input must be less than 20 characters',
		],

		photos: [],

		/* Placeholder variables below this line **Read above** */
		categoryOfProperty: '',
	}),
	created: function () {
		let id = this.$route.params.id;

		axios
			.get(`${PLACE_URL}/${id}`)
			.then((resp) => {
				this.fields = resp.data.data;
				this.photos = resp.data.relationships.photos.data;
				store.dispatch('addSiteHistory', resp.data.data);
			})
			.catch((error) => console.error(error));
	},
	methods: {
		addPhoto() {
			this.photos.push({});
		},
		removePhoto(index) {
			this.photos.splice(index, 1);
		},
		onFileSelection(event, i) {
			if (event) {
				//this.fields.photos[i].img = URL.createObjectURL(event.target.files[0]);
				this.fields.photos[i].img = URL.createObjectURL(event);
			} else {
				this.fields.photos[i].img = null;
			}
		},
		save() {
			console.error('Not implemented');
		},
	},
};
</script>

<style scoped>
#backgroundimgsw {
	background-image: '../../assets/greyimg.jpg';
}
.center-img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 50%;
}
.divback {
	background-image: url('../../../assets/add_photo.png');
	width: 100px;
	height: 100px;
}
</style>
