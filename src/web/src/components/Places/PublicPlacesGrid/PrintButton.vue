<template>
  <v-btn class="black--text mx-1" @click="exportPDF" :disabled="disabled">
    <v-icon class="mr-1">mdi-printer</v-icon>
    Print
  </v-btn>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
//import html2canvas from "html2canvas"
export default {
  name: "printButton",
  props: ["name", "data", "disabled"],
  components: {},
  data: () => ({
    doc: null,
    toPrint: {},
    textpos: 0,
    placeHeaders: [
      "Name",
      "Alternate Name",
      "First Nation Name",
      "Place Type",
      "Location Description",
      "Latitude",
      "Longitude",
      "Mapsheet",
    ],
  }),
  methods: {
    // this function is used to map the data from the prop to the  "toPrint" variable, and also to transform
    // some of the data from objects to arrays (this is done because of the way jspdf autotable works)
    mapData(data) {
      if (data.places) {
        let places = data.places;
        this.toPrint.places = [];
        for (let i = 0; i < places.length; i++) {
          this.toPrint.places.push([
            places[i].name,
            places[i].alternateNames,
            places[i].firstNationNames,
            places[i].placeTypes,
            places[i].locationDesc,
            places[i].latitude,
            places[i].longitude,
            places[i].mapSheet,
          ]);
        }
      }
    },
    exportPDF() {
      this.mapData(this.data);

      this.doc = new jsPDF("p", "pt");
        this.doc.text(`Places`, 40, 40);
        this.textpos = 70;
        this.printPlaces();
        this.doc.save("Places.pdf");
    },
    addText(text) {
      this.doc.setFontSize(9);
      this.doc.text(text, 50, this.textpos);
      this.textpos += 20;
    },
    addTitle(title) {
      this.doc.setFontSize(10);
      this.doc.text(title, 40, this.textpos);
      this.textpos += 20;
    },

    printPlaces() {
      this.doc.autoTable({
        startY: this.textpos,
        head: [this.placeHeaders],
        body: this.toPrint.places,
      });

      this.textpos = this.doc.lastAutoTable.finalY + 20;
    },
  },
  watch: {
    textpos(newVal) {
      if (newVal >= 800) this.doc.addPage();
    },
  },
};
</script>