import { Request, Response } from 'express';
var express = require('express');
var router = express.Router();
// const cors = require('cors')//
// router.use(cors());
// router.all('*', cors());
import { RequiresAuthentication } from '../middleware';

// router.get('/', RequiresAuthentication, async (req: Request, res: Response) => {
// 	const db = req.app.get('db');
// 	const { page = 0, limit = 10 } = req.query;
// 	const offset = Number(page) * Number(limit) || 0;

// 	const histories = await db
// 		.select('*')
// 		.from('Boat.History')
// 		// .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
// 		// .orderBy('boat.boatowner.ownerid', 'asc')
// 		.where('boat.history.uid', boatId)
// 		.limit(limit)
// 		.offset(offset);

// 	res.status(200).send(histories);
// });

router.post(
	'/new',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { history = {} } = req.body;

		const response = await db
			.insert(history)
			.into('boat.History')
			.returning('*');

		res.status(200).send(response);
	}
);

router.put(
	'/:historyId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { history } = req.body;
		const { historyId } = req.params;
		//make the update
		await db('boat.History')
			.update(history)
			.where('boat.History.id', historyId);

		res.status(200).send({ message: 'success' });
	}
);

//OWNER HISTORIES

// router.get(
// 	'/owner/',
//
// 	async (req: Request, res: Response) => {
// 		const db = req.app.get('db');
// 		const { page = 0, limit = 10 } = req.query;
// 		const offset = Number(page) * Number(limit) || 0;

// 		const histories = await db
// 			.select('*')
// 			.from('Boat.History')
// 			// .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
// 			// .orderBy('boat.boatowner.ownerid', 'asc')
// 			.where('boat.history.uid', boatId)
// 			.limit(limit)
// 			.offset(offset);

// 		res.status(200).send(histories);
// 	}
// );

router.post(
	'/owner/new',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { history = {} } = req.body;

		const response = await db
			.insert(history)
			.into('boat.OwnerHistory')
			.returning('*');

		res.status(200).send(response);
	}
);

router.put(
	'/owner/:historyId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { history } = req.body;
		const { historyId } = req.params;
		//make the update
		await db('boat.OwnerHistory')
			.update(history)
			.where('boat.OwnerHistory.Id', historyId);

		res.status(200).send({ message: 'success' });
	}
);

module.exports = router;
