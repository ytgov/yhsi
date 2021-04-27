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
import _ from 'lodash';
export default {
    name: "printButton",
    props: ["name","data" ],
    components: {  },
    data: ()=> ({
        doc: null,
        sections: [
            {name: "General", print: false},
            {name: "Photos", print: false},
            {name: "HistoricRecords", print: false},
        ],
        toPrint: {},
        textpos: 0,
    }),

    methods: {
        mapData(){
            let props = Object.getOwnPropertyNames(this.data);
            props = _.filter(props, x=> x != 'photos' && x != 'historicRecords');
            this.toPrint.general = _.pickBy(this.data, (value,key) => _.includes(props, key));
            this.toPrint.photos = this.data.photos;

            this.toPrint.historicRecords = [];
            let hR = this.data.histories;
            
            this.toPrint.historicRecords = hR.map( x => { return Object.values(x)});

            //let names = this.toPrint.general.names;
            //this.toPrint.general.names = names.map(x =>{ return [x] });
            //console.log(this.toPrint.names);
            /*
            for(let i = 0; i<names.length; i++){
              this.toPrint.general.names.push([names[i]]);
            }
            
            let hs = {
              UID: 1,
              HistoryText: "",
              Reference: ""
            }*/

            let owners = this.toPrint.general.owners;
            this.toPrint.general.owners =  owners.map(x =>{ return [x] });
            console.log(this.toPrint.general.owners);
            /*
            for(let i = 0; i<owners.length; i++){
              this.toPrint.general.owners.push([owners[i]]);
            }*/
      },
      exportPDF() {
        this.mapData();

        this.doc = new jsPDF('p', 'pt');
        this.doc.text(`Boat: ${this.name}`, 40, 40);
        this.textpos = 70; 
        //let sections = Object.keys(this.toPrint);
        
        this.printGeneral();
        this.printPhotos();//not done yet...
        this.printHistoricalRecord()
  
        this.doc.save('Boat_1.pdf');
      },
      printGeneral(){
        this.printNames();
        this.printOwners();

        this.addTitle("Registration Number:");
        this.addText(this.toPrint.general.registrationNumber);

        this.addTitle("Construction Date:");
        this.addText(this.toPrint.general.constructionDate);

        this.addTitle("Service Start Date:");
        this.addText(this.toPrint.general.serviceStartDate);

        this.addTitle("Service End Date:");
        this.addText(this.toPrint.general.serviceEndDate);

        this.addTitle("Vessel Type:");
        this.addText(this.toPrint.general.vesselType);

        this.addTitle("Current Location Description:");
        this.addText(this.toPrint.general.currentLocationDescription);

        this.addTitle("Notes:");
        this.addText(this.toPrint.general.notes);

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
      printPhotos(){

      },
      printHistoricalRecord(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Historic Record', 'Reference']],
        body: this.toPrint.historicRecords});

        this.textpos = this.doc.lastAutoTable.finalY+20;
      },
      printNames(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Name/s:']],
        body: this.toPrint.general.names});

        this.textpos = this.doc.lastAutoTable.finalY+20;
      },
      printOwners(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Owner/s:']],
        body: this.toPrint.general.owners});

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