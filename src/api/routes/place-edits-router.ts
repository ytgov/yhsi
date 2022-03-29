import express, { Request, Response } from 'express';
import knex from 'knex';

import { DB_CONFIG } from '../config';

export const placeEditsRouter = express.Router();
const db = knex(DB_CONFIG);

placeEditsRouter.get('/', (req: Request, res: Response) => {
	return db
		.select({
			id: 'PlaceEdit.Id',
			yhsiId: 'YHSIId',
			primaryName: 'PrimaryName',
			editorId: 'EditorUserId',
			editorEmail: 'Security.User.Email',
		})
		.from('PlaceEdit')
		.innerJoin('Security.User', 'Security.User.Id', 'PlaceEdit.EditorUserId')
		.then((results) => {
			return res.json({ data: results });
		})
		.catch((error) => {
			return res.status(422).json({
				messages: [{ variant: 'error', text: error.message }],
			});
		});
});
