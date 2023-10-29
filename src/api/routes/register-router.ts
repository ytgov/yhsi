import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import { DB_CONFIG } from '../config';
import { DescriptionService, PhotoService, PlaceService } from '../services';
import moment from 'moment';
import { createThumbnail } from '../utils/image';

const descriptionService = new DescriptionService(DB_CONFIG);
const placeService = new PlaceService(DB_CONFIG);
const photoService = new PhotoService(DB_CONFIG);

export const registerRouter = express.Router();
const PAGE_SIZE = 12;

registerRouter.get(
	'/',
	[query('page').default(1).isInt({ gt: 0 })],
	async (req: Request, res: Response) => {
		let page = parseInt(req.query.page as string);
		let skip = (page - 1) * PAGE_SIZE;
		let take = PAGE_SIZE;

		let data = await placeService.getRegisterAll(skip, take);
		data.map(
			(d) =>
				(d.recognitionDate = moment(d.recognitionDate)
					.add(7, 'hours')
					.format('YYYY-MM-DD'))
		);

		let item_count = await placeService
			.getPlaceInRegisterCount()
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return 0;
			});

		let page_count = Math.ceil(item_count / PAGE_SIZE);

		if (data) {
			return res.json({
				data,
				meta: { page, page_size: PAGE_SIZE, item_count, page_count },
			});
		}

		res.json({ data });
	}
);

registerRouter.get('/:id', async (req: Request, res: Response) => {
	let { id } = req.params;
	let data = await placeService.getRegisterById(parseInt(id));

	if (!data) {
		return res.status(404).send();
	}

	data.placeDescriptionEn = '1111';
	data.placeDescriptionFr = '';
	data.heritageValueEn = '';
	data.heritageValueFr = '';
	data.characterDefEn = '';
	data.characterDefFr = '';
	data.descBoundEn = '';
	data.descBoundFr = '';
	data.additionalInfoEn = '';
	data.additionalInfoFr = '';

	let descs = await descriptionService.getForPlace(parseInt(id));

	for (let desc of descs) {
		if (desc.type == 5) {
			data.placeDescriptionEn = desc.descriptionText;
			data.placeDescriptionFr = 'FRENCH: ' + desc.descriptionText;
		} else if (desc.type == 4) {
			data.heritageValueEn = desc.descriptionText;
			data.heritageValueFr = 'FRENCH: ' + desc.descriptionText;
		} else if (desc.type == 2) {
			data.characterDefEn = desc.descriptionText;
			data.characterDefFr = 'FRENCH: ' + desc.descriptionText;
		} else if (desc.type == 6) {
			data.descBoundEn = desc.descriptionText;
			data.descBoundFr = 'FRENCH: ' + desc.descriptionText;
		} else if (desc.type == 30) {
			data.additionalInfoEn = desc.descriptionText;
			data.additionalInfoFr = 'FRENCH: ' + desc.descriptionText;
		}
	}

	res.json({ data });
});

registerRouter.get('/:id/photos', async (req: Request, res: Response) => {
	let { id } = req.params;
	let data = await placeService.getRegisterById(parseInt(id));

	if (!data) {
		return res.status(404).send();
	}

	let photos = await photoService.getAllForPlace(parseInt(id));

	res.json({ data: photos });
});

registerRouter.get(
	'/:id/photos/:photoId',
	async (req: Request, res: Response) => {
		let { id, photoId } = req.params;
		let data = await placeService.getRegisterById(parseInt(id));

		if (!data) {
			return res.status(404).send();
		}

		await photoService
			.getFileById(photoId)
			.then(async (photo) => {
				if (photo && photo.file) {
					let t = await createThumbnail(photo.file);
					return res.contentType('image/jpg').send(t);
				}

				return res.status(404).send('Photo not found');
			})
			.catch((err) => {
				console.error(err);
				return res.status(404).send('Photo not found');
			});
	}
);
