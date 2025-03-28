<template>
	<div v-if="item">
		<v-card class="default mb-5">
			<div
				style="
					width: 100%;
					overflow-x: hidden;
					background-color: #fff;
					text-align: center;
				"
			>
				<v-img
					v-if="item.img"
					height="150px"
					:src="item.img"
					placeholder="No image selected"
					aspect-ratio=".5"
				/>
				<img
					v-else
					height="150px"
					:src="makeThumbnailUrl(item)"
				/>
			</div>
			<v-divider />

			<v-card-text>
				{{ item.featureName }} <a @click="gotoPhotos">(view all)</a>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import { PHOTO_URL, PLACE_URL } from '@/urls';

export default {
	components: {},
	props: {
		placeId: {
			type: [Number, String],
			required: true,
		},
	},
	data: () => ({
		item: null,
	}),
	computed: {
		...mapGetters({
			place: 'places/place',
		}),
	},
	created() {
		console.log('PrimaryPhoto created');

		let id = this.$route.params.id;

		axios
			.get(`${PLACE_URL}/${id}/primary-photo`)
			.then((resp) => {
				this.item = resp.data.data;
			})
			.catch((error) => console.error(error));
	},
	methods: {
		makeThumbnailUrl(photo) {
			return `${PHOTO_URL}/${photo.rowId}/thumbfile`;
		},
		gotoPhotos() {
			this.$router.push({ hash: 'photos' });
		},
	},
};
</script>
