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
            if(this.data.owners){
              let owners = this.data.owners;
              this.toPrint.owners = [];
              for(let i = 0; i<owners.length; i++){
                this.toPrint.owners.push(Object.values(owners[i]));
              }
            }
            if(this.data.boats){
              let boats = this.data.boats;
              this.toPrint.boats = [];
              for(let i = 0; i<boats.length; i++){
                this.toPrint.boats.push(Object.values(boats[i]));
              }
            }
      },
      exportPDF() {
        this.mapData();

        this.doc = new jsPDF('p', 'pt');
        if(this.data.owners){
          this.doc.text(`Owners`, 40, 40);
          this.textpos = 70; 
          this.printOwners();
          this.doc.save('Owners.pdf');
        }
        else{
          this.doc.text(`Boats`, 40, 40);
          this.textpos = 70; 
          this.printBoats();
          this.doc.save('Boats.pdf');
        } 
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

      printOwners(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Owners:']],
        body: this.toPrint.owners});

        this.textpos = this.doc.lastAutoTable.finalY+20;
      },
      printBoats(){
        this.doc.autoTable({
        startY: this.textpos,
        head: [['Boats:']],
        body: this.toPrint.boats});

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