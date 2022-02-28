import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';

export const burialsRouter = express.Router();
const db = knex(DB_CONFIG);

burialsRouter.get(
	'/',
	[
		query('page').default(0).isInt(),
		query('limit').default(10).isInt({ gt: 0 }),
	],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { 
			textToMatch = '', 
			sortBy = 'LastName', 
			sort = 'asc', 
			BirthYear = '',
			BirthMonth = '',
			BirthDay = '',
			DeathYear = '',
			DeathMonth = '',
			DeathDay = '',
			Gender = '',
			Cause = '',
			Manner = '',
			Cemetary = '',
			OriginCountry = ''  } = req.query;

			console.log(BirthYear);
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		let burials = [];

			burials = await db
					.select(
						'BUR.BurialID',
						'BUR.LastName',
						'BUR.FirstName',
						'BUR.Gender',
						'BUR.GenderOther',
						'BUR.BirthYear',
						'BUR.BirthMonth',
						'BUR.BirthDay',
						'BUR.BirthDateNotes',
						'BUR.DeathYear',
						'BUR.DeathMonth',
						'BUR.DeathDay',
						'BUR.DeathDateNotes',
						'BUR.Age',
						'BUR.Manner',
						'CL.Cause',
						'CE.Cemetary',
						'BUR.OtherCemetaryDesc',
						'BUR.PlotDescription',
						'BUR.ShippedIndicator',
						'BUR.DestinationShipped',
						'BUR.FuneralPaidBy',
						'BUR.OriginCity',
						'BUR.OriginState',
						'BUR.OriginCountry',
						'BUR.OtherCountry',
						'BUR.PersonNotes',
						'RE.Religion'
						)
					.from('Burial.Burial as BUR')	
					.leftJoin('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID')
					.leftJoin('Burial.CemetaryLookup as CE', 'CE.CemetaryLUpID', '=', 'BUR.CemetaryID')
					.leftJoin('Burial.ReligionLookup as RE', 'RE.ReligionLUpID', '=', 'BUR.ReligionID')
					.where('BUR.FirstName', 'like', `%${textToMatch}%`)
					.andWhere('BUR.LastName', 'like', `%${textToMatch}%`)
					.andWhere('BUR.Gender', 'like', `%${Gender}%`)
					.andWhere('BUR.BirthYear', 'like', `%${BirthYear}%`)
					.andWhere('BUR.BirthMonth', 'like', `%${BirthMonth}%`)
					.andWhere('BUR.BirthDay', 'like', `%${BirthDay}%`)
					.andWhere('BUR.DeathYear', 'like', `%${DeathYear}%`)
					.andWhere('BUR.DeathMonth', 'like', `%${DeathMonth}%`)
					.andWhere('BUR.DeathDay', 'like', `%${DeathDay}%`)
					.andWhere('BUR.Manner', 'like', `%${Manner}%`)
					.andWhere('CL.Cause', 'like', `%${Cause}%`)
					.andWhere('CE.Cemetary', 'like', `%${Cemetary}%`)
					//.orWhere('BUR.OtherCemetaryDesc', 'like', `%${OtherCemetaryDesc}%`)
					//.orWhere('BUR.OriginCity', 'like', `%${OriginCity}%`)
					//.orWhere('BUR.OriginState', 'like', `%${OriginState}%`)
					.andWhere('BUR.OriginCountry', 'like', `%${OriginCountry}%`)
					//.orWhere('BUR.OtherCountry', 'like', `%${OtherCountry}%`)
					.orderBy(`${sortBy}`, `${sort}`)
					.limit(limit)
					.offset(offset);

		res.status(200).send({ count: burials.length, body: burials });
	}
);

burialsRouter.get(
	'/:burialId',
	[param('burialId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { burialId } = req.params;
		const burial = await db
			.select("BUR.*")
			.from('Burial.Burial as BUR')
			.where('BUR.BurialID', burialId)
			.first();
			/*
			.select(
				'BUR.BurialID',
				'BUR.LastName',
				'BUR.FirstName',
				'BUR.Gender',
				'BUR.GenderOther',
				'BUR.BirthYear',
				'BUR.BirthMonth',
				'BUR.BirthDay',
				'BUR.BirthDateNotes',
				'BUR.DeathYear',
				'BUR.DeathMonth',
				'BUR.DeathDay',
				'BUR.DeathDateNotes',
				'BUR.Age',
				'BUR.Manner',
				'CL.Cause',
				'CE.Cemetary',
				'BUR.OtherCemetaryDesc',
				'BUR.PlotDescription',
				'BUR.ShippedIndicator',
				'BUR.DestinationShipped',
				'BUR.FuneralPaidBy',
				'BUR.OriginCity',
				'BUR.OriginState',
				'BUR.OriginCountry',
				'BUR.OtherCountry',
				'BUR.PersonNotes',
				'RE.Religion'
				)
			.from('Burial.Burial as BUR')
			.where('BUR.BurialID', burialId)
			.join('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID')
			.join('Burial.CemetaryLookup as CE', 'CE.CemetaryLUpID', '=', 'BUR.CemetaryID')
			.join('Burial.ReligionLookup as RE', 'RE.ReligionLUpID', '=', 'BUR.ReligionID')
			.first();
			*/

		if (!burial) {
			res.status(403).send('Burial not found');
			return;
		}

		burial.Cause = await db
			.select('CL.*').from('Burial.Burial as BUR')
			.join('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID').first();

		burial.Cemetary = await db
			.select('CL.*').from('Burial.Burial as BUR')
			.join('Burial.CemetaryLookup as CL', 'CL.CemetaryLUpID', '=', 'BUR.CemetaryID').first();

		burial.Religion = await db
			.select('CL.*').from('Burial.Burial as BUR')
			.join('Burial.ReligionLookup as CL', 'CL.ReligionLUpID', '=', 'BUR.ReligionID').first();

		burial.Occupations = await db
			.select('OC.*', 'BOC.*').from('Burial.Occupation AS BOC')
			.where('BOC.BurialID', burialId)
			.join('Burial.OccupationLookup as OC', 'OC.OccupationLUpID', '=', 'BOC.OccupationID');

		burial.Memberships = await db
			.select('ML.*', 'MEM.Chapter', 'MEM.Notes', 'MEM.ID').from('Burial.Membership AS MEM')
			.where('MEM.BurialID', burialId)
			.join('Burial.MembershipLookup as ML', 'ML.MembershipLUpID', '=', 'MEM.MembershipID');

		burial.SiteVisits = await db
			.select('*').from('Burial.SiteVisit')
			.where('Burial.SiteVisit.BurialID', burialId);

		burial.Kinships = await db
			.select('KIN.*', 'REL.*').from('Burial.NOKin AS KIN')
			.where('KIN.BurialID', burialId)
			.join('Burial.RelationLookup as REL', 'REL.RelationLUpID', '=', 'KIN.RelationshipID');
		
		burial.Sources = await db
			.select('SO.*').from('Burial.Source AS SO')
			.where('SO.BurialID', burialId);


		res.status(200).send(burial);
	}
);


// changed this route from "/new" to "/" to follow RESTFUL conventions
burialsRouter.post('/', async (req: Request, res: Response) => {
	/*   const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403);
   */
	const {
		burial = {},
	} = req.body;

	const { Cemetaries, Causes, Religions, Occupations, Memberships, SiteVisits, Kinships } = burial;

	//let 
	const response = await db
		.insert(burial)
		.into('Burial.Burial')
		.returning('*')
		.then(async (rows: any) => {
			const newBurial = rows[0];
/*
			if(ownerNewArray.length) {
				const newOwners = ownerNewArray.map((owner: any) => ({
					...owner,
					BoatId: newBoat.Id,
				}));

				await db
					.insert(newOwners)
					.into('boat.boatowner')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});
			}

			//Add the new past names (done)
			await db
				.insert(
					pastNamesNewArray.map((name: any) => ({
						BoatId: newBoat.Id,
						...name,
					}))
				)
				.into('boat.pastnames')
				.then((rows: any) => {
					return rows;
				});

			if (histories.length) {
				const newHistories = histories.map((history: any) => ({
					...history,
					UID: newBoat.Id,
				}));
				await db
					.insert(newHistories)
					.into('boat.history')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});
			}
*/
			return newBurial;
		});

	res.send(response);
});

burialsRouter.put('/:burialId', async (req: Request, res: Response) => {
	//const db = req.app.get('db');

	const {
		burial = {},
		Memberships, 
		SiteVisits, 
		Kinships,
		Occupations,
		Sources
	} = req.body;
	const { burialId } = req.params;

	//burial.CauseID
	//console.log("SiteVisits",SiteVisits);


	let resp = await db('Burial.Burial').update(burial).where('Burial.Burial.BurialID', burialId);
	if(!resp){
		res.status(404).send({ message: 'Burial not found'})
	}
	//console.log(Occupations.filter((x: any) => x.edited == true).map((x: any) => ({ BurialID: burialId, OccupationID: x.OccupationID })));

	//OCCUPATIONS
	await db
		.insert(Occupations.filter((x: any) => x.new == true && !x.deleted).map((x: any) => ({ BurialID: burialId, OccupationID: x.OccupationLupID })))
		.into('Burial.Occupation')
		.then((rows: any) => {
			return rows;
		});

	const deletedOccupations = Occupations.filter((x: any) => x.deleted == true).map((x: any) => ({ BurialID: burialId, OccupationID: x.OccupationID, ID: x.ID }));
	for( const item of deletedOccupations ){
		await db('Burial.Occupation')
		.where('Burial.Occupation.ID', item.ID).del();
	}

	const editOccupations = Occupations.filter((x: any) => x.edited == true && x.deleted == undefined).map((x: any) => ({ BurialID: burialId, OccupationID: x.OccupationID, ID: x.ID }));
	//console.log("occupations to edit",editOccupations);
	for( const item of editOccupations ){
		await db('Burial.Occupation')
		.update({ BurialID: burialId, OccupationID: item.OccupationID })
		.where('Burial.Occupation.ID', item.ID);
	}	
	

	//MEMBERSHIPS
	await db
		.insert(Memberships.filter((x: any) => x.new == true).map((x: any) => ({ BurialID: burialId, MembershipID: x.MembershipLUpID, Chapter: x.Chapter, Notes: x.Notes })))
		.into('Burial.Membership')
		.then((rows: any) => {
			return rows;
		});
	
	const deletedMemberships = Memberships.filter((x: any) => x.deleted == true).map((x: any) => ({ BurialID: burialId, ID: x.ID }));
	for( const item of deletedMemberships ){
		await db('Burial.Membership')
		.where('Burial.Membership.ID', item.ID).del();
	}

	const editMemberships = Memberships.filter((x: any) => x.edited == true && x.deleted == undefined).map((x: any) => ({ BurialID: burialId, MembershipID: x.MembershipLUpID, Chapter: x.Chapter, Notes: x.Notes, ID: x.ID }));
	for( const item of editMemberships ){
		await db('Burial.Membership')
		.update({ BurialID: burialId, MembershipID: item.MembershipLUpID, Chapter: item.Chapter, Notes: item.Notes })
		.where('Burial.Membership.ID', item.ID);
	}
	
	//KINSHIPS
	await db
		.insert(Kinships.filter((x: any) => x.new == true).map((x: any) => ({ BurialID: burialId, RelationshipID: x.RelationshipID, Quantity: x.Quantity, Name: x.Name, Location: x.Location })))
		.into('Burial.NOKin')
		.then((rows: any) => {
			return rows;
		});

	const deletedKinships = Kinships.filter((x: any) => x.deleted == true).map((x: any) => ({ BurialID: burialId, ID: x.NOKID }));
	for( const item of deletedKinships ){
		await db('Burial.NOKin')
		.where('Burial.NOKin.NOKID', item.ID).del();
	}

	const editKinships = Kinships.filter((x: any) => x.edited == true && x.deleted == undefined).map((x: any) => ({ BurialID: burialId, RelationshipID: x.RelationshipID, Quantity: x.Quantity, Name: x.Name, Location: x.Location, ID: x.NOKID }));
	for( const item of editKinships ){
		await db('Burial.NOKin')
		.update({ BurialID: burialId, RelationshipID: item.RelationshipID, Quantity: item.Quantity, Name: item.Name, Location: item.Location })
		.where('Burial.NOKin.NOKID', item.ID);
	}



	//SITE VISITS
	await db
		.insert(SiteVisits.filter((x: any) => x.new == true).map((x: any) => ({ BurialID: burialId, VisitYear: x.VisitYear, Condition: x.Condition, MarkerDescription: x.MarkerDescription, Inscription: x.Inscription, RecordedBy: x.RecordedBy })))
		.into('Burial.SiteVisit')
		.then((rows: any) => {
			return rows;
		});
	
	const deletedSiteVisits = SiteVisits.filter((x: any) => x.deleted == true).map((x: any) => ({ BurialID: burialId, ID: x.SiteVisitID }));
	for( const item of deletedSiteVisits ){
		await db('Burial.SiteVisit')
		.where('Burial.SiteVisit.SiteVisitID', item.ID).del();
	}

	const editSiteVisits = SiteVisits.filter((x: any) => x.edited == true && x.deleted == undefined).map((x: any) => ({ BurialID: burialId, VisitYear: x.VisitYear, Condition: x.Condition, MarkerDescription: x.MarkerDescription, Inscription: x.Inscription, RecordedBy: x.RecordedBy , ID: x.SiteVisitID }));
	for( const item of editSiteVisits ){
		await db('Burial.SiteVisit')
		.update({ BurialID: burialId, VisitYear: item.VisitYear, Condition: item.Condition, MarkerDescription: item.MarkerDescription, Inscription: item.Inscription, RecordedBy: item.RecordedBy  })
		.where('Burial.SiteVisit.SiteVisitID', item.ID);
	}
	
	//SOURCES
	await db
		.insert(Sources.filter((x: any) => x.new == true).map((x: any) => ({ BurialID: burialId, Source: x.Source })))
		.into('Burial.Source')
		.then((rows: any) => {
			return rows;
		});

	const deletedSources = Sources.filter((x: any) => x.deleted == true).map((x: any) => ({ BurialID: burialId, Source: x.Source, ID: x.SourceID }));
	for( const item of deletedSources ){
		await db('Burial.Source')
		.where('Burial.Source.SourceID', item.ID).del();
	}

	const editSources = Sources.filter((x: any) => x.edited == true && x.deleted == undefined).map((x: any) => ({ BurialID: burialId, Source: x.Source, ID: x.SourceID }));
	for( const item of editSources ){
		await db('Burial.Source')
		.update({ BurialID: burialId, Source: item.Source })
		.where('Burial.Source.SourceID', item.ID);
	}

	res.status(200).send({ message: 'success' });
});
