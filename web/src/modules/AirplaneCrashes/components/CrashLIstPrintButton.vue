<template>
  <v-btn class="black--text mx-1" @click="exportPDF" :disabled="disabled">
    <v-icon class="mr-1">mdi-printer</v-icon>
    Print
  </v-btn>
</template>

<script>
import jsPDF from "jspdf";
import "jspdf-autotable";
export default {
  name: "printButton",
  props: ["name", "data", "disabled"],
  components: {},
  data: () => ({
    doc: null,
    toPrint: {},
    textpos: 0,
    headers: [
      "YACSI Number",
      "Crash Date",
      "Aircraft Type",
      "Aircraft Registration",
      "Country",
      "Registration Type",
      "Location Description",
      "Pilot First Name",
      "Pilot Last Name",
      "Souls Onboard",
      "Fatalities",
    ],
  }),
  methods: {
    // this function is used to map the data from the prop to the  "toPrint" variable, and also to transform
    // some of the data from objects to arrays (this is done because of the way jspdf autotable works)
    mapData(data) {
      if (data.crashsites) {
        let crashsites = data.crashsites;
        this.toPrint.crashsites = [];
        for (let i = 0; i < crashsites.length; i++) {
          this.toPrint.crashsites.push([
            crashsites[i].yacsinumber,
            crashsites[i].crashdate,
            crashsites[i].aircrafttype,
            crashsites[i].aircraftregistration,
            crashsites[i].nation,
            crashsites[i].militarycivilian,
            crashsites[i].crashlocation,
            crashsites[i].pilotfirstname,
            crashsites[i].pilotlastname,
            crashsites[i].soulsonboard,
            crashsites[i].injuries,
            crashsites[i].fatalities,
          ]);
        }
      }
    },
    exportPDF() {
      this.mapData(this.data);

      this.doc = new jsPDF("l", "mm", [297, 210]); //new jsPDF('p', 'pt');
      if (this.data.crashsites) {
        this.doc.text(`Crash Sites`, 15, 15);
        this.textpos = 20;
        this.printTable();
        this.doc.save("Aircrashes.pdf");
      }
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

    printTable() {
      this.doc.autoTable({
        startY: this.textpos,
        head: [this.headers],
        body: this.toPrint.crashsites,
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