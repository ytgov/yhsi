<template>
	<div>
		<Accordion>
			<template v-slot:title>
				<v-card-title
					primary-title
					style="display: inline-block"
				>
					Photo
				</v-card-title>
			</template>
			<template v-slot:content>
				<v-form
					v-model="valid"
					ref="photoForm"
				>
					<v-row class="my-1">
						<v-col cols="6">
							<div v-if="imageLoaded && fields.file && fields.file.base64">
								<v-card class="mx-auto">
									<v-img
										:src="fields.file.base64"
										:lazy-src="fields.file.base64"
										class="mr-auto ml-auto"
										max-height="317"
										contain
									></v-img>
								</v-card>
								<v-btn
									v-if="mode == 'edit'"
									class="black--text mx-1"
									@click="rotateImage()"
								>
									<v-icon>mdi-rotate-right</v-icon>
									<div class="ml-2">Rotate</div>
								</v-btn>
								<v-btn
									class="black--text mx-1"
									@click="downloadImage()"
								>
									<v-icon>mdi-download</v-icon>
									<div class="ml-2">Download</div>
								</v-btn>
								<!-- Hidden items for rotate -->
								<img
									style="display: none"
									id="imgFile"
									:src="fields.file.base64"
									:lazy-src="fields.file.base64"
									class="mr-auto ml-auto"
								/>
								<canvas
									id="canvas"
									style="display: none"
								></canvas>
							</div>

							<v-file-input
								v-if="mode != 'view' && itemType == 'photo'"
								label="Choose photo to upload"
								prepend-icon="mdi-camera"
								accept="image/*"
								@change="onFileSelection"
								dense
								outlined
								background-color="white"
							></v-file-input>

							<div
								v-if="itemType == 'photo'"
								class="d-flex default"
							>
								<p class="mt-auto mb-auto grey--text text--darken-2">Rating</p>
								<v-spacer></v-spacer>
								<v-rating
									v-model="fields.rating"
									background-color="orange lighten-3"
									color="orange"
									length="5"
									large
									:readonly="mode == 'view'"
								></v-rating>
							</div>

							<v-checkbox
								v-model="fields.isComplete"
								:label="'Is Complete?'"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-checkbox>

							<v-checkbox
								v-model="fields.isPrivate"
								:label="'Is Private?'"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-checkbox>
						</v-col>

						<v-col cols="6">
							<v-select
								v-model="fields.ownerId"
								:items="ownerOptions"
								:rules="generalRules"
								item-text="name"
								item-value="id"
								label="Owner"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
								:class="{ 'read-only-form-item': mode == 'view' }"
							></v-select>

							<v-select
								v-model="fields.copyright"
								:items="copyrightOptions"
								:rules="generalRules"
								label="Copyright"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
								:class="{ 'read-only-form-item': mode == 'view' }"
							></v-select>

							<v-select
								v-model="fields.usageRights"
								:items="usageRightOptions"
								label="Usage Rights"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
								:class="{ 'read-only-form-item': mode == 'view' }"
							></v-select>

							<v-select
								v-model="fields.subjects"
								multiple
								clearable
								:items="subjectOptions"
								item-text="name"
								item-value="name"
								label="Subjects"
								:class="{ 'read-only-form-item': mode == 'view' }"
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-select>

							<v-textarea
								v-model="fields.caption"
								label="Caption"
								rows="3"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-textarea>

							<v-textarea
								v-model="fields.comments"
								label="Comments"
								rows="3"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-textarea>

							<v-textarea
								v-model="fields.creditLine"
								label="Credit Line"
								rows="3"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-textarea>

							<v-textarea
								v-if="itemType == 'photo'"
								v-model="fields.legacyBatchInfo"
								label="Legacy Batch"
								rows="3"
								required
								dense
								outlined
								background-color="white"
								:readonly="mode == 'view'"
							></v-textarea>
						</v-col>
					</v-row>
				</v-form>
			</template>
		</Accordion>
	</div>
</template>

<script>
import Accordion from '../Accordion';
import axios from 'axios';
import { STATIC_URL } from '../../../urls';

export default {
	name: 'photo',
	components: { Accordion },
	props: ['fields', 'mode', 'itemType', 'imageLoaded'],
	data: () => ({
		valid: false,
		generalRules: [(v) => !!v || 'This field is required'],
		subjectOptions: [],
		ownerOptions: [],
		copyrightOptions: [],
		usageRightOptions: [],
		infoLoaded: false,
	}),
	created() {
		axios.get(`${STATIC_URL}/photo-owner`).then((resp) => {
			this.ownerOptions = resp.data.data;
			this.ownerOptions = this.ownerOptions
				.slice()
				.sort((a, b) =>
					a.name.toLowerCase() > b.name.toLowerCase()
						? 1
						: b.name.toLowerCase() > a.name.toLowerCase()
						? -1
						: 0
				);
		});

		axios.get(`${STATIC_URL}/photo-copyright`).then((resp) => {
			this.copyrightOptions = resp.data.data;
		});

		axios.get(`${STATIC_URL}/usage-right`).then((resp) => {
			this.usageRightOptions = resp.data.data;
		});

		axios.get(`${STATIC_URL}/photo-subject`).then((resp) => {
			this.subjectOptions = resp.data.data;
			this.subjectOptions = this.subjectOptions
				.slice()
				.sort((a, b) =>
					a.name.toLowerCase() > b.name.toLowerCase()
						? 1
						: b.name.toLowerCase() > a.name.toLowerCase()
						? -1
						: 0
				);
		});
	},
	watch: {
		fields: {
			handler() {
				this.$emit('photoChange', this.fields);
			},
			deep: true,
		},
		valid: {
			handler() {
				this.$emit('photoValidChange', this.valid);
			},
		},
	},
	methods: {
		validate() {
			this.$refs.photoForm.validate();
		},
		onFileSelection(event) {
			if (event) {
				//this.fields.photos[i].img = URL.createObjectURL(event.target.files[0]);
				//this.fields.file = URL.createObjectURL(event);
				this.fields.file = event;
				this.$emit('photoChange', this.fields);
			} else {
				this.fields.file = null;
			}
		},
		downloadImage() {
			let img = document.getElementById('imgFile');
			let a = document.createElement('a');
			a.href = img.src;
			a.download = this.fields.originalFileName;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		},
		rotateImage() {
			let img = document.getElementById('imgFile');
			let canvas = document.getElementById('canvas');

			var cContext = canvas.getContext('2d');
			var cw = img.width,
				ch = img.height,
				cx = 0,
				cy = 0;
			cy = img.height * -1;

			//  Rotate image
			canvas.setAttribute('width', cw);
			canvas.setAttribute('height', ch);
			cContext.rotate((90 * Math.PI) / 180);
			cContext.drawImage(img, cx, cy);

			// Save image file
			let dataUrl = canvas.toDataURL('image/png');
			var arr = dataUrl.split(','),
				mime = 'img/jpeg',
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			this.fields.file = new File([u8arr], this.fields.originalFileName, {
				type: mime,
			});

			this.$emit('photoRotate', this.fields.file);
		},
	},
};
</script>
