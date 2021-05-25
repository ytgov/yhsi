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
          { title: "Crash Date", key: "crashdate"},
          { title: "Aircraft Type", key: "aircrafttype"},
          { title: "Aircraft Registration", key: "aircraftregistration"},
          { title: "Nation", key: "nation"},
          { title: "Militarycivilian", key: "militarycivilian"},
          { title: "Crash Location", key: "crashlocation"},
          { title: "Remains on Site", key: "remainsonsite"},
          { title: "Extent of Remains on Site", key: "extentofremainsonsite"},
          { title: "Other Locations of Remains", key: "otherlocationsofremains"},
        //  { title: "pilot", key: "pilot"},
          { title: "Fatalities", key: "fatalities"}, 
          { title: "Description of Crashevent", key: "descriptionofcrashevent"},
          { title: "Comments", key: "comments"},
          { title: "Significance of Aircraft", key: "significanceofaircraft"}, 
        //  { title: "", key: "sources"},
          { title: "Is In Yukon?", key: "inyukon"},
          { title: "Souls on Board", key: "soulsonboard"},
          { title: "Injuries", key: "injuries"},
          { title: "Date Descriptor", key: "datedescriptor"},
          { title: "Date Note", key: "datenote"},
          { title: "Pilot Last Name", key: "pilotlastname"},
          { title: "Pilot First Name", key: "pilotfirstname"},
          { title: "Pilot Rank", key: "pilotrank"},
          { title: "Accuracy", key: "accuracy"},
        //  { title: "Aircraft Caption", key: "aircraftcaption"},
        //  { title: "Aircraftaftercrashcaption", key: "aircraftaftercrashcaption"},
          { title: "Location", key: "Location"},
        //  { title: "infoSources", key: "infoSources"},
        ]
    }),

    methods: {
        mapData(){
            let props = Object.getOwnPropertyNames(this.data);
            props = _.filter(props, x=> x != 'photographs' && x != 'sources '&& x != 'lat' && x != 'long');
            this.toPrint.general = _.pickBy(this.data, (value,key) => _.includes(props, key));

            //Prepares the missing data for display
            this.toPrint.general.inyukon = this.toPrint.general.inyukon == true ? 'Yes' : 'No';
            Object.keys(this.toPrint.general).map((key) => {
              this.toPrint.general[key] = this.toPrint.general[key] != null ? this.toPrint.general[key] : '';
            });
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
        
        this.printGeneral();
        //this.printPhotos();//not done yet...
        //this.printHistoricalRecord()
  
        this.doc.save(`Aircrash_${this.yacsinumber}.pdf`);
      },
      printGeneral(){
        for(let i = 0; i<this.fields.length; i++){
          this.addTitle(this.fields[i].title);
          this.addText(`${this.toPrint.general[this.fields[i].key]}`);
          //console.log(`{ title: "", key: "${keys[i]}"},`);
        }
      },
      addText(text){
        let strArr = this.doc.splitTextToSize(text, 550)
        this.doc.setFontSize(9);
        
        for(let i=0;i<strArr.length;i++){
          this.doc.text(strArr[i], 50, this.textpos);
          this.changePos(12);
        }
        this.changePos(8);
      },
      addTitle(title){
        this.doc.setFontSize(10);
        this.doc.text(title, 40, this.textpos);
        this.changePos(20);
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
      },
      changePos(val){
            if (this.textpos + val >= 790){
                this.doc.addPage();
                this.textpos = 50;
            }
            else{
              this.textpos+= val;
            }
                
      }
    },
    watch: {
        
    }
}
</script>