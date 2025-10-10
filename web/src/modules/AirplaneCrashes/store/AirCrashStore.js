import aircrash from '@/controllers/aircrash';

import { AircraftCrash } from '../models/AircrashModels';
import { InfoSource } from '../models/InfoSource';
const state = {
	airCrash: new AircraftCrash(),
	indexOfSourceBeingEdited: null,
	deletedSources: [],
	// Define your state properties here
};
const getters = {
	YACSINumber: (state) => {
		return state.airCrash.yacsinumber;
	},
	infoSources: (state) => {
		return state.airCrash.infoSources.filter((x) => x.status !== 'Deleted');
	},
	editedInfoSources: (state) => {
		return state.airCrash.infoSources
			.filter((x) => x.status === 'Edited')
			.map((x) => ({
				Type: x.Type,
				Source: x.Source,
				YACSINumber: x.YACSINumber,
				Id: x.Id,
			}));
	},
	newInfoSources: (state) => {
		return state.airCrash.infoSources
			.filter((x) => x.status === 'New')
			.map((x) => ({
				Type: x.Type,
				Source: x.Source,
				YACSINumber: x.YACSINumber,
			}));
	},
	removedInfoSources: (state) => {
		return state.deletedSources;
		// return state.airCrash.infoSources.filter((x) => x.status === 'Deleted');
		// .map((x) => ({ Type: x.Type, Source: x.Source }));
	},
	// Define your getters here
};
const mutations = {
	SET_AIRCRASH: (state, val) => {
		state.airCrash = new AircraftCrash(val);
	},
	deleteInfoSource(state, { item, index }) {
		if (state.airCrash.infoSources.length > 0) {
			if (item.status === 'New') {
				// We don't need to worry about updateing the database so
				//remove index from infoSources array.
				state.airCrash.infoSources.splice(index, 1);
			} else {
				//use splice to update the item in the array because Vuex can't detect
				// this: // state.airCrash.infoSources[index].status = 'Deleted';
				item.status = 'Deleted';
				state.deletedSources.push(item);
				// state.airCrash.infoSources.splice(index, 1, item);
				state.airCrash.infoSources.splice(index, 1);
			}
		}
		state.indexOfSourceBeingEdited = null;
	},
	upsertInfoSource(state, { item, index }) {
		if (index === undefined) {
			let m = state.airCrash.infoSources.push(item);
			console.log(m);
			state.indexOfSourceBeingEdited = m - 1;
		} else {
			if (!item.status) {
				item.status = 'Edited';
			}
			state.airCrash.infoSources.splice(index, 1, item);
			state.indexOfSourceBeingEdited = null;
		}
	},
	setEdit(state, payload) {
		state.indexOfSourceBeingEdited = payload;
	},
};
const actions = {
	addNewSource({ commit, getters }) {
		let item = new InfoSource({
			YACSINumber: getters.YACSINumber,
			Source: '',
			Type: 'Reference',
			status: 'New',
		});
		commit('upsertInfoSource', { item });
	},
	deleteSource({ item, index }) {
		console.log(item);
		console.log(index);

		// commit('deleteInfoSource', { item, index });
	},

	getAircrashByID: async ({ commit }, id) => {
		try {
			let airCrash = await aircrash.getById(id).then((data) => {
				commit('SET_AIRCRASH', data);
				return new AircraftCrash(data);
			});
			return airCrash;
		} catch (error) {
			console.log(error);
		}
	},

	setEmptyAircrash: async ({ commit }) => {
		let x = new AircraftCrash();
		commit('SET_AIRCRASH', x);
		return x;
	},
	saveAirCrash: async ({ state, commit }) => {
		// delete crash.pilotFirstName;
		// delete crash.pilotLastName;
		// delete crash.infoSources;
		// delete crash.sources;
		// delete crash.lat;
		// delete crash.long;

		try {
			let airCrash = await aircrash.save(state.airCrash);
			commit('SET_AIRCRASH', new AircraftCrash(airCrash));
		} catch (error) {
			console.log(error);
		}
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
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
