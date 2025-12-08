import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import { createThumbnail } from '../utils/image';
import knex from 'knex';
import { ReturnValidationErrors, RequiresAuthentication } from '../middleware';
import { param, query } from 'express-validator';
import * as multer from 'multer';
import _ from 'lodash';

export const photosExtraRouter = express.Router();
const db = knex(DB_CONFIG);

const upload = multer.default();

//GET ALL AVAILABLE PHOTOS
photosExtraRouter.get(
	'/',
	[query('page').default(0).isInt(), query('limit').default(10).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		try {
			const { textToMatch } = req.query;
			const page = parseInt(req.query.page as string);
			const limit = parseInt(req.query.limit as string);
			const offset = (page - 1) * limit;
			let counter = [{ count: 0 }];
			let photos = [];

			const excludeIfHasPlaceId = req.query.excludeIfHasPlaceId;

			if (textToMatch) {
				const counterQuery = db
					.from('dbo.photo as PH')
					.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
					.leftOuterJoin('dbo.Place as PL', 'PH.PlaceId', 'PL.Id')
					.where('PH.FeatureName', 'like', `%${textToMatch}%`)
					.whereNotNull('ThumbFile')
					.orWhere('PH.OriginalFileName', 'like', `%${textToMatch}%`)
					.orWhere('PH.Address', 'like', `%${textToMatch}%`)
					.orWhere('PH.Caption', 'like', `%${textToMatch}%`)
					.orWhere('CO.Name', 'like', `%${textToMatch}%`)
					.orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`);

				if (excludeIfHasPlaceId) {
					counterQuery.whereNull('PH.PlaceId');
				}

				counter = await counterQuery.count('RowId', { as: 'count' });

				const photosQuery = db
					.column(
						[
							'RowId',
							'PlaceId',
							'Address',
							'Caption',
							'OriginalFileName',
							'FeatureName',
							'ThumbFile',
						],
						{ CommunityName: 'CO.Name' },
						{ PlaceName: 'PL.PrimaryName' }
					)
					.select()
					.from('dbo.photo as PH')
					.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
					.leftOuterJoin('dbo.Place as PL', 'PH.PlaceId', 'PL.Id')
					.where('FeatureName', 'like', `%${textToMatch}%`)
					.whereNotNull('ThumbFile')
					.orWhere('OriginalFileName', 'like', `%${textToMatch}%`)
					.orWhere('Address', 'like', `%${textToMatch}%`)
					.orWhere('Caption', 'like', `%${textToMatch}%`)
					.orWhere('CO.Name', 'like', `%${textToMatch}%`)
					.orWhere('PL.PrimaryName', 'like', `%${textToMatch}%`)
					.orderBy('PH.RowId', 'asc')
					.limit(limit)
					.offset(offset);

				if (excludeIfHasPlaceId) {
					photosQuery.whereNull('PH.PlaceId');
				}

				photos = await photosQuery;
			} else {
				const counterQuery = db.from('dbo.photo as PH');

				if (excludeIfHasPlaceId) {
					counterQuery.whereNull('PH.PlaceId');
				}

				counter = await counterQuery.count('PH.RowId', { as: 'count' });

				const photosQuery = db
					.select(
						'PH.RowId',
						'PH.PlaceId',
						'PH.Address',
						'PH.Caption',
						'PH.OriginalFileName',
						'PH.FeatureName',
						'PH.ThumbFile',
						'CO.Name as CommunityName',
						'PL.PrimaryName as PlaceName'
					)
					.from('dbo.photo as PH')
					.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
					.leftOuterJoin('dbo.Place as PL', 'PH.PlaceId', 'PL.Id')
					.whereNotNull('ThumbFile')
					.orderBy('PH.RowId', 'asc')
					.limit(limit)
					.offset(offset);

				if (excludeIfHasPlaceId) {
					photosQuery.whereNull('PH.PlaceId');
				}

				photos = await photosQuery;
			}
			res.status(200).send({ count: counter[0].count, body: photos });
		} catch (error) {
			console.error(error);
			res.status(500).send({ error: 'Failed to fetch photos' });
		}
	}
);

//LINK PLACE (aka site) PHOTOS
photosExtraRouter.post(
	'/place/link/:PlaceId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		try {
			const { PlaceId } = req.params;
			const { linkPhotos } = req.body;

			const currentPhotosForPlace = await db
				.select('RowId', 'PlaceId')
				.from('dbo.Photo')
				.where('PlaceId', PlaceId);

			const filteredLinkPhotos = _.difference(
				linkPhotos,
				currentPhotosForPlace.map((x: any) => {
					return x.RowId;
				})
			);

			for (const rowId of filteredLinkPhotos) {
				console.log('LINKING', { rowId });
				await db('dbo.Photo').where('RowId', rowId).update({ PlaceId: PlaceId });
			}
			res.status(200).send({ message: 'Successfully linked the photos' });
		} catch (error) {
			console.error(error);
			res.status(500).send({ message: 'Failed to link photos' });
		}
	}
);

// LINK BOAT PHOTOS
photosExtraRouter.post(
	'/boat/link/:BoatId',
	[param('BoatId').notEmpty()],
	ReturnValidationErrors,
	[upload.single('file')],
	async (req: Request, res: Response) => {
		const { BoatId } = req.params;
		const { linkPhotos } = req.body;

		const currentPhotos = await db.select('Photo_RowID').from('boat.Photo').where('BoatId', BoatId);
		const filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ BoatId, Photo_RowID: rowId })
				.into('boat.photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

// LINK AIRCRASH PHOTOS
photosExtraRouter.post(
	'/aircrash/link/:AirCrashId',
	[param('AirCrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/* const db = req.app.get('db'); 
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403); */

		const { AirCrashId } = req.params;
		const { linkPhotos } = req.body;
		const currentPhotos = await db
			.select('Photo_RowID')
			.from('AirCrash.Photo')
			.where('YACSINumber', AirCrashId);
		const filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ YACSINumber: AirCrashId, Photo_RowID: rowId })
				.into('AirCrash.Photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

// Link ytplace photo
photosExtraRouter.post(
	'/ytplace/link/:placeId',
	[param('placeId').notEmpty()],
	ReturnValidationErrors,
	[upload.single('file')],
	async (req: Request, res: Response) => {
		const { placeId } = req.params;
		const { linkPhotos } = req.body;

		const currentPhotos = await db
			.select('Photo_RowID')
			.from('place.Photo')
			.where('placeId', placeId);
		const filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ placeId, Photo_RowID: rowId })
				.into('place.photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

//GET Place(site) photos
photosExtraRouter.get(
	'/place/:placeId',
	[param('placeId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { placeId } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const photos = await db
			.select('*')
			.from('Photo')
			.where('Photo.PlaceId', placeId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

//GET BOAT PHOTOS
photosExtraRouter.get(
	'/boat/:boatId',
	[param('boatId').notEmpty()],
	ReturnValidationErrors,
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
photosExtraRouter.get(
	'/aircrash/:aircrashId',
	[param('aircrashId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		/* const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
    const db = req.app.get('db'); */
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

// GET BURIAL PHOTOS
photosExtraRouter.get(
	'/burial/:burialId',
	[param('burialId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { burialId } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const photos = await db
			.select('*')
			.from('Burial.Photo as BP')
			.join('dbo.photo AS PH', 'BP.Photo_RowID', '=', 'PH.RowID')
			.where('BP.BurialID', burialId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

// GET PEOPLE PHOTOS
photosExtraRouter.get(
	'/people/:personID',
	[param('personID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { personID } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		const photos = await db
			.select('*')
			.from('Person.Photo as PP')
			.join('dbo.photo AS PH', 'PP.PhotoID', '=', 'PH.RowID')
			.where('PP.PersonID', personID)
			.limit(limit)
			.offset(offset);
		res.status(200).send(photos);
	}
);

// GET INTERPRETIVE SITE PHOTOS
photosExtraRouter.get(
	'/interpretive-sites/:siteID',
	[param('siteID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteID } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;
		const photos = await db
			.select('*')
			.from('InterpretiveSite.Photos as IP')
			.join('dbo.photo AS PH', 'IP.Photo_RowID', '=', 'PH.RowID')
			.where('IP.SiteID', siteID)
			.limit(limit)
			.offset(offset);
		res.status(200).send(photos);
	}
);

// Get yt place photos
photosExtraRouter.get(
	'/ytplace/:placeId',
	[param('placeId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { placeId } = req.params;

		const page = parseInt(req.query.page as string);
		const limit = parseInt(req.query.limit as string);
		const offset = page * limit || 0;

		const photos = await db
			.select([
				'Address',
				'Caption',
				'OriginalFileName',
				'FeatureName',
				'CO.Name as CommunityName',
				'ThumbFile',
			])
			.from('place.photo as P')
			.join('dbo.photo as PH', 'P.Photo_RowID', '=', 'PH.RowID')
			.join('dbo.Community as CO', 'PH.CommunityId', '=', 'CO.Id')
			.where('P.placeId', placeId)
			.limit(limit)
			.offset(offset);

		res.status(200).send(photos);
	}
);

// ADD NEW BOAT PHOTO
photosExtraRouter.post('/boat', [upload.single('file')], async (req: Request, res: Response) => {
	/* const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403); */

	const { boatId, ...restBody } = req.body;
	const ThumbFile = await createThumbnail(req.file.buffer);
	const DateCreated = new Date();
	const OriginalFileName = req.file.originalname;

	const body = {
		File: req.file.buffer,
		ThumbFile,
		DateCreated,
		OriginalFileName,
		IsSiteDefault: false,
		...restBody,
	};

	await db
		.insert(body)
		.into('dbo.photo')
		.returning('*')
		.then(async (rows) => {
			const newBoatPhoto = rows[0];

			await db
				.insert({ boatId, Photo_RowID: newBoatPhoto.RowId })
				.into('boat.photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

			return newBoatPhoto;
		});
	res.status(200).send({ message: 'Upload Success' });
});

// ADD NEW AIRCRASH PHOTO
photosExtraRouter.post(
	'/aircrash',
	[upload.single('file')],
	async (req: Request, res: Response) => {
		/*  const db = req.app.get('db');  
   
     const permissions = req.decodedToken['yg-claims'].permissions;
     if (!permissions.includes('create')) res.sendStatus(403); */

		const { yacsiNumber, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const DateCreated = new Date();
		const OriginalFileName = req.file.originalname;

		const body = {
			File: req.file.buffer,
			ThumbFile,
			DateCreated,
			OriginalFileName,
			IsSiteDefault: false,
			...restBody,
		};

		await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows) => {
				const newAirCrashPhoto = rows[0];

				await db
					.insert({ yacsiNumber, Photo_RowID: newAirCrashPhoto.RowId })
					.into('AirCrash.Photo')
					.returning('*')
					.then((rows) => {
						return rows;
					});

				return newAirCrashPhoto;
			});

		res.status(200).send({ message: 'Upload Success' });
	}
);

// ADD NEW INTERPRETIVE SITE PHOTO
photosExtraRouter.post(
	'/interpretive-sites',
	[upload.single('file')],
	async (req: Request, res: Response) => {
		const { SiteID, ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const DateCreated = new Date();
		const OriginalFileName = req.file.originalname;
		const body = {
			File: req.file.buffer,
			ThumbFile,
			DateCreated,
			OriginalFileName,
			IsSiteDefault: false,
			...restBody,
		};

		await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows) => {
				const newPhoto = rows[0];

				await db
					.insert({ SiteID: SiteID, Photo_RowID: newPhoto.RowId })
					.into('InterpretiveSite.Photos')
					.returning('*')
					.then((rows) => {
						return rows;
					});

				return newPhoto;
			});

		res.status(200).send({ message: 'Upload Success' });
	}
);

// Add ytplace photo
photosExtraRouter.post('/ytplace', [upload.single('file')], async (req: Request, res: Response) => {
	const { placeId, ...restBody } = req.body;
	const ThumbFile = await createThumbnail(req.file.buffer);
	const DateCreated = new Date();
	const OriginalFileName = req.file.originalname;

	const body = {
		File: req.file.buffer,
		ThumbFile,
		DateCreated,
		OriginalFileName,
		IsSiteDefault: false,
		...restBody,
	};

	await db
		.insert(body)
		.into('dbo.photo')
		.returning('*')
		.then(async (rows) => {
			const newPlacePhoto = rows[0];

			await db
				.insert({ placeId, Photo_RowID: newPlacePhoto.RowId })
				.into('place.photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

			return newPlacePhoto;
		});
	res.status(200).send({ message: 'Upload Success' });
});

// LINK BURIAL PHOTOS
photosExtraRouter.post(
	'/burial/link/:burialId',
	[param('burialId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { burialId } = req.params;
		const { linkPhotos } = req.body;
		const currentPhotos = await db
			.select('Photo_RowID')
			.from('Burial.Photo')
			.where('BurialID', burialId);
		const filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ BurialID: burialId, Photo_RowID: rowId })
				.into('Burial.Photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

// LINK INTERPRETIVE SITE PHOTOS
photosExtraRouter.post(
	'/interpretive-sites/link/:siteId',
	[param('siteId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { siteId } = req.params;
		const { linkPhotos } = req.body;
		const currentPhotos = await db
			.select('Photo_RowID')
			.from('InterpretiveSite.Photos')
			.where('SiteID', siteId);
		const filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ SiteID: siteId, Photo_RowID: rowId })
				.into('InterpretiveSite.Photos')
				.returning('*')
				.then((rows) => {
					return rows;
				});

		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

// ADD NEW BURIAL PHOTO
photosExtraRouter.post(
	'/burial/:burialID',
	[param('burialID').notEmpty()],
	[upload.single('file')],
	async (req: Request, res: Response) => {
		const burialID = req.params.burialID;
		const { ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const body = { File: req.file.buffer, ThumbFile, ...restBody };
		delete body.BurialID;
		await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows) => {
				const newBurialPhoto = rows[0];

				await db
					.insert({ BurialID: burialID, Photo_RowID: newBurialPhoto.RowId })
					.into('Burial.Photo')
					.returning('*')
					.then((rows) => {
						return rows;
					});

				return newBurialPhoto;
			});
		res.status(200).send({ message: 'Upload Success' });
	}
);

// ADD NEW PERSON PHOTO
photosExtraRouter.post(
	'/people/:personID',
	[param('personID').notEmpty()],
	[upload.single('file')],
	async (req: Request, res: Response) => {
		const personID = req.params.personID;
		const { ...restBody } = req.body;
		const ThumbFile = await createThumbnail(req.file.buffer);
		const body = { File: req.file.buffer, ThumbFile, ...restBody };
		delete body.personID;
		await db
			.insert(body)
			.into('dbo.photo')
			.returning('*')
			.then(async (rows) => {
				const newPhoto = rows[0];

				await db
					.insert({ PersonID: personID, PhotoID: newPhoto.RowId })
					.into('Person.Photo')
					.returning('*')
					.then((rows) => {
						return rows;
					});

				return newPhoto;
			});
		res.status(200).send({ message: 'Upload Success' });
	}
);

// LINK PERSON PHOTOS
photosExtraRouter.post(
	'/people/link/:personID',
	[param('personID').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { personID } = req.params;
		const { linkPhotos } = req.body;
		const currentPhotos = await db
			.select('PhotoID')
			.from('Person.Photo')
			.where('PersonID', personID);
		const filteredLinkPhotos = _.difference(
			linkPhotos,
			currentPhotos.map((x) => {
				return x.Photo_RowID;
			})
		);

		for (const rowId of filteredLinkPhotos)
			await db
				.insert({ PersonID: personID, PhotoID: rowId })
				.into('Person.Photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});
		res.status(200).send({ message: 'Successfully linked the photos' });
	}
);

// ADD NEW BOAT PHOTO
photosExtraRouter.post('/boat', [upload.single('file')], async (req: Request, res: Response) => {
	const { burialId, ...restBody } = req.body;
	const ThumbFile = await createThumbnail(req.file.buffer);

	const body = { File: req.file.buffer, ThumbFile, ...restBody };

	await db
		.insert(body)
		.into('dbo.photo')
		.returning('*')
		.then(async (rows) => {
			const newBurialPhoto = rows[0];

			await db
				.insert({ burialId, Photo_RowID: newBurialPhoto.RowId })
				.into('Burial.Photo')
				.returning('*')
				.then((rows) => {
					return rows;
				});

			return newBurialPhoto;
		});
	res.status(200).send({ message: 'Upload Success' });
});
