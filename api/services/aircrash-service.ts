import db from '@/db/db-client';

export class AircrashService {
	async getAll() {
		const sortBy = 'YACSINumber';
		const sort = 'asc';

		return await db.select('*').from('dbo.vAircrash').orderBy(`${sortBy}`, `${sort}`);
	}

	async getById(aircrashId: string) {
		const aircrash = await db
			.select('*')
			.from('dbo.vAircrash')
			.where('dbo.vAircrash.yacsinumber', aircrashId)
			.first();

		if (!aircrash) {
			return null;
		}

		aircrash.infoSources = await db
			.select('*')
			.from('AirCrash.InfoSource')
			.where('AirCrash.InfoSource.YACSINumber', aircrashId);

		return aircrash;
	}

	async doSearch(page: number, perPage: number, filters: any) {
		const {
			textToMatch = '',
			sortBy = 'yacsinumber',
			sort = 'asc',
			//yacsinumber = '',
			crashdate = '',
			aircrafttype = '',
			aircraftregistration = '',
			nation = '',
			militarycivilian = '',
			crashlocation = '',
			pilot = '',
			soulsonboard = '',
			injuries = '',
			fatalities = '',
		} = filters;

		// _TODO_ move into base-controller.ts
		const MAX_PER_PAGE = 1000;
		const limit = Math.max(1, Math.min(perPage, MAX_PER_PAGE));
		const offset = (page - 1) * limit;

		const aircrashes = await db
			.select('*')
			.from('dbo.vAircrash')
			.modify(function (builder) {
				if (textToMatch !== '') builder.where('yacsinumber', 'like', `%${textToMatch}%`);
				if (crashdate !== '') builder.where('crashdate', 'like', `%${crashdate}%`);
				if (aircrafttype !== '') builder.where('aircrafttype', 'like', `%${aircrafttype}%`);
				if (aircraftregistration !== '')
					builder.where('aircraftregistration', 'like', `%${aircraftregistration}%`);
				if (nation !== '') builder.where('nation', 'like', `%${nation}%`);
				if (militarycivilian !== '')
					builder.where('militarycivilian', 'like', `%${militarycivilian}%`);
				if (crashlocation !== '') builder.where('crashlocation', 'like', `%${crashlocation}%`);
				if (pilot !== '') {
					builder.where(function () {
						this.where('pilotfirstname', 'like', `%${pilot}%`).orWhere(
							'pilotlastname',
							'like',
							`%${pilot}%`
						);
					});
				}
				if (injuries !== '') builder.where('injuries', '=', `${injuries}`);
				if (fatalities !== '') builder.where('fatalities', '=', `${fatalities}`);
				if (soulsonboard !== '') builder.where('soulsonboard', '=', `${soulsonboard}`);
			})
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);

		return { count: aircrashes.length, body: aircrashes };
	}
}
