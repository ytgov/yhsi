import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import { body, check, query, validationResult } from 'express-validator';
import { PhotoService, PhotoBatchService, SortStatement, SortDirection } from '../services';
import { PhotoBatch, PhotoBatchPhoto } from '../data';
import multer from 'multer';
import { createThumbnail } from '../utils/image';
import { ReturnValidationErrors } from '../middleware';

const photoBatchService = new PhotoBatchService(DB_CONFIG);
const photoService = new PhotoService(DB_CONFIG);
const PAGE_SIZE = 36;

export const photoBatchRouter = express.Router();

photoBatchRouter.get(
	'/',
	[query('page').default(1).isInt({ gt: 0 })],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const page = parseInt(req.query.page as string);
		const skip = (page - 1) * PAGE_SIZE;
		const take = PAGE_SIZE;

		const list = await photoBatchService
			.getAll(skip, take)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		const item_count = await photoBatchService
			.getPhotoBatchCount()
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return 0;
			});

		const page_count = Math.ceil(item_count / PAGE_SIZE);

		if (list) {
			return res.json({
				data: list,
				meta: { page, page_size: PAGE_SIZE, item_count, page_count },
			});
		}

		return res.status(500).send('Error');
	}
);

photoBatchRouter.post(
	'/search',
	[body('page').isInt().default(1)],
	async (req: Request, res: Response) => {
		const { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
		const sort = new Array<SortStatement>();

		sortBy.forEach((s: string, i: number) => {
			sort.push({
				field: s,
				direction: sortDesc[i] ? SortDirection.ASCENDING : SortDirection.DESCENDING,
			});
		});

		const skip = (page - 1) * itemsPerPage;
		const take = itemsPerPage;
		const results = await photoBatchService.doSearch(query, sort, page, itemsPerPage, skip, take);

		res.json(results);
	}
);

photoBatchRouter.get('/:id', [check('id').notEmpty()], async (req: Request, res: Response) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	await photoBatchService
		.getById(req.params.id)
		.then((item) => {
			if (item) return res.json({ data: item });

			return res.status(404).send('Photo batch not found');
		})
		.catch((err) => {
			console.error(err);
			return res.status(404).send('Photo batch not found');
		});
});

photoBatchRouter.post(
	'/',
	[body('name').notEmpty().bail()],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				//console.log(errors);
				return res.status(400).json({ errors: errors.array() });
			}

			const DateCreated = new Date();
			req.body.dateCreated = DateCreated;

			const result = await photoBatchService.addBatch(req.body as PhotoBatch).then((item) => item);

			return res.json({ data: result });
		} catch (error) {
			console.error(error);
			return res.status(422).json({ message: 'Photo batch creation failed' });
		}
	}
);

photoBatchRouter.get(
	'/:id/photos',
	[check('id').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const list = await photoBatchService
			.getPhotos(req.params.id)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		if (list) {
			return res.json({ data: list });
		}

		return res.status(500).send('Error');
	}
);

photoBatchRouter.delete(
	'/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await photoBatchService.deleteBatch(parseInt(id));
		return res.json({ data: list });
	}
);

photoBatchRouter.put(
	'/:id',
	[
		check('id').notEmpty().isInt(),
		body('communityId').notEmpty().bail().isInt(),
		body('isOtherRecord').notEmpty().bail().isBoolean(),
		body('originalMediaId').notEmpty().bail().isInt(),
		body('mediaStorage').notEmpty().bail().isInt(),
		body('copyright').notEmpty().bail().isInt(),
		body('ownerId').notEmpty().bail().isInt(),
		body('photoProjectId').notEmpty().bail().isInt(),
		body('program').notEmpty().bail().isInt(),
		body('isComplete').notEmpty().bail().isBoolean(),
		body('isPrivate').notEmpty().bail().isBoolean(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			//console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		const result = await photoBatchService
			.updateBatch(req.params.id, req.body as PhotoBatch)
			.then((item) => item)
			.catch((err) => {
				//console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
	}
);

photoBatchRouter.delete(
	'/photo/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await photoBatchService.deletePhoto(parseInt(id));
		return res.json({ data: list });
	}
);

photoBatchRouter.post(
	'/photo',
	multer().single('file'),
	[check('photoBatchId').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);
			const ThumbFile = await createThumbnail(req.file.buffer);
			req.body.photoFile = req.file.buffer;
			req.body.photoFileName = req.file.originalname;
			req.body.ThumbFile = ThumbFile;

			if (!errors.isEmpty()) {
				//console.log(errors);
				return res.status(400).json({ errors: errors.array() });
			}

			const result = await photoBatchService
				.addPhoto(req.body as PhotoBatchPhoto)
				.then((item) => item);

			return res.json({ data: result });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Photo upload failed' });
		}
	}
);

photoBatchRouter.put(
	'/:id/process-batch',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const result = await photoBatchService.processBatch(req.params.id).then((item) => item);

			for (let i = 0; i < result.length; i++) {
				const photo = await photoService.getFileById(result[i].rowid);
				if (photo && photo.file) {
					const thumbnail = await createThumbnail(photo.file);
					await photoService.updateThumbFile(result[i].rowid, thumbnail);
				}
			}

			const list = await photoBatchService.deleteBatch(parseInt(req.params.id));
			return res.json({ data: list });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ message: 'Photo batch processing failed' });
		}
	}
);
