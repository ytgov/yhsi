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
		const { textToMatch = '', sortBy = 'LastName', sort = 'asc' } = req.query;
		const filters = { FirstName: 'Abb'};
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		let counter = [{ count: 0 }];
		let burials = [];
// filter by names, birth and death dates, gender, cause and manner of death, cemetery, other location, country of origin
		if (textToMatch || filters) {
			console.log(filters);
			counter = await db
				.from('Burial.Burial')
				.where('FirstName', 'like', `%${textToMatch}%`)
                .orWhere('LastName', 'like', `%${textToMatch}%`)
                .orWhere('Gender', 'like', `%${textToMatch}%`)
                .orWhere('BirthYear', 'like', `%${textToMatch}%`)
                .orWhere('DeathYear', 'like', `%${textToMatch}%`)
                .orWhere('Manner', 'like', `%${textToMatch}%`)
                .orWhere('CauseID', 'like', `%${textToMatch}%`)
                .orWhere('CemetaryID', 'like', `%${textToMatch}%`)
                .orWhere('OtherCemetaryDesc', 'like', `%${textToMatch}%`)
				.orWhere('OriginCity', 'like', `%${textToMatch}%`)
				.orWhere('OriginState', 'like', `%${textToMatch}%`)
				.orWhere('OriginCountry', 'like', `%${textToMatch}%`)
				.orWhere('OtherCountry', 'like', `%${textToMatch}%`)
				// test below
				.andWhere('FirstName', 'like', `%${filters.FirstName}%`)
				/*
                .andWhere('LastName', 'like', `%${textToMatch}%`)
                .andWhere('Gender', 'like', `%${textToMatch}%`)
                .andWhere('BirthYear', 'like', `%${textToMatch}%`)
                .andWhere('DeathYear', 'like', `%${textToMatch}%`)
                .andWhere('Manner', 'like', `%${textToMatch}%`)
                .andWhere('CauseID', 'like', `%${textToMatch}%`)
                .andWhere('CemetaryID', 'like', `%${textToMatch}%`)
                .andWhere('OtherCemetaryDesc', 'like', `%${textToMatch}%`)
				.andWhere('OriginCity', 'like', `%${textToMatch}%`)
				.andWhere('OriginState', 'like', `%${textToMatch}%`)
				.andWhere('OriginCountry', 'like', `%${textToMatch}%`)
				.andWhere('OtherCountry', 'like', `%${textToMatch}%`)*/
				.count('BurialID', { as: 'count' });

			burials = await db
				.select('*')
				.from('Burial.Burial')
				.where('FirstName', 'like', `%${textToMatch}%`)
                .orWhere('LastName', 'like', `%${textToMatch}%`)
                .orWhere('Gender', 'like', `%${textToMatch}%`)
                .orWhere('BirthYear', 'like', `%${textToMatch}%`)
                .orWhere('DeathYear', 'like', `%${textToMatch}%`)
                .orWhere('Manner', 'like', `%${textToMatch}%`)
                .orWhere('CauseID', 'like', `%${textToMatch}%`)
                .orWhere('CemetaryID', 'like', `%${textToMatch}%`)
                .orWhere('OtherCemetaryDesc', 'like', `%${textToMatch}%`)
				.orWhere('OriginCity', 'like', `%${textToMatch}%`)
				.orWhere('OriginState', 'like', `%${textToMatch}%`)
				.orWhere('OriginCountry', 'like', `%${textToMatch}%`)
				.orWhere('OtherCountry', 'like', `%${textToMatch}%`)
				.andWhere('FirstName', 'like', `%${filters.FirstName}%`)
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db.from('Burial.Burial').count('BurialID', { as: 'count' });

			burials = await db
				.select('*')
				.from('Burial.Burial')
				.orderBy(`${sortBy}`, `${sort}`)
				.limit(limit)
				.offset(offset);
		}
/*
		for (const boat of boats) {
			boat.owners = await db
				.select('boat.boatowner.currentowner', 'boat.Owner.OwnerName')
				.from('boat.boatowner')
				.join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
				.where('boat.boatowner.boatid', boat.Id);
		}
		*/

		res.status(200).send({ count: counter[0].count, body: burials });
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
			.select('CL.Cause').from('Burial.Burial as BUR')
			.join('Burial.CauseLookup as CL', 'CL.CauseLUpID', '=', 'BUR.CauseID').first();
		//burial.Cause = Cause;

		burial.Cemetary = await db
			.select('CL.Cemetary').from('Burial.Burial as BUR')
			.join('Burial.CemetaryLookup as CL', 'CL.CemetaryLUpID', '=', 'BUR.CemetaryID').first();
		//burial.Cemetary = Cemetary;

		burial.Religion = await db
			.select('CL.Religion').from('Burial.Burial as BUR')
			.join('Burial.ReligionLookup as CL', 'CL.ReligionLUpID', '=', 'BUR.ReligionID').first();
		//burial.Religion = Religion;

		burial.Occupations = await db
			.select('OC.*').from('Burial.Occupation AS BOC')
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


		res.status(200).send(burial);
	}
);
/*
    [CemetaryID] smallint,
    [OtherCemetaryDesc] varchar,
    [PlotDescription] varchar,
    [ShippedIndicator] varchar,
    [DestinationShipped] varchar,
    [FuneralPaidBy] varchar,
    [OriginCity] varchar,
    [OriginState] varchar,
    [OriginCountry] varchar,
    [OtherCountry] varchar,
    [PersonNotes] varchar,
    [ReligionID] smallint,
	*/

// changed this route from "/new" to "/" to follow RESTFUL conventions
burialsRouter.post('/', async (req: Request, res: Response) => {
	/*   const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403);
   */
	const {
		boat = {},
		ownerNewArray = [],
		histories = [],
		pastNamesNewArray = [],
	} = req.body;

	const response = await db
		.insert(boat)
		.into('boat.boat')
		.returning('*')
		.then(async (rows: any) => {
			const newBoat = rows[0];

			if (ownerNewArray.length) {
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

			return newBoat;
		});

	res.send(response);
});

burialsRouter.put('/:boatId', async (req: Request, res: Response) => {
	/*  const db = req.app.get('db');
   const permissions = req.decodedToken['yg-claims'].permissions;
   if (!permissions.includes('edit')) res.sendStatus(403);
  */
	const {
		boat = {},
		ownerNewArray = [],
		ownerRemovedArray = [],
		pastNamesNewArray = [],
		pastNamesEditArray = [],
	} = req.body;
	const { boatId } = req.params;
	//make the update

	await db('boat.boat').update(boat).where('boat.boat.id', boatId);

	//Add the new owners (done)
	await db
		.insert(ownerNewArray.map((owner: any) => ({ BoatId: boatId, ...owner })))
		.into('boat.boatowner')
		.then((rows: any) => {
			return rows;
		});

	//remove the previous owners (done)
	for (const obj of ownerRemovedArray) {
		await db('boat.boatowner').where('boat.boatowner.ownerid', obj.id).del();
	}

	//update the past names (seems to work!)
	for (const obj of pastNamesEditArray) {
		await db('boat.pastnames')
			.update({ BoatName: obj.BoatName })
			.where('boat.pastnames.Id', obj.Id)
			.andWhere('boat.pastnames.BoatId', boatId);
	}

	//Add the new past names (done)
	await db
		.insert(pastNamesNewArray.map((name: any) => ({ BoatId: boatId, ...name })))
		.into('boat.pastnames')
		.then((rows: any) => {
			return rows;
		});

	res.status(200).send({ message: 'success' });
});
