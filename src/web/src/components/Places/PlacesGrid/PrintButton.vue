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
    ownerHeaders: ["Name"],
    boatHeaders: [
      "Name",
      "Vessel type",
      "Construction date",
      "Current Location",
      "Service start",
      "Service end",
      "Notes",
      "Owners",
    ],
  }),
  methods: {
    // this function is used to map the data from the prop to the  "toPrint" variable, and also to transform
    // some of the data from objects to arrays (this is done because of the way jspdf autotable works)
    mapData(data) {
      if (data.owners) {
        let owners = data.owners;
        this.toPrint.owners = [];
        for (let i = 0; i < owners.length; i++) {
          this.toPrint.owners.push([
            owners[i].OwnerName ? owners[i].OwnerName : "",
          ]);
        }
      }
      if (data.boats) {
        let boats = data.boats;
        boats.map((x) => {
          x.owners = x.owners.map((x) => (x = x.OwnerName));
        });
        this.toPrint.boats = [];
        for (let i = 0; i < boats.length; i++) {
          this.toPrint.boats.push([
            boats[i].Name,
            boats[i].VesselType,
            boats[i].ConstructionDate,
            boats[i].CurrentLocation,
            boats[i].ServiceStart,
            boats[i].ServiceEnd,
            boats[i].Notes,
            boats[i].owners,
          ]);
        }
      }
    },
    exportPDF() {
      this.mapData(this.data);

      this.doc = new jsPDF("p", "pt");
      if (this.data.owners) {
        this.doc.text(`Owners`, 40, 40);
        this.textpos = 70;
        this.printOwners();
        this.doc.save("Owners.pdf");
      } else {
        this.doc.text(`Boats`, 40, 40);
        this.textpos = 70;
        this.printBoats();
        this.doc.save("Boats.pdf");
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

    printOwners() {
      this.doc.autoTable({
        startY: this.textpos,
        head: [this.ownerHeaders],
        body: this.toPrint.owners,
      });

      this.textpos = this.doc.lastAutoTable.finalY + 20;
    },
    printBoats() {
      this.doc.autoTable({
        startY: this.textpos,
        head: [this.boatHeaders],
        body: this.toPrint.boats,
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