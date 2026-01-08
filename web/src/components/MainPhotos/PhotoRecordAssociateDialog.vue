<template>
    <v-dialog v-model="dialog" persistent max-width="800px" @click:outside="reset()">
      <v-card>
        <v-card-title>
          <span class="text-h7">Associate Photo with Record</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="record"
                  :items="records"
                  label="Select Record"
                  required
                  clearable
                  @change="onRecordChange()"
                ></v-select>

                <v-autocomplete
                  v-model="query"
                  :items="items"
                  :loading="loading"
                  :label="'Search ' + (record ? record : 'Record')"
                  item-text="text"
                  item-value="value"
                  outlined
                  clearable
                  hide-details
                  return-object
                  @update:search-input="runSearch"
                />
              </v-col>
            </v-row>
            <v-row v-if="selectedRecord !== null">
              <v-card
                color="#fff2d5"
								class="mb-3"
              >
                <v-card-text>
                  <v-btn
										color="warning"
										x-small
										fab
										title="Remove"
										class="float-right"
										style="
											margin-top: -6px !important;
											margin-bottom: 0px !important;
										"
                    @click="selectedRecord = null"
									>
										<v-icon>mdi-close</v-icon>
									</v-btn>
                  <h3>Associating Photo with {{ record }}</h3>
                </v-card-text>

                <div v-if="record === 'place'" > 
                <v-text-field
									v-model="selectedRecord.primaryName"
									label="Primary Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
								<v-row class="mx-3">
									<v-text-field
										v-model="selectedRecord.yHSIId"
										label="YHSI Id"
										class="mb-4"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
									<v-text-field
										v-model="selectedRecord.communityName"
										label="Community"
										class="ml-3 mb-4"
										readonly
										dense
										outlined
										background-color="white"
										hide-details
									></v-text-field>
								</v-row>
                </div>
                <div v-if="record === 'boat'" > 
                  <v-text-field
									v-model="selectedRecord.Name"
									label="Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                </div>
                <div v-if="record === 'aircrash'" > 
                  <v-text-field
									v-model="selectedRecord.yacsinumber"
									label="YACSI Number"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                  <v-text-field
									v-model="selectedRecord.aircrafttype"
									label="Aircraft Type"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                  <v-text-field
									v-model="selectedRecord.aircrafttype"
									label="Aircraft Type"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                </div>
                <div v-if="record === 'ytplace'" > 
                  <v-text-field
									v-model="selectedRecord.name"
									label="Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                </div>
                <div v-if="record === 'burial'" > 
                  <v-text-field
									v-model="selectedRecord.FirstName"
									label="First Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                  <v-text-field
									v-model="selectedRecord.LastName"
									label="Last Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                </div>
                <div v-if="record === 'interpretive-sites'" > 
                  <v-text-field
									v-model="selectedRecord.SiteName"
									label="Site Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                </div>
                <div v-if="record === 'people'" > 
                  <v-text-field
									v-model="selectedRecord.GivenName"
									label="Given Name"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                  <v-text-field
									v-model="selectedRecord.Surname"
									label="Surname"
									class="mx-3"
									readonly
									dense
									outlined
									background-color="white"
								></v-text-field>
                </div>
              </v-card>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="close" class="black--text"> Close </v-btn>
          <v-spacer></v-spacer>
          <v-btn
					class="mx-1 form-header"
					color="secondary"
					@click="associatePhoto()"
          >
					<v-icon class="mr-1">mdi-check</v-icon>
					Associate Photo with this Record
				</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { mapActions, mapGetters } from 'vuex';

import { PHOTO_URL, PLACE_URL, YTPLACE_URL } from "../../urls";

import { api } from "../../controllers/config";

export default {
  data: () => ({
    dialog: false,
    fields: {},
    record: undefined,
    records: [
      { text: 'Site', value: 'place' },
      { text: 'Boat', value: 'boat' },
      { text: 'Aircrash', value: 'aircrash' },
      { text: 'Place', value: 'ytplace' },
      { text: 'Burial', value: 'burial' },
      { text: 'Interpretive Sites', value: 'interpretive-sites' },
      { text: 'People', value: 'people' },
    ],
    query: "",
    search: null,
    items: [],
    loading: false,
    selectedRecord: null,
  }),
  created(){
    this.loadProfile();
    this.loadPhoto();
  },
  computed: {
    ...mapGetters({
      currentUserId: 'profile/id',
    }),
  },
  methods: {
    show() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.reset();
    },
    onRecordChange() {
      this.query = "";
      this.items = [];
      this.selectedRecord = null;
    },
    async searchPlace(query){
      try {
        this.loading = true;
        const response = await axios.post(`${PLACE_URL}/search`, {
          query: { search: query },
          sortBy: [],
          sortDesc: [],
          page: 1,
          itemsPerPage: 20,
        })

        this.items = response.data.data.map(item => ({
          text: item.primaryName + " (" + item.yHSIId + ")",
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async searchBoat(query){
      try {
        this.loading = true;
        const response = await api.get(`/boats`, {
          params: {
            textToMatch: query,
          }
        })

        this.items = response.data.body.map(item => ({
          text: item.Name,
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async searchAircrash(query){
      try {
        this.loading = true;
        const response = await api.get(`/aircrash`, {
          params: {
            textToMatch: query,
          }
        })

        this.items = response.data.body.map(item => ({
          text: item.yacsinumber + " " + item.aircrafttype + " (" + item.aircraftregistration + ")",
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async searchYtplace(query){
      try {
        this.loading = true;
        const response = await axios.post(`${YTPLACE_URL}/search`, {
          query: { search: query },
          sortBy: [],
          sortDesc: [],
          page: 1,
          itemsPerPage: 20,
        })

        this.items = response.data.data.map(item => ({
          text: item.name,
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async searchBurial(query){
      try {
        this.loading = true;
        const response = await api.get(`/burials`, {
          params: {
            textToMatch: query,
          }
        })

        this.items = response.data.body.map(item => ({
          text: item.FirstName + " " + item.LastName,
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async searchInterpretiveSites(query){
      try {
        this.loading = true;
        const response = await api.get(`/interpretive-sites`, {
          params: {
            SiteName: query,
            page: 1,
            limit: 10,
          }
        })

        this.items = response.data.body.map(item => ({
          text: item.SiteName,
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async searchPeople(query){
      try {
        this.loading = true;
        const response = await api.get(`/people`, {
          params: {
            textToMatch: query,
          }
        })

        this.items = response.data.body.map(item => ({
          text: item.GivenName + " " + item.Surname,
          value: item
        }));
        console.log(this.items)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async runSearch(val) {
      if (!val) {
        this.items = [];
        return;
      }

      this.loading = true;
      try {
        switch (this.record) {
          case 'place':
            await this.searchPlace(val);
            break;
          case 'boat':
            await this.searchBoat(val);
            break;
          case 'aircrash':
            await this.searchAircrash(val);
            break;
          case 'ytplace':
            await this.searchYtplace(val);
            break;
          case 'burial':
            await this.searchBurial(val);
            break;
          case 'interpretive-sites':
            await this.searchInterpretiveSites(val);
            break;
          case 'people':
            await this.searchPeople(val);
            break;
          default:
            console.log("No search function for record: " + this.record);
            break;
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false;
      }
    },
    async loadPhoto() {
			try {
        this.loading = true;
        await axios
          .get(`${PHOTO_URL}/${localStorage.currentRowId}`)
          .then((resp) => {
            this.fields = resp.data.data;
          })
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
		},
    async associatePhoto() {
			// Use community to check that fields have been filled in (user can't save without filling out all required fields)
			if (!this.fields.communityId) {
				this.$store.commit(
					'alerts/setText',
					'Attributes must be filled in before associating a record with this photo'
				);
				this.$store.commit('alerts/setType', 'warning');
				this.$store.commit('alerts/setTimeout', 5000);
				this.$store.commit('alerts/setAlert', true);
        return
			}
      
			if (
        !confirm(
          'When you hit OK this photo will be associated with the selected record. Are you sure you want to associate this photo with the selected record?'
        )
      ) {
        return
      }

      let id = undefined
      switch (this.record) {
        case 'place':
          id = this.selectedRecord.id;
          break;
        case 'boat':
          id = this.selectedRecord.Id;
          break;
        case 'aircrash':
          id = this.selectedRecord.yacsinumber;
          break;
        case 'ytplace':
          id = this.selectedRecord.id;
          break;
        case 'burial':
          id = this.selectedRecord.BurialID;
          break;
        case 'interpretive-sites':
          id = this.selectedRecord.SiteID;
          break;
        case 'people':
          id = this.selectedRecord.PersonID;
          break;
      }
      
      await axios
        .post(
          `${PHOTO_URL}/${this.record}/link/${id}`,
          {
            linkPhotos: [this.fields]
          }
        )
        .then(() => {
          this.$router.push(`/photos`);
          this.$store.commit(
            'alerts/setText',
            'Photo associated with record successfully'
          );
          this.$store.commit('alerts/setType', 'success');
          this.$store.commit('alerts/setTimeout', 5000);
          this.$store.commit('alerts/setAlert', true);
        })
        .catch((err) => {
          this.$store.commit('alerts/setText', err);
          this.$store.commit('alerts/setType', 'warning');
          this.$store.commit('alerts/setTimeout', 5000);
          this.$store.commit('alerts/setAlert', true);
        });
		},
    reset() {
      this.dialog = false;
    },
    ...mapActions({
      loadProfile: 'profile/loadProfile',
    })  
  },
  watch: {
    query(newVal) {
      console.log("Query: ");
      console.log({newVal})
      if (newVal) {
        this.selectedRecord = newVal.value;
      }
      console.log(this.selectedRecord)
    }
  }
};
</script>
