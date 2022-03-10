import express, { Request, Response } from 'express';
import { DB_CONFIG } from '../config';
import { body, check, query, validationResult } from 'express-validator';
import {
	PhotoService,
	PhotoBatchService,
	SortStatement,
	SortDirection,
} from '../services';
import { Photo, PhotoBatch, PhotoBatchPhoto } from '../data';
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

		let page = parseInt(req.query.page as string);
		let skip = (page - 1) * PAGE_SIZE;
		let take = PAGE_SIZE;

		let list = await photoBatchService
			.getAll(skip, take)
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return undefined;
			});

		let item_count = await photoBatchService
			.getPhotoBatchCount()
			.then((data) => data)
			.catch((err) => {
				console.error('Database Error', err);
				return 0;
			});

		let page_count = Math.ceil(item_count / PAGE_SIZE);

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
		let { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
		let sort = new Array<SortStatement>();

		sortBy.forEach((s: string, i: number) => {
			sort.push({
				field: s,
				direction: sortDesc[i]
					? SortDirection.ASCENDING
					: SortDirection.DESCENDING,
			});
		});

		let skip = (page - 1) * itemsPerPage;
		let take = itemsPerPage;
		let results = await photoBatchService.doSearch(
			query,
			sort,
			page,
			itemsPerPage,
			skip,
			take
		);

		res.json(results);
	}
);

photoBatchRouter.get(
	'/:id',
	[check('id').notEmpty()],
	async (req: Request, res: Response) => {
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
	}
);

photoBatchRouter.post(
	'/',
	[body('name').notEmpty().bail()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		const DateCreated = new Date();
		req.body.dateCreated = DateCreated;

		let result = await photoBatchService
			.addBatch(req.body as PhotoBatch)
			.then((item) => item)
			.catch((err) => {
				console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
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

		let list = await photoBatchService
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
		let list = await photoBatchService.deleteBatch(parseInt(id));
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
			console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await photoBatchService
			.updateBatch(req.params.id, req.body as PhotoBatch)
			.then((item) => item)
			.catch((err) => {
				console.log(err);
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
		let list = await photoBatchService.deletePhoto(parseInt(id));
		return res.json({ data: list });
	}
);

photoBatchRouter.post(
	'/photo',
	multer().single('file'),
	[check('photoBatchId').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		req.body.photoFile = req.file.buffer;
		req.body.photoFileName = req.file.originalname;

		if (!errors.isEmpty()) {
			console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await photoBatchService
			.addPhoto(req.body as PhotoBatchPhoto)
			.then((item) => item)
			.catch((err) => {
				console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		return res.json({ data: result });
	}
);

photoBatchRouter.put(
	'/:id/process-batch',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			console.log(errors);
			return res.status(400).json({ errors: errors.array() });
		}

		let result = await photoBatchService
			.processBatch(req.params.id)
			.then((item) => item)
			.catch((err) => {
				console.log(err);
				return res.json({ errors: [err.originalError.info.message] });
			});

		for (let i = 0; i < result.length; i++) {
			let photo = await photoService.getFileById(result[i].rowid);
			if (photo && photo.file) {
				let thumbnail = await createThumbnail(photo.file);
				let res = await photoService.updateThumbFile(
					result[i].rowid,
					thumbnail
				);
			}
		}

		let list = await photoBatchService.deleteBatch(parseInt(req.params.id));
		return res.json({ data: list });
	}
);
