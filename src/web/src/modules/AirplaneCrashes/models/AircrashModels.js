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
		this.Location = data.Location || '';
		this.accuracy = data.accuracy || '';
		this.aircraftaftercrashcaption = data.aircraftaftercrashcaption || '';
		this.aircraftcaption = data.aircraftcaption || '';
		this.aircraftregistration = data.aircraftregistration || '';
		this.aircrafttype = data.aircrafttype || '';
		this.comments = data.comments || '';
		this.crashdate = data.crashdate || '';
		this.crashlocation = data.crashlocation || '';
		this.descriptionofcrashevent = data.descriptionofcrashevent || '';
		this.extentofremainsonsite = data.extentofremainsonsite || '';
		this.fatalities = data.fatalities || '';
		this.injuries = data.injuries || '';
		this.inYukon = data.inYukon || '';
		this.lat = data.lat || '';
		this.long = data.long || '';
		this.militarycivilian = data.militarycivilian || '';
		this.nation = '';
		this.otherlocationsofremains = '';
		this.photographs = data.photographs || '';
		this.pilot = data.pilot || '';
		this.remainsonsite = data.remainsonsite || '';
		this.significanceofaircraft = data.significanceofaircraft || '';
		this.soulsonboard = data.soulsonboard = '';
		this.sources = data.sources || '';
		this.infoSources = data.infoSources || [];
		this.yacsiNumber = data.yacsiNumber || undefined;
		this.pilotfirstname = data.pilotfirstname || '';
		this.pilotlastname = data.pilotlastname || '';
		this.pilotrank = data.pilotrank || '';
		this.datenote = data.datenote || '';
		this.datedescriptor = data.datedescriptor || '';
	}
	AirrCrashLocation() {
		return new AirCrashLocation(this);
	}
}
