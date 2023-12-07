export class AirCrashLocation {
	constructor(data = {}) {
		this.lat = data.lat || 0.0;
		this.long = data.long || 0.0;
		this.inYukon = data.inYukon || undefined;
		this.accuracy = data.accuracy || undefined;
		this.locationDesc = data.crashlocation || '';
	}
}

export class AircraftCrash {
	constructor(data = {}) {
		this.lat = data.lat || '';
		this.long = data.long || '';
		this.Location = this.setLocation() || '';
		this.accuracy = data.accuracy || '';
		this.aircraftaftercrashcaption = data.aircraftaftercrashcaption || '';
		this.aircraftcaption = data.aircraftcaption || '';
		this.aircraftregistration = data.aircraftregistration || '';
		this.aircrafttype = data.aircrafttype || '';
		this.comments = data.comments || '';
		this.crashdate = this.formatCrashDate(data.crashdate) || '';
		this.crashlocation = data.crashlocation || '';
		this.descriptionofcrashevent = data.descriptionofcrashevent || '';
		this.extentofremainsonsite = data.extentofremainsonsite || '';
		this.fatalities = data.fatalities || '';
		this.injuries = data.injuries || '';
		this.inYukon = data.inYukon || '';

		this.militarycivilian = data.militarycivilian || '';
		this.nation = data.nation || '';
		this.otherlocationsofremains = '';
		this.photographs = data.photographs || '';
		this.pilotfirstname = data.pilotfirstname || '';
		this.pilotlastname = data.pilotlastname || '';
		this.pilot = this.pilotFullName() || '';
		this.pilotrank = data.pilotrank || '';
		this.remainsonsite = data.remainsonsite || '';
		this.significanceofaircraft = data.significanceofaircraft || '';
		this.soulsonboard = data.soulsonboard = '';
		this.infoSources = data.infoSources || [];
		this.yacsinumber = data.yacsinumber || undefined;
		this.datenote = data.datenote || '';
		this.datedescriptor = data.datedescriptor || '';
	}
	formatCrashDate(val) {
		if (!val) return '';
		return val.split('T')[0];
	}
	pilotFullName() {
		return [this.pilotlastname, this.pilotfirstname].join();
	}
	airCrashLocation() {
		return new AirCrashLocation(this);
	}
	setLocation() {
		return `POINT(${this.long} ${this.lat})`;
	}
}
