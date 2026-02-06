import express, { Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';

import { nullIfEmpty } from '../utils/validation';
import { StaticService } from '../services';

const staticService = new StaticService();
export const staticRouter = express.Router();

staticRouter.get('/community', async (_req: Request, res: Response) => {
	const list = await staticService.getCommunities();
	return res.json({ data: list });
});

staticRouter.get('/first-nation', async (_req: Request, res: Response) => {
	const list = await staticService.getFirstNations();
	return res.json({ data: list });
});

staticRouter.get('/photo-project-section', async (_req: Request, res: Response) => {
	const list = await staticService.getPhotoProjectSections();
	return res.json({ data: list });
});

staticRouter.get('/original-media', async (_req: Request, res: Response) => {
	const list = await staticService.getOriginalMedias();
	return res.json({ data: list });
});

staticRouter.get('/photo-copyright', async (_req: Request, res: Response) => {
	const list = await staticService.getCopyrights();
	return res.json({ data: list });
});

staticRouter.get('/usage-right', async (_req: Request, res: Response) => {
	const list = await staticService.getUsageRights();
	return res.json({ data: list });
});

staticRouter.get('/category', async (_req: Request, res: Response) => {
	const list = staticService.getCategories();
	return res.json({ data: list });
});

staticRouter.get('/designation-type', async (_req: Request, res: Response) => {
	const list = staticService.getDesignationTypes();
	return res.json({ data: list });
});

staticRouter.get('/record-type', async (_req: Request, res: Response) => {
	const list = staticService.getRecordTypes();
	return res.json({ data: list });
});

staticRouter.get('/site-category', async (_req: Request, res: Response) => {
	const list = staticService.getSiteCategories();
	return res.json({ data: list });
});

staticRouter.get('/contributing-resource-type', async (_req: Request, res: Response) => {
	const list = staticService.getContributingResourceTypes();
	return res.json({ data: list });
});

staticRouter.get('/mapsheet', async (_req: Request, res: Response) => {
	const list = await staticService.getMapSheets();
	return res.json({ data: list });
});

staticRouter.get('/photo-program', async (_req: Request, res: Response) => {
	const list = staticService.getPhotoPrograms();
	return res.json({ data: list });
});

staticRouter.get('/media-storage', async (_req: Request, res: Response) => {
	const list = staticService.getMediaStorages();
	return res.json({ data: list });
});

staticRouter.get('/photo-owner', async (_req: Request, res: Response) => {
	const list = await staticService.getPhotoOwners();
	return res.json({ data: list });
});

staticRouter.get('/photo-rating', async (_req: Request, res: Response) => {
	const list = await staticService.getPhotoRatings();
	return res.json({ data: list });
});

staticRouter.get(
	'/photo-owner/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await staticService.getPhotoOwner(parseInt(id));
		return res.json({ data: list });
	}
);

staticRouter.post(
	'/photo-owner',
	[
		body('name').isString().notEmpty().trim(),
		body('email').toLowerCase().trim().customSanitizer(nullIfEmpty),
		body('address').trim().customSanitizer(nullIfEmpty),
		body('telephone').trim().customSanitizer(nullIfEmpty),
		body('contactPerson').trim().customSanitizer(nullIfEmpty),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, address, telephone, contactPerson } = req.body;
		const result = await staticService.addPhotoOwner({
			name,
			email,
			address,
			telephone,
			contactPerson,
		});
		return res.json({ data: result });
	}
);

staticRouter.put(
	'/photo-owner/:id',
	[
		check('id').isInt().notEmpty(),
		body('name').isString().notEmpty().trim(),
		body('email').toLowerCase().trim().customSanitizer(nullIfEmpty),
		body('address').trim().customSanitizer(nullIfEmpty),
		body('telephone').trim().customSanitizer(nullIfEmpty),
		body('contactPerson').trim().customSanitizer(nullIfEmpty),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const { name, email, address, telephone, contactPerson } = req.body;
		const result = await staticService.updatePhotoOwner(parseInt(id), {
			name,
			email,
			address,
			telephone,
			contactPerson,
		});
		return res.json({ data: result });
	}
);

staticRouter.delete(
	'/photo-owner/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await staticService.deletePhotoOwner(parseInt(id));
		return res.json({ data: list });
	}
);

staticRouter.get('/photo-project', async (_req: Request, res: Response) => {
	const list = await staticService.getPhotoProjects();
	return res.json({ data: list });
});

staticRouter.get(
	'/photo-project/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await staticService.getPhotoProject(parseInt(id));
		return res.json({ data: list });
	}
);

staticRouter.post(
	'/photo-project',
	[
		body('name').isString().notEmpty().trim(),
		body('permit').trim().customSanitizer(nullIfEmpty),
		body('year').trim().customSanitizer(nullIfEmpty),
		body('section').isInt().notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, permit, year, section } = req.body;
		const result = await staticService.addPhotoProject({
			name,
			permit,
			year,
			section,
		});
		return res.json({ data: result });
	}
);

staticRouter.put(
	'/photo-project/:id',
	[
		check('id').isInt().notEmpty(),
		body('name').isString().notEmpty().trim(),
		body('permit').trim().customSanitizer(nullIfEmpty),
		body('year').trim().customSanitizer(nullIfEmpty),
		body('section').isInt().notEmpty(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const { name, permit, year, section } = req.body;
		const result = await staticService.updatePhotoProject(parseInt(id), {
			name,
			permit,
			year,
			section,
		});
		return res.json({ data: result });
	}
);

staticRouter.delete(
	'/photo-project/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await staticService.deletePhotoProject(parseInt(id));
		return res.json({ data: list });
	}
);

staticRouter.get('/photo-subject', async (_req: Request, res: Response) => {
	const list = await staticService.getPhotoSubjects();
	return res.json({ data: list });
});

staticRouter.get(
	'/photo-subject/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await staticService.getPhotoSubject(parseInt(id));
		return res.json({ data: list });
	}
);

staticRouter.post(
	'/photo-subject',
	[body('name').isString().notEmpty().trim()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name } = req.body;
		const result = await staticService.addPhotoSubject({ name });
		return res.json({ data: result });
	}
);

staticRouter.put(
	'/photo-subject/:id',
	[check('id').isInt().notEmpty(), body('name').isString().notEmpty().trim()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const { name } = req.body;
		const result = await staticService.updatePhotoSubject(parseInt(id), { name });
		return res.json({ data: result });
	}
);

staticRouter.delete(
	'/photo-subject/:id',
	[check('id').isInt().notEmpty()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = req.params.id as string;
		const list = await staticService.deletePhotoSubject(parseInt(id));
		return res.json({ data: list });
	}
);
