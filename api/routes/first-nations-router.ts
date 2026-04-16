import express, { Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';

import db from '@/db/db-client';
import { authorize } from '@/middleware/authorization';
import { UserRoles } from '@/models';

export const firstNationsRouter = express.Router();

firstNationsRouter.get('/', (_req: Request, res: Response) => {
	return db
		.select('Id as id', 'Description as description')
		.from('FirstNation')
		.orderBy('Description', 'asc')
		.then((results) => {
			return res.json({ data: results });
		});
});

firstNationsRouter.post(
	'/',
	authorize([UserRoles.ADMINISTRATOR, UserRoles.SITE_ADMIN]),
	[body('description').isString().bail().notEmpty().trim()],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { description } = req.body;
		const [id] = await db('FirstNation').insert({ Description: description }).returning('Id');
		return res.json({ data: { id, description } });
	}
);

firstNationsRouter.put(
	'/:id',
	authorize([UserRoles.ADMINISTRATOR, UserRoles.SITE_ADMIN]),
	[
		param('id').isInt({ gt: 0 }),
		body('description').isString().bail().notEmpty().trim(),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const id = parseInt(req.params.id);
		const { description } = req.body;
		await db('FirstNation').where({ Id: id }).update({ Description: description });
		return res.json({ data: { id, description } });
	}
);

