<template>
    <v-dialog
      v-model="dialog"
      max-width="600"
      scrollable
    >
      <v-card>
        <v-card-title>Print {{photoname}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row class="mt-2">
              <v-col class="pa-0" cols="6" v-for="(item, i) in sections" :key="`dcheck-${i}`">
                <v-checkbox 
                  v-model="item.print"
                  :label="`Include ${item.name}?`"
                  class="ma-0 pa-0"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary darken-1"
            text
            @click="closeDialog"
          >
            Close
          </v-btn>
          <v-btn
            color="primary darken-1"
            text
            @click="exportPDF"
          >
            Print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { jsPDF } from "jspdf";
//import 'jspdf-autotable';
import _ from 'lodash';
export default {
    props: [ 'dialog', 'photoname' ],
    data: () => ({
        doc: null,
        sections: [{ name: 'Feature', print: false},
                  { name: 'Site Record', print: false},
                  { name: 'Historic Sites', print: false},
                  { name: 'Photo', print: false},],
        data: {
            address: "address",//
            communityId: 0,//
            communityName: "communityName",//
            featureName: "featureName",//
            location: "location",//
            nTSMapNumber: "nTSMapNumber",//
            otherOrNoRecord: false,
            archivalRecord: "archivalRecord",//
            bordenRecord: "bordenRecord",//
            paleoRecord: "paleoRecord",//
            yHSIRecord: "yHSIRecord",//
            creator: "creator",//
            dateCreated: "dateCreated",//
            originalMediaId: 'originalMediaId',//
            originalRecord: "originalRecord",//
            program: 'program',//
            photo: null,
            caption: "caption",//
            comments: "comments",//
            copyright: "copyright",//
            creditLine: "creditLine",//
            isComplete: false,//
            ownerId: "ownerId",//
            photoProjectId: "photoProjectId",//
            subjects: "subjects",//
        },
        feature: [
            "address",
            "communityId",
            "communityName",
            "featureName",
            "location",
            "nTSMapNumber"
          ],
        
        sitesRecord: 
            [ "otherOrNoRecord",
              "archivalRecord",//
              "bordenRecord",//
              "paleoRecord",//
              "yHSIRecord"//
            ]
        ,
        historicSites: [
            "creator",//
            "dateCreated",//
            "location",//
            'originalMediaId',//
            "originalRecord",//
            'photoProjectId',//
            'program',//
        ],
        photo: [
            "photo",
            "caption",//
            "comments",//
            "copyright",//
            "creditLine",//
            "isComplete",//
            "ownerId",//
            "photoProjectId",//
            "subjects",//
        ],
        toPrint: {}
    }),
    created(){
      this.mapData();
    },
    methods:{
      mapData(){
        this.toPrint.feature = _.pickBy(this.data, (value, key) => _.includes(this.feature, key));
        this.toPrint.sitesRecord = _.pickBy(this.data, (value, key) => _.includes(this.sitesRecord, key));
        this.toPrint.historicSites = _.pickBy(this.data, (value, key) => _.includes(this.historicSites, key));
        this.toPrint.photo = _.pickBy(this.data, (value, key) => _.includes(this.photo, key));
      },
      closeDialog(){
        this.$emit('closeDialog');
      },
      checkRemainingSize(textpos){
        if (textpos >= 800){
          this.doc.addPage();
          return 40;
        }
        else{
          return textpos+20;
        }
      },
      exportPDF() {
        this.doc = new jsPDF('p', 'pt');
        this.doc.text('Photo_1', 40, 40);
        let textpos = 70; 
        let sections = Object.keys(this.toPrint);
        //console.log(sections);
        for(let k = 0; k<sections.length; k++){
            if(this.sections[k].print == true){
            textpos = this.checkRemainingSize(textpos);
            this.doc.setFontSize(14);
            this.doc.text(this.sections[k].name, 40, textpos);
            textpos = this.checkRemainingSize(textpos);
            let data = Object.values(this.toPrint[sections[k]]);
            let cols = Object.keys(this.toPrint[sections[k]]);
            //console.log(textpos);
            for(let i = 0; i<data.length; i++){
              this.doc.setFontSize(10);
              this.doc.text(`${cols[i].toUpperCase()}`, 40, textpos);
              textpos = this.checkRemainingSize(textpos);
              this.doc.setFontSize(9);
              this.doc.text(`${data[i]}`, 40, textpos);
              textpos = this.checkRemainingSize(textpos);
            } 
          } 
        }
  
        this.doc.save('Photo_1.pdf');
        this.closeDialog();
      }
    }

}
</script>