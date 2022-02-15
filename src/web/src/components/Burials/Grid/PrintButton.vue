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
      "Last Name",
      "First Name",
      "Gender",
      "Birth Year",
      "Death Year",
      "Manner",
      "CauseID",
      "CemetaryID",
      "Other CemetaryDesc",
      "Origin City",
      "Origin State",
      "Origin Country",
      "Other Country",
    ],

  }),
  methods: {
    // this function is used to map the data from the prop to the  "toPrint" variable, and also to transform
    // some of the data from objects to arrays (this is done because of the way jspdf autotable works)
    mapData(data) {
      if (data.burials) {
        let burials = data.burials;
        this.toPrint.burials = [];
        for (let i = 0; i < burials.length; i++) {
          this.toPrint.burials.push([
            burials[i].LastName,
            burials[i].FirstName,
            burials[i].Gender,
            burials[i].BirthYear,
            burials[i].DeathYear,
            burials[i].Manner,
            burials[i].CauseID,
            burials[i].CemetaryID,
            burials[i].OtherCemetaryDesc,
            burials[i].OriginCity,
            burials[i].OriginState,
            burials[i].OriginCountry,
            burials[i].OtherCountry,
          ]);
        }
      }
    },
    exportPDF() {
      this.mapData(this.data);

      this.doc = new jsPDF("l", "mm", [297, 210]); //new jsPDF('p', 'pt');
      if (this.data.burials) {
        this.doc.text(`Burials`, 15, 15);
        this.textpos = 20;
        this.printTable();
        this.doc.save("Burials.pdf");
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
        body: this.toPrint.burials,
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