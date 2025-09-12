<template>
	<v-btn
		class="black--text mx-1"
		@click="exportPDF"
	>
		<v-icon class="mr-1">mdi-printer</v-icon>
		Print
	</v-btn>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';
//import html2canvas from "html2canvas"
import _ from 'lodash';
export default {
	name: 'printButton',
	props: ['name', 'data', 'selectedImage'],
	components: {},
	data: () => ({
		doc: null,
		sections: [
			{ name: 'General', print: false },
			{ name: 'Photos', print: false },
			{ name: 'HistoricRecords', print: false },
		],
		photoFields: [
			{ title: 'Creator', key: 'Creator' },
			{ title: 'Feature Name', key: 'FeatureName' },
			{ title: 'Address', key: 'Address' },
			{ title: 'Community Name', key: 'CommunityName' },
			{ title: 'Caption', key: 'Caption' },
			{ title: 'Comments', key: 'Comments' },
		],
		textFields: [
			{ title: 'Place Types:', key: 'placeTypeNames' },
			{ title: 'Notes:', key: 'notes' },
			{ title: 'Latitude:', key: 'latitude' },
			{ title: 'Longitude:', key: 'longitude' },
			{ title: 'Location Description:', key: 'locationDesc' },
			{ title: 'Location Accuracy:', key: 'accuracy' },
			{ title: 'MapSheet:', key: 'mapSheet' },
		],
		toPrint: {},
		textpos: 0,
	}),

	methods: {
		mapData() {
			let props = Object.getOwnPropertyNames(this.data);
			props = _.filter(props, (x) => x != 'photos' && x != 'historicRecords');
			this.toPrint.general = _.pickBy(this.data, (value, key) =>
				_.includes(props, key)
			);
			this.toPrint.photos = this.data.photos;

			this.toPrint.historicRecords = [];
			let hR = this.data.histories;
			this.toPrint.historicRecords = hR.map((x) => {
				let restrictedVal = x.restricted == 1 ? 'Yes' : 'No';
				return [x.historyText, x.reference, restrictedVal];
			});

			this.toPrint.general.altNames = this.toPrint.general.altNames.map((x) => {
				return [x.alternateName];
			});

			this.toPrint.general.fnNames = this.toPrint.general.fnNames.map((x) => {
				return [x.fnName, x.fnLanguage, x.fnDesription];
			});

			this.toPrint.general.fnAssociations =
				this.toPrint.general.fnAssociations.map((x) => {
					let fnAssociationType =
						this.toPrint.general.fnAssociationTypeOptions.find(
							(y) => y.value === x.fnAssociationType
						).text;
					let firstNation = this.toPrint.general.firstNationOptions.find(
						(y) => y.id === x.firstNationId
					).description;
					return [fnAssociationType, firstNation];
				});
		},
		exportPDF() {
			this.mapData();

			this.doc = new jsPDF('p', 'pt');
			this.doc.text(`Place: ${this.name}`, 40, 40);
			this.textpos = 70;
			//let sections = Object.keys(this.toPrint);

			this.printGeneral();
			if (this.selectedImage) this.printPhoto();
			this.printHistoricalRecord();

			this.doc.save(`Place_${this.name}.pdf`);
		},
		printGeneral() {
			for (let i = 0; i < this.textFields.length; i++) {
				this.addTitle(this.textFields[i].title);
				this.addText(`${this.toPrint.general[this.textFields[i].key]}`);
			}
			this.printAltNames();
			this.printFnNames();
			this.printFnAssociations();
		},
		addText(text) {
			let rText = 'Empty';
			if (!text.includes('null')) {
				rText = text;
			}
			let strArr = this.doc.splitTextToSize(rText, 550);
			this.doc.setFontSize(9);

			for (let i = 0; i < strArr.length; i++) {
				this.doc.text(strArr[i], 50, this.textpos);
				this.changePos(12);
			}
			this.changePos(8);
		},
		addTitle(title) {
			this.doc.setFontSize(10);
			this.doc.text(title, 40, this.textpos);
			this.textpos += 20;
		},
		async printPhoto() {
			let { base64 } = this.selectedImage.File;

			this.doc.addPage();
			this.textpos = 50;
			this.addTitle('Photo');

			this.doc.addImage(base64, 'JPEG', 40, this.textpos, 515, 300);
			this.changePos(320);

			for (let i = 0; i < this.photoFields.length; i++) {
				this.addTitle(this.photoFields[i].title);
				this.addText(`${this.selectedImage[this.photoFields[i].key]}`);
			}
		},
		printHistoricalRecord() {
			this.doc.addPage();
			this.textpos = 50;
			if (this.toPrint.historicRecords.length == 0) return;
			this.doc.autoTable({
				startY: this.textpos,
				head: [['Historic Record', 'Reference', 'Restricted']],
				body: this.toPrint.historicRecords,
			});

			this.textpos = this.doc.lastAutoTable.finalY + 20;
		},
		printAltNames() {
			if (this.toPrint.general.altNames.length == 0) return;
			this.doc.autoTable({
				startY: this.textpos,
				head: [['Alternate Name']],
				body: this.toPrint.general.altNames,
			});

			this.textpos = this.doc.lastAutoTable.finalY + 20;
		},
		printFnNames() {
			if (this.toPrint.general.fnNames.length == 0) return;
			this.doc.autoTable({
				startY: this.textpos,
				head: [['First Nation Name', 'Language', 'Description']],
				body: this.toPrint.general.fnNames,
			});

			this.textpos = this.doc.lastAutoTable.finalY + 20;
		},
		printFnAssociations() {
			if (this.toPrint.general.fnAssociations.length == 0) return;
			this.doc.autoTable({
				startY: this.textpos,
				head: [['First Nation Association', 'First Nation']],
				body: this.toPrint.general.fnAssociations,
			});

			this.textpos = this.doc.lastAutoTable.finalY + 20;
		},

		changePos(val) {
			if (this.textpos + val >= 790) {
				this.doc.addPage();
				this.textpos = 50;
			} else {
				this.textpos += val;
			}
		},
	},
	watch: {
		textpos(newVal) {
			if (newVal >= 800) this.doc.addPage();
		},
	},
};
</script>
