export class AirCrashLocation {
	constructor(data) {
		this.lat = data.lat || 0.0;
		this.long = data.long || 0.0;
		this.inYukon = data.inYukon || undefined;
		this.accuracy = data.accuracy || undefined;
		this.locationDesc = data.crashlocation || '';
	}
}

export class AircraftCrash {
	constructor(data) {
		this.Location = '';
		this.accuracy = '';
		this.aircraftaftercrashcaption = '';
		this.aircraftcaption = '';
		this.aircraftregistration = '';
		this.aircrafttype = '';
		this.comments = '';
		this.crashdate = '';
		this.crashlocation = '';
		this.descriptionofcrashevent = '';
		this.extentofremainsonsite = '';
		this.fatalities = '';
		this.injuries = '';
		this.inYukon = '';
		this.lat = '';
		this.long = '';
		this.militarycivilian = '';
		this.nation = '';
		this.otherlocationsofremains = '';
		this.photographs = '';
		this.pilot = '';
		this.remainsonsite = '';
		this.significanceofaircraft = '';
		this.soulsonboard = '';
		this.sources = '';
		this.infoSources = [];
		this.yacsiNumber = data.yacsiNumber || undefined;
		this.pilotfirstname = '';
		this.pilotlastname = '';
		this.pilotrank = '';
		this.datenote = '';
		this.datedescriptor = '';
	}
	AirrCrashLocation() {
		return new AirCrashLocation(this);
	}
}
