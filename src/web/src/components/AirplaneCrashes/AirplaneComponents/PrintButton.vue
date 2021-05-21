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
    props: ["yacsinumber","data" ],
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
        fields: [
          { title: "YACSI Number", key: "yacsinumber"},
          { title: "crashdate", key: "crashdate"},
          { title: "aircrafttype", key: "aircrafttype"},
          { title: "aircraftregistration", key: "aircraftregistration"},
          { title: "nation", key: "nation"},
          { title: "militarycivilian", key: "militarycivilian"},
          { title: "crashlocation", key: "crashlocation"},
          { title: "remainsonsite", key: "remainsonsite"},
          { title: "extentofremainsonsite", key: "extentofremainsonsite"},
          { title: "otherlocationsofremains", key: "otherlocationsofremains"},
          { title: "pilot", key: "pilot"},
          { title: "fatalities", key: "fatalities"}, 
          { title: "descriptionofcrashevent", key: "descriptionofcrashevent"},
          { title: "comments", key: "comments"},
          { title: "significanceofaircraft", key: "significanceofaircraft"}, 
          { title: "", key: "sources"},
          { title: "inyukon", key: "inyukon"},
          { title: "soulsonboard", key: "soulsonboard"},
          { title: "Injuries", key: "injuries"},
          { title: "Date Descriptor", key: "datedescriptor"},
          { title: "Date Note", key: "datenote"},
          { title: "Pilotlastname", key: "pilotlastname"},
          { title: "Pilotfirstname", key: "pilotfirstname"},
          { title: "Pilotrank", key: "pilotrank"},
          { title: "Accuracy", key: "accuracy"},
          { title: "Aircraftcaption", key: "aircraftcaption"},
          { title: "Aircraftaftercrashcaption", key: "aircraftaftercrashcaption"},
          { title: "Location Description", key: "Location"},
        //  { title: "infoSources", key: "infoSources"},
        ]
    }),

    methods: {
        mapData(){
            let props = Object.getOwnPropertyNames(this.data);
            props = _.filter(props, x=> x != 'photographs' && x != 'sources '&& x != 'lat' && x != 'long');
            this.toPrint.general = _.pickBy(this.data, (value,key) => _.includes(props, key));
            //this.toPrint.photos = this.data.photos;
            console.log(this.toPrint);
            /*
            this.toPrint.general.pastNames = this.toPrint.general.pastNames.map(x => {return [x.BoatName]});

            let owners = this.toPrint.general.owners;
            this.toPrint.general.owners =  owners.map(x =>{ return [x.OwnerName] });
            //console.log(this.toPrint.general.owners);
*/
      },
      exportPDF() {
        this.mapData();

        this.doc = new jsPDF('p', 'pt');
        this.doc.text(`Crash site: ${this.yacsinumber}`, 40, 40);
        this.textpos = 70; 
        //let sections = Object.keys(this.toPrint);
        
        //this.printGeneral();
        //this.printPhotos();//not done yet...
        //this.printHistoricalRecord()
  
        this.doc.save('Boat_1.pdf');
      },
      printGeneral(){

        let keys = Object.keys(this.toPrint.general);
        for(let i = 0; i<keys.length; i++){
          this.addTitle("Registration Number:");
          //this.addText();
          console.log(`{ title: "", key: "${keys[i]}"},`);
        }
        


        //this.printNames();
        //this.printOwners();
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
        body: this.toPrint.general.pastNames});

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