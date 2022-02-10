import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import { createThumbnail } from '../utils/image';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import multer from "multer";
import _ from "lodash";

export const photosExtraRouter = express.Router();
const db = knex(DB_CONFIG);

/*
//GET ALL AVAILABLE PHOTOS
photosExtraRouter.get('/', [query('page').default(0).isInt(), query('limit').default(10).isInt({ gt: 0 }),], ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { textToMatch } = req.query;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		let counter = [{ count: 0 }];
		let photos = [];

		if (textToMatch) {
			counter = await db
				.from('dbo.photo as PH')
				.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
				.join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
				.where('PH.FeatureName', 'like', `%${textToMatch}%`)
				.orWhere('PH.OriginalFileName', 'like', `%${textToMatch}%`)
				.orWhere('PH.Address', 'like', `%${textToMatch}%`)
				.orWhere('PH.Caption', 'like', `%${textToMatch}%`)
				.orWhere('CO.Name', 'like', `%${textToMatch}%`)
				.orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
				.count('RowId', { as: 'count' });

			photos = await db
				.column(
					'PH.*',
					{ CommunityName: 'CO.Name' },
					{ PlaceName: 'PL.PrimaryName' }
				)
				.select()
				.from('dbo.photo as PH')
				.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
				.join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
				.where('FeatureName', 'like', `%${textToMatch}%`)
				.orWhere('OriginalFileName', 'like', `%${textToMatch}%`)
				.orWhere('Address', 'like', `%${textToMatch}%`)
				.orWhere('Caption', 'like', `%${textToMatch}%`)
				.orWhere('CO.Name', 'like', `%${textToMatch}%`)
				.orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
				.orderBy('PH.RowId', 'asc')
				.limit(limit)
				.offset(offset);
		} else {
			counter = await db.from('dbo.photo').count('RowId', { as: 'count' });

			photos = await db
				.column(
					'PH.*',
					{ CommunityName: 'CO.Name' },
					{ PlaceName: 'PL.PrimaryName' }
				)
				.select()
				.from('dbo.photo as PH')
				.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
				.join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
				.orderBy('PH.RowId', 'asc')
				.limit(limit)
				.offset(offset);
		}

		res.status(200).send({ count: counter[0].count, body: photos });
	}
);

//LINK BOAT PHOTOS
photosExtraRouter.post('/boat/link/:BoatId', [param('BoatId').notEmpty()], ReturnValidationErrors, multer().single('file'),
	async (req: Request, res: Response) => {
		const { BoatId } = req.params;
		const { linkPhotos } = req.body;

		let currentPhotos = await db
			.select('Photo_RowID')
			.from('boat.Photo')
			.where('BoatId', BoatId);
		let filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x: any) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ BoatId, Photo_RowID: rowId })
				.into('boat.photo')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

//LINK AIRCRASH PHOTOS
photosExtraRouter.post('/aircrash/link/:AirCrashId', [param('AirCrashId').notEmpty()], ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { AirCrashId } = req.params;
		const { linkPhotos } = req.body;
		let currentPhotos = await db
			.select('Photo_RowID')
			.from('AirCrash.Photo')
			.where('YACSINumber', AirCrashId);
		let filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x: any) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ YACSINumber: AirCrashId, Photo_RowID: rowId })
				.into('AirCrash.Photo')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

//GET BOAT PHOTOS
photosExtraRouter.get('/boat/:boatId', [param('boatId').notEmpty()], ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { boatId } = req.params;
		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const photos = await db
			.select('*')
			.from('boat.photo as BP')
			.join('dbo.photo', 'BP.Photo_RowID', '=', 'dbo.photo.RowID')
			.where('BP.boatid', boatId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

// GET AIRCRASH PHOTOS
photosExtraRouter.get('/aircrash/:aircrashId', [param('aircrashId').notEmpty()], ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const { aircrashId } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const photos = await db
			.select('*')
			.from('AirCrash.Photo as AP')
			.join('dbo.photo', 'AP.Photo_RowID', '=', 'dbo.photo.RowID')
			.where('AP.YACSINumber', aircrashId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

// ADD NEW BOAT PHOTO
photosExtraRouter.post('/boat', [multer().single('file')],
	async (req: Request, res: Response) => {
		const { BoatId, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);

		const body = { File: req.file.buffer, ThumbFile, ...restBody };

		const response = await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows: any) => {
				const newBoatPhoto = rows[0];

				await db
					.insert({ BoatId, Photo_RowID: newBoatPhoto.RowId })
					.into('boat.photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});

				return newBoatPhoto;
			});
		res.status(200).send({ message: 'Upload Success' });
	}
);

// ADD NEW AIRCRASH PHOTO
photosExtraRouter.post('/aircrash', [multer().single('file')],
	async (req: Request, res: Response) => {
		const { YACSINumber, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const body = { File: req.file.buffer, ThumbFile, ...restBody };

		const response = await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows: any) => {
				const newAirCrashPhoto = rows[0];

				await db
					.insert({ YACSINumber, Photo_RowID: newAirCrashPhoto.RowId })
					.into('AirCrash.Photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});

				return newAirCrashPhoto;
			});

		res.status(200).send({ message: 'Upload Success' });
	}
);

// ADD NEW PERSON PHOTO
photosExtraRouter.post(
	'/people/new',
	[multer().single('file')],
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		const { PersonID, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const body = { File: req.file.buffer, ThumbFile, ...restBody };

		const response = await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows: any) => {
				const newPersonPhoto = rows[0];

				await db
					.insert({ PersonID, PhotoID: newPersonPhoto.RowId })
					.into('Person.Photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});

				return newPersonPhoto;
			});

		res.status(200).send({ message: 'Upload Success' });
	}
);



//GET PERSON PHOTOS
photosExtraRouter.get(
	'/people/:PersonID',
	async (req: Request, res: Response) => {
		const { PersonID } = req.params;

		const db = req.app.get('db');
		const { page = 0, limit = 10 } = req.query;
		const offset = Number(page) * Number(limit) || 0;

		const photos = await db
			.select('*')
			.from('Person.Photo as PP')
			.join('dbo.photo', 'PP.PhotoID', '=', 'dbo.photo.RowID')
			.where('PP.PersonID', PersonID)
			.limit(limit)
			.offset(offset);
		res.status(200).send(photos);
	}
);


//LINK PERSON PHOTOS
photosExtraRouter.post(
	'/people/link/:PersonID',
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { PersonID } = req.params;
		const { linkPhotos } = req.body;

		let currentPhotos = await db
			.select('PhotoID')
			.from('Person.Photo')
			.where('PersonID', PersonID);
		let filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x: any) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ PersonID, PhotoID: rowId })
				.into('Person.Photo')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

*/



////////////////////////////////////////////////////////////////////////////////
/////////////////////
////////////////////
////////////////////


//GET ALL AVAILABLE PHOTOS
photosExtraRouter.get('/', async (req: Request, res: Response) => {
	const db = req.app.get('db');
	const { page = 0, limit = 5, textToMatch } = req.query;
	const offset = Number(page) * Number(limit) || 0;
	let photos = [];
	let counter = 0;

	if (textToMatch) {
		counter = await db
			.from('dbo.photo as PH')
			.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
			.join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
			.where('PH.FeatureName', 'like', `%${textToMatch}%`)
			.orWhere('PH.OriginalFileName', 'like', `%${textToMatch}%`)
			.orWhere('PH.Address', 'like', `%${textToMatch}%`)
			.orWhere('PH.Caption', 'like', `%${textToMatch}%`)
			.orWhere('CO.Name', 'like', `%${textToMatch}%`)
			.orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
			.count('RowId', { as: 'count' });

		photos = await db
			.column(
				'PH.*',
				{ CommunityName: 'CO.Name' },
				{ PlaceName: 'PL.PrimaryName' }
			)
			.select()
			.from('dbo.photo as PH')
			.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
			.join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
			.where('FeatureName', 'like', `%${textToMatch}%`)
			.orWhere('OriginalFileName', 'like', `%${textToMatch}%`)
			.orWhere('Address', 'like', `%${textToMatch}%`)
			.orWhere('Caption', 'like', `%${textToMatch}%`)
			.orWhere('CO.Name', 'like', `%${textToMatch}%`)
			.orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
			.orderBy('PH.RowId', 'asc')
			.limit(limit)
			.offset(offset);
	} else {
		counter = await db
			.from('dbo.photo')
			.count('RowId', { as: 'count' })
			.first();

		photos = await db
			.column(
				'PH.*',
				{ CommunityName: 'CO.Name' },
				{ PlaceName: 'PL.PrimaryName' }
			)
			.select()
			.from('dbo.photo as PH')
			.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
			.join('dbo.Place as PL', 'PH.PlaceId', '=', 'PL.Id')
			.orderBy('PH.RowId', 'asc')
			.limit(limit)
			.offset(offset);
	}

	res.status(200).send({ count: counter, body: photos });
});

//LINK BOAT PHOTOS
photosExtraRouter.post(
	'/boat/link/:BoatId',
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { BoatId } = req.params;
		const { linkPhotos } = req.body;

		let currentPhotos = await db
			.select('Photo_RowID')
			.from('boat.Photo')
			.where('BoatId', BoatId);
		let filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x: any) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos) {
			await db
				.insert({ BoatId, Photo_RowID: rowId })
				.into('boat.photo')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});
		}
		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

//LINK PERSON PHOTOS
photosExtraRouter.post(
	'/people/link/:PersonID',
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { PersonID } = req.params;
		const { linkPhotos } = req.body;

		let currentPhotos = await db
			.select('PhotoID')
			.from('Person.Photo')
			.where('PersonID', PersonID);
		let filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x: any) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ PersonID, PhotoID: rowId })
				.into('Person.Photo')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

//LINK AIRCRASH PHOTOS
photosExtraRouter.post(
	'/aircrash/link/:AirCrashId',
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { AirCrashId } = req.params;
		const { linkPhotos } = req.body;
		let currentPhotos = await db
			.select('Photo_RowID')
			.from('AirCrash.Photo')
			.where('YACSINumber', AirCrashId);
		let filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x: any) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ YACSINumber: AirCrashId, Photo_RowID: rowId })
				.into('AirCrash.Photo')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

//GET BOAT PHOTOS
photosExtraRouter.get(
	'/boat/:boatId',
	async (req: Request, res: Response) => {
		const { boatId } = req.params;

		const db = req.app.get('db');
		const { page = 0, limit = 10 } = req.query;
		const offset = Number(page) * Number(limit) || 0;

		const photos = await db
			.select('*')
			.from('boat.photo as BP')
			.join('dbo.photo', 'BP.Photo_RowID', '=', 'dbo.photo.RowID')
			.where('BP.boatid', boatId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

// GET AIRCRASH PHOTOS
photosExtraRouter.get(
	'/aircrash/:aircrashId',
	async (req: Request, res: Response) => {
		const { aircrashId } = req.params;

		const db = req.app.get('db');
		const { page = 0, limit = 10 } = req.query;
		const offset = Number(page) * Number(limit) || 0;

		const photos = await db
			.select('*')
			.from('AirCrash.Photo as AP')
			.join('dbo.photo', 'AP.Photo_RowID', '=', 'dbo.photo.RowID')
			.where('AP.YACSINumber', aircrashId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

//GET PERSON PHOTOS
photosExtraRouter.get(
	'/people/:PersonID',
	async (req: Request, res: Response) => {
		const { PersonID } = req.params;

		const db = req.app.get('db');
		const { page = 0, limit = 10 } = req.query;
		const offset = Number(page) * Number(limit) || 0;

		const photos = await db
			.select('*')
			.from('Person.Photo as PP')
			.join('dbo.photo', 'PP.PhotoID', '=', 'dbo.photo.RowID')
			.where('PP.PersonID', PersonID)
			.limit(limit)
			.offset(offset);
		res.status(200).send(photos);
	}
);

// ADD NEW BOAT PHOTO
photosExtraRouter.post(
	'/boat',
	[ multer().single('file')],
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { BoatId, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);

		const body = { File: req.file.buffer, ThumbFile, ...restBody };

		const response = await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows: any) => {
				const newBoatPhoto = rows[0];

				await db
					.insert({ BoatId, Photo_RowID: newBoatPhoto.RowId })
					.into('boat.photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});

				return newBoatPhoto;
			});
		res.status(200).send({ message: 'Upload Success' });
	}
);

// ADD NEW AIRCRASH PHOTO
photosExtraRouter.post(
	'/aircrash',
	[ multer().single('file')],
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { YACSINumber, ...restBody } = req.body;

		const ThumbFile = await createThumbnail(req.file.buffer);

		const body = { File: req.file.buffer, ThumbFile, ...restBody };

		const response = await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows: any) => {
				const newAirCrashPhoto = rows[0];

				await db
					.insert({ YACSINumber, Photo_RowID: newAirCrashPhoto.RowId })
					.into('AirCrash.Photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});

				return newAirCrashPhoto;
			});

		res.status(200).send({ message: 'Upload Success' });
	}
);

// ADD NEW PERSON PHOTO
photosExtraRouter.post(
	'/people',
	[ multer().single('file')],
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		const { PersonID, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const body = { File: req.file.buffer, ThumbFile, ...restBody };

		const response = await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows: any) => {
				const newPersonPhoto = rows[0];

				await db
					.insert({ PersonID, PhotoID: newPersonPhoto.RowId })
					.into('Person.Photo')
					.returning('*')
					.then((rows: any) => {
						return rows;
					});

				return newPersonPhoto;
			});

		res.status(200).send({ message: 'Upload Success' });
	}
);

