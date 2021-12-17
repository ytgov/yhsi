<template>
  <v-btn class="black--text mx-1" @click="exportPDF" :loading="loadingPhotos || loadingHistories">
    <v-icon class="mr-1">mdi-printer</v-icon>
    Print
  </v-btn>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
//import html2canvas from "html2canvas"
import _ from "lodash";
export default {
  name: "printButton",
  props: ["name", "data", "selectedImage", "loadingPhotos", "loadingHistories"],
  components: {},
  data: () => ({
    doc: null,
    sections: [
      { name: "General", print: false },
      { name: "Photos", print: false },
      { name: "HistoricRecords", print: false },
    ],
    photoFields: [
      { title: "Creator", key: "Creator" },
      { title: "Feature Name", key: "FeatureName" },
      { title: "Address", key: "Address" },
      { title: "Community Name", key: "CommunityName" },
      { title: "Caption", key: "Caption" },
      { title: "Comments", key: "Comments" },
    ],
    textFields: [
      { title: "Registration Number", key: "RegistrationNumber" },
      { title: "Construction Date:", key: "ConstructionDate" },
      { title: "Service Start Date:", key: "ServiceStart" },
      { title: "Service End Date:", key: "ServiceEnd" },
      { title: "Vessel Type:", key: "VesselType" },
      { title: "Current Location Description:", key: "CurrentLocation" },
      { title: "Notes:", key: "Notes" },
    ],
    toPrint: {},
    textpos: 0,
  }),

  methods: {
    mapData() {
      let props = Object.getOwnPropertyNames(this.data);
      props = _.filter(props, (x) => x != "photos" && x != "historicRecords");
      this.toPrint.general = _.pickBy(this.data, (value, key) =>
        _.includes(props, key)
      );
      this.toPrint.photos = this.data.photos;

      this.toPrint.historicRecords = [];
      let hR = this.data.histories;
      this.toPrint.historicRecords = hR.map((x) => {
        return [x.HistoryText, x.Reference];
      });

      this.toPrint.general.pastNames = this.toPrint.general.pastNames.map(
        (x) => {
          return [x.BoatName];
        }
      );
      let owners = this.toPrint.general.owners;
      this.toPrint.general.owners = owners.map((x) => {
        return [x.OwnerName];
      });
      //console.log(this.toPrint.general.owners);
    },
    exportPDF() {
      this.mapData();

      this.doc = new jsPDF("p", "pt");
      this.doc.text(`Boat: ${this.name}`, 40, 40);
      this.textpos = 70;
      //let sections = Object.keys(this.toPrint);

      this.printGeneral();
      if (this.selectedImage) this.printPhoto();
      this.printHistoricalRecord();

      this.doc.save(`Boat_${this.name}.pdf`);
    },
    printGeneral() {
      for (let i = 0; i < this.textFields.length; i++) {
        this.addTitle(this.textFields[i].title);
        this.addText(`${this.toPrint.general[this.textFields[i].key]}`);
      }
      this.printNames();
      this.printOwners();
    },
    addText(text) {
      let rText = "Empty";
      if (!text.includes("null")) {
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
      this.addTitle("Photo");

      this.doc.addImage(base64, "JPEG", 40, this.textpos, 515, 300);
      this.changePos(320);

      for (let i = 0; i < this.photoFields.length; i++) {
        this.addTitle(this.photoFields[i].title);
        this.addText(`${this.selectedImage[this.photoFields[i].key]}`);
        //console.log(`{ title: "", key: "${keys[i]}"},`);
      }
    },
    printHistoricalRecord() {
      this.doc.addPage();
      this.textpos = 50;
      if (this.toPrint.historicRecords.length == 0) return;
      this.doc.autoTable({
        startY: this.textpos,
        head: [["Historic Record", "Reference"]],
        body: this.toPrint.historicRecords,
      });

      this.textpos = this.doc.lastAutoTable.finalY + 20;
    },
    printNames() {
      if (this.toPrint.general.pastNames.length == 0) return;
      this.doc.autoTable({
        startY: this.textpos,
        head: [["Name/s:"]],
        body: this.toPrint.general.pastNames,
      });

      this.textpos = this.doc.lastAutoTable.finalY + 20;
    },
    printOwners() {
      if (this.toPrint.general.owners.length == 0) return;
      this.doc.autoTable({
        startY: this.textpos,
        head: [["Owner/s:"]],
        body: this.toPrint.general.owners,
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