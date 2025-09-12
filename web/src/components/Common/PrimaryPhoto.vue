<template>
	<div v-if="photos && photos.length > 0">
		<v-card class="default mb-5">
			<div style="background-color: #fff">
				<v-carousel
					v-model="model"
					:show-arrows="false"
					:hide-delimiters="true"
					height="250"
				>
					<v-carousel-item
						v-for="(item, i) in photos"
						:key="i"
					>
						<v-img
							v-if="item.img"
							:src="item.img"
							placeholder="No image selected"
						/>
						<img
							v-else
							:src="makeThumbnailUrl(item)"
							style="width: 100%; height: 100%; object-fit: contain"
						/>
					</v-carousel-item>
				</v-carousel>
			</div>
			<v-divider />
			<v-card-text class="py-1 text-center">
				{{ selectedPhoto.featureName }}
				<div>
					<v-pagination
						v-if="photos && photos.length > 0"
						v-model="page"
						:length="photos.length"
						class="mt-2"
					></v-pagination>
				</div>
			</v-card-text>
		</v-card>
	</div>
</template>

<script>
import { PHOTO_URL } from '@/urls';

export default {
	components: {},
	props: {
		photos: {
			type: Array,
			required: true,
		},
	},
	data: () => ({
		model: 0,
		page: 1,
	}),
	computed: {
		selectedPhoto() {
			return this.photos[this.model];
		},
	},
	watch: {
		page: function (newPage) {
			this.model = newPage - 1;
		},
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
