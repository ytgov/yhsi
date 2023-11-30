import aircrash from '@/controllers/aircrash';

import { AircraftCrash } from '../models/AircrashModels';

console.log(aircrash);

const store = {
	state: {
		airCrash: new AircraftCrash({}),
		oldAirCrash: null,
		// Define your state properties here
	},
	getters: {
		// Define your getters here
	},
	mutations: {
		SETAIRCRASH: null,
		// Define your mutations here
	},
	actions: {
		test: function () {
			return aircrash.test();
		},
		// saveCrash: () => {
		// 	// save the crash in state.airCrash
		// 	// this.overlay = true;
		// 	////console.log(this.fields);

		// 	//Mapping coordinate data
		// 	let { lat, long, inYukon, crashlocation, accuracy } =
		// 		this.modifiedMapFields;
		// 	this.fields.lat = lat;
		// 	this.fields.long = long;
		// 	this.fields.inYukon = inYukon;
		// 	this.fields.crashlocation = crashlocation;
		// 	this.fields.accuracy = accuracy;
		// 	//Mapping general fields
		// 	let crash = { ...this.fields };
		// 	crash.pilot = this.getPilotName();
		// 	crash.sources = this.getSources();
		// 	crash.Location = `POINT(${crash.long} ${crash.lat})`;

		// 	//Removing useless values
		// 	delete crash.pilotFirstName;
		// 	delete crash.pilotLastName;
		// 	delete crash.infoSources;
		// 	delete crash.sources;
		// 	delete crash.lat;
		// 	delete crash.long;
		// 	//Mapping infosources
		// 	let editedInfoSources = this.fields.infoSources.filter(
		// 		(x) => x.isEdited == true
		// 	);
		// 	let removedInfoSources = this.deletedSources;
		// 	let newInfoSources = this.fields.infoSources
		// 		.filter((x) => x.isNew == true)
		// 		.map((x) => ({ Type: x.Type, Source: x.Source }));
		// 	//Final data obj
		// 	let data = {
		// 		aircrash: crash,
		// 		removedInfoSources,
		// 		newInfoSources,
		// 		editedInfoSources,
		// 	};

		// 	if (this.mode == 'new') {
		// 		//console.log("api call");
		// 		let resp = await aircrash.post(data);
		// 		if (resp.response) {
		// 			if (resp.status == 409) {
		// 				this.$store.commit(
		// 					'alerts/setText',
		// 					'The Yacsi number already exists.'
		// 				);
		// 				this.$store.commit('alerts/setType', 'warning');
		// 				this.$store.commit('alerts/setTimeout', 5000);
		// 				this.$store.commit('alerts/setAlert', true);
		// 				this.overlay = false;
		// 			}
		// 		} else {
		// 			this.overlay = false;
		// 			this.$router.push(`/airplane/`);
		// 		}
		// 	} else {
		// 		await aircrash.put(localStorage.currentCrashNumber, data);
		// 		this.overlay = false;
		// 		this.mode = 'view';
		// 		this.$router.push({
		// 			name: 'airplaneView',
		// 			params: {
		// 				name: localStorage.currentCrashNumber,
		// 				yacsinumber: localStorage.currentCrashNumber,
		// 			},
		// 		});
		// 	}
		// },
		// },
		// getCrash: (id) => {

		// This is a stub for the getCrash action
		// This is where you would make an API call to get the crash
		// You would probably want to use a library like Axios to make the API call
		//
		// },
		// Define your actions here
	},
};

export default store;
