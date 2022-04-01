import express, { Request, Response } from "express";
import { RequiresAuthentication } from '../middleware';
import _ from "lodash";
import { createThumbnail } from "../utils/image";
import multer from "multer";

var router = express.Router();

//GET ALL AVAILABLE PHOTOS
router.get('/', RequiresAuthentication, async (req: Request, res: Response) => {
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
router.post(
	'/boat/link/:BoatId',
	RequiresAuthentication,
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
router.post(
	'/people/link/:PersonID',
	RequiresAuthentication,
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
router.post(
	'/aircrash/link/:AirCrashId',
	RequiresAuthentication,
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
router.get(
	'/boat/:boatId',
	RequiresAuthentication,
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
router.get(
	'/aircrash/:aircrashId',
	RequiresAuthentication,
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
router.get(
	'/people/:PersonID',
	RequiresAuthentication,
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
router.post(
	'/boat/new',
	[RequiresAuthentication, multer().single('file')],
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
router.post(
	'/aircrash/new',
	[RequiresAuthentication, multer().single('file')],
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
router.post(
	'/people/new',
	[RequiresAuthentication, multer().single('file')],
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

module.exports = router;
