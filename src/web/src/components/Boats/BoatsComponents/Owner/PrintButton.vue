<template>
    <v-btn class="black--text mx-1" @click="exportPDF">
        <v-icon class="mr-1">mdi-printer</v-icon>
        Print
    </v-btn>
</template>

<script>
import jsPDF  from "jspdf";
import 'jspdf-autotable';
//import html2canvas from "html2canvas"
export default {
    name: "printButton",
    props: ["name","data" ],
    components: {  },
    data: ()=> ({
        doc: null,
        toPrint: {},
        textpos: 0,
    }),
    methods: {
        mapData(){
            this.toPrint.historicRecords = this.data.historicRecords;
            this.toPrint.ownerName = this.data.ownerName;

            let hR = this.toPrint.historicRecords;
            this.toPrint.historicRecords = [];
            for(let i = 0; i<hR.length; i++){
              this.toPrint.historicRecords.push(Object.values(hR[i]));
            }

            let alias = this.data.alias;
            this.toPrint.alias = [];
            for(let i = 0; i<alias.length; i++){
              this.toPrint.alias.push([alias[i]]);
            }

            let boatsOwned = this.data.boatsOwned;
            this.toPrint.boatsOwned = [];
            for(let i = 0; i<boatsOwned.length; i++){
              this.toPrint.boatsOwned.push([boatsOwned[i]]);
            }
      },
      exportPDF() {
        this.mapData();
        this.doc = new jsPDF('p', 'pt');
        this.doc.text(`Owner: ${this.name}`, 40, 40);
        this.textpos = 70; 
        //let sections = Object.keys(this.toPrint);
        /* redundant
        this.addTitle("Owner Name:");
        this.addText(this.toPrint.ownerName);
        */
        this.printAlias();
        this.printBoatsOwned();
        this.printHistoricalRecord();
        
        this.doc.save('Owner_1.pdf');
      },
      addText(text){
        this.doc.setFontSize(9);
        this.doc.text(text, 50, this.textpos);
        this.textpos+=20;
      },
      addTitle(title){
        this.doc.setFontSize(10);
        this.doc.text(title, 40, this.textpos);
        this.textpos+=20;
      },
      printHistoricalRecord(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Historic Record', 'Reference']],
        body: this.toPrint.historicRecords});

        this.textpos = this.doc.lastAutoTable.finalY+20;
      },
      printBoatsOwned(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Boats Owned:']],
        body: this.toPrint.boatsOwned});

        this.textpos = this.doc.lastAutoTable.finalY+20;
      },
      printAlias(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Alias:']],
        body: this.toPrint.alias});

        this.textpos = this.doc.lastAutoTable.finalY+20;
      }
      
    },
    watch: {
        textpos(newVal){
            if (newVal >= 800)
                this.doc.addPage();
        }
    }
}
</script>