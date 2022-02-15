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
    peopleHeaders: [
      "Surname",
      "Given Name",
      "Birth Year",
      "Birth Accuracy",
      "Death Year",
      "Death Accuracy"
    ],
  }),
  methods: {
    // this function is used to map the data from the prop to the  "toPrint" variable, and also to transform
    // some of the data from objects to arrays (this is done because of the way jspdf autotable works)
    mapData(data) {
      if (data.people) {
        let people = data.people;
        this.toPrint.people = [];
        for (let i = 0; i < people.length; i++) {
          this.toPrint.people.push([
            people[i].Surname,
            people[i].GivenName,
            people[i].BirthYear,
            people[i].BirthAccuracy,
            people[i].DeathYear,
            people[i].DeathAccuracy,
          ]);
        }
      }
    },
    exportPDF() {
      this.mapData(this.data);

      this.doc = new jsPDF("p", "pt");
        this.doc.text(`People`, 40, 40);
        this.textpos = 70;
        this.printTable();
        this.doc.save("People.pdf");
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
        head: [this.peopleHeaders],
        body: this.toPrint.people,
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