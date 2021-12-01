<template>
<<<<<<< HEAD
  <v-dialog v-model="dialog" max-width="600" scrollable>
    <v-card>
      <v-card-title>Print {{ sitename }}</v-card-title>
      <v-card-text>
        <v-divider class="mb-4"></v-divider>
        <v-row>
          <v-col class="py-0" cols="6">
            <v-checkbox
              v-model="selectAll"
              dense
              label="Include all sections"
              @click="toggleAll()"
              hide-details
            ></v-checkbox>
          </v-col>
          <v-col
            class="py-0"
            cols="6"
            v-for="(item, i) in sections"
            :key="`dcheck-${i}`"
=======
    <v-dialog
      v-model="dialog"
      max-width="600"
      scrollable
    >
      <v-card>
        <v-card-title>Print {{sitename}}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row class="mt-2">
              <v-col class="pa-0" cols="6"  v-for="(item, i) in sections" :key="`dcheck-${i}`" >
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
>>>>>>> 6510c97e1d3a28bc93f7f10d8994fd40fdf8f7e6
          >
            <v-checkbox
              v-model="item.print"
              dense
              hide-details
              :label="`Include ${item.name}`"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" @click="doPrint" :disabled="hasChecks">
          Print
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="closeDialog"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import _ from 'lodash';
export default {
<<<<<<< HEAD
  props: ["dialog", "sitename"],
  data: () => ({
    selectAll: false,
    sections: [
      { name: "Summary", print: true },
      { name: "Location", print: false },
      { name: "Dates & Condition", print: false },
      { name: "Themes & Function", print: false },
      { name: "Associations", print: false },
      { name: "Legal & Zoning", print: false },
      { name: "Photos", print: false },
      { name: "Management", print: false },
      { name: "Description", print: false },
    ],
  }),
  computed: {
    hasChecks: function () {
      let test = this.sections.filter((s) => s.print);
      return test.length == 0;
    },
  },
  methods: {
    toggleAll() {
      let newVal = this.selectAll;

      this.sections.forEach((s) => (s.print = newVal));
    },
    doPrint() {
      this.$emit("closeDialog");
      this.$emit("showSuccess", "PRINTING COMPLETE");
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
=======
    props: [ 'dialog', 'sitename' ],
    data: () => ({
        sections: [{ name: 'Summary', print: false},
                  { name: 'Location', print: false},
                  { name: 'Dates & Condition', print: false},
                  { name: 'Themes & Function', print: false},
                  { name: 'Associations', print: false},
                  { name: 'Legal & Zoning', print: false},
                  { name: 'Photos', print: false},
                  { name: 'Management', print: false},
                  { name: 'Description', print: false}],
        doc: null,
        data: {
            associations:"associations",
            firstNationAssociations:"firstNationAssociations",
            dates:"dates",
            constructionPeriods:"constructionPeriods",
            buildingSize:"buildingSize",//
            conditionComment:"conditionComment",//
            floorCondition:"floorCondition",//
            resourceType:"resourceType",//
            roofCondition:"roofCondition",//
            siteStatus:"siteStatus",//
            wallCondition:"wallCondition",//
            descriptions:"descriptions",
            ownerships:"ownerships",
            previous_ownerships:"previous_ownerships",
            block:"block",//
            groupYHSI:"groupYHSI",//
            lAGroup:"lAGroup",//
            lot:"lot",//
            planNumber:"planNumber",//
            siteDistrictNumber:"siteDistrictNumber",//
            townSiteMapNumber:"townSiteMapNumber",//
            zoning:"zoning",//
            bordenNumber:"bordenNumber",//
            communityId:"communityId",
            coordinateDetermination:"coordinateDetermination",
            hectareArea:"hectareArea",
            latitude:"latitude",
            locationComment:"locationComment",
            locationContext:"locationContext",
            longitude:"longitude",
            nTSMapSheet:"nTSMapSheet",
            otherCommunity:"otherCommunity",
            otherLocality:"otherLocality",
            physicalAddress:"physicalAddress",
            physicalCountry:"physicalCountry",
            physicalPostalCode:"physicalPostalCode",
            physicalProvince:"physicalProvince",
            previousAddress:"previousAddress",
            revisionLogs:"revisionLogs",
            contacts:"contacts",
            webLinks:"webLinks",
            cIHBNumber:"cIHBNumber",
            doorCondition:"doorCondition",
            fHBRONumber:"fHBRONumber",
            jurisdiction:"jurisdiction",
            ownerConsent:"ownerConsent",
            recognitionDate:"recognitionDate",
            statute2Id:"statute2Id",
            statuteId:"statuteId",
            yGBuildingNumber:"yGBuildingNumber",
            yGReserveNumber:"yGReserveNumber",
            secondaryNames:"secondaryNames",
            historicalPatterns:"historicalPatterns",
            contributingResources:"contributingResources",
            category:"category",
            designations:"designations",
            primaryName:"primaryName",
            records:"records",
            showInRegister:"showInRegister",
            siteCategories:"siteCategories",
            yHSIId:"yHSIId",
            photos:"photos",
            themes:"themes",
            functionalUses:"functionalUses",
            currentUseComment:"currentUseComment",
            yHSPastUse:"yHSPastUse",
            yHSThemes:"yHSThemes",
        },
        associations: [
          "associations",
          "firstNationAssociations"
        ],
        dates:  [
              "dates",
              "constructionPeriods",
              "buildingSize",//
              "conditionComment",//
              "doorCondition",//
              "floorCondition",//
              "resourceType",//
              "roofCondition",//
              "siteStatus",//
              "wallCondition",//
            ],
        description: [
            "descriptions",
            ],
        legal:  [
            "ownerships",
            "previous_ownerships",
            "block",//
            "groupYHSI",//
            "lAGroup",//
            "lot",//
            "planNumber",//
            "siteDistrictNumber",//
            "townSiteMapNumber",//
            "zoning"//
                ],
        location:  [
            "bordenNumber",//
            "communityId",
            "coordinateDetermination",
            "hectareArea",
            "latitude",
            "locationComment",
            "locationContext",
            "longitude",
            "nTSMapSheet",
            "otherCommunity",
            "otherLocality",
            "physicalAddress",
            "physicalCountry",
            "physicalPostalCode",
            "physicalProvince",
            "previousAddress",
          ],
          management:  [
              "revisionLogs",
              "contacts",
              "webLinks",
              "cIHBNumber",
              "doorCondition",
              "fHBRONumber",
              "jurisdiction",
              "ownerConsent",
              "recognitionDate",
              "showInRegister",
              "statute2Id",
              "statuteId",
              "yGBuildingNumber",
              "yGReserveNumber",
                ],
          photos: [
              "photos"
            ],
          summary: [ 
              "secondaryNames",
              "historicalPatterns",
              "contributingResources",
              "category",
              "designations",
              "primaryName",
              "records",
              "showInRegister",
              "siteCategories",
              "yHSIId",
          ],
          themes: [ 
              "themes",
              "functionalUses",
              "currentUseComment",
              "yHSPastUse",
              "yHSThemes",
              ],
        toPrint: {}
    }),
    created(){
      this.mapData();
    },
    methods:{
      mapData(){
        this.toPrint.associations = _.pickBy(this.data, (value, key) => _.includes(this.associations, key));
        this.toPrint.dates = _.pickBy(this.data, (value, key) => _.includes(this.dates, key));
        this.toPrint.description = _.pickBy(this.data, (value, key) => _.includes(this.description, key));
        this.toPrint.legal = _.pickBy(this.data, (value, key) => _.includes(this.legal, key));
        this.toPrint.location = _.pickBy(this.data, (value, key) => _.includes(this.location, key));
        this.toPrint.management = _.pickBy(this.data, (value, key) => _.includes(this.management, key));
        this.toPrint.photos = _.pickBy(this.data, (value, key) => _.includes(this.photos, key));
        this.toPrint.summary = _.pickBy(this.data, (value, key) => _.includes(this.summary, key));
        this.toPrint.themes = _.pickBy(this.data, (value, key) => _.includes(this.themes, key));
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
        this.doc.text('Site_1', 40, 40);
        let textpos = 70; 
        let sections = Object.keys(this.toPrint);
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
  
        this.doc.save('Site_1.pdf');
        this.closeDialog();
      }
    }
}
>>>>>>> 6510c97e1d3a28bc93f7f10d8994fd40fdf8f7e6
</script>