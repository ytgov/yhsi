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
            // we are no longer handling historic records on the owners view
            this.toPrint.ownerName = this.data.ownerName;
            
            //this.toPrint.historicRecords = this.data.historicRecords;
            //let hR = this.toPrint.historicRecords;
            //this.toPrint.historicRecords = hR.map( x => { return [x.HistoryText,x.Reference]});

            let alias = this.data.alias;
            this.toPrint.alias = alias.map( x => { return [x.Alias]});
            
            let boats = this.data.boats;
            this.toPrint.boats = boats.map( x => { return [x.RegistrationNumber,x.Name,x.VesselType,x.CurrentLocation]});
      },
      exportPDF() {
        this.mapData();
        this.doc = new jsPDF('p', 'pt');
        this.doc.text(`Owner: ${this.name}`, 40, 40);
        this.textpos = 70; 

        this.printAlias();
        this.printBoatsOwned();
        //this.printHistoricalRecord();
        
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
        head: [['Registration Number','Boats Name','Vessel Type', 'CurrentLocation']],
        body: this.toPrint.boats});

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