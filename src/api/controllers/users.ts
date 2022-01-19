import { Request, Response, Router } from 'express';

var router = Router();

import { RequiresAuthentication } from '../middleware';
var _ = require('lodash'); //added for testing
// router.use(express.json()); // for parsing application/json
// router.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

router.get('/', RequiresAuthentication, async (req: Request, res: Response) => {
	const db = req.app.get('db');

	const {
		page = 0,
		limit = 10,
		textToMatch = '',
		sortBy = 'UserId',
		sort = 'asc',
	} = req.query;
	const offset = Number(page) * Number(limit) || 0;
	let counter = 0;
	let aircrashes = [];

	if (textToMatch) {
		counter = await db
			.from('dbo.Ibbit_User')
			.where('Email', 'like', `%${textToMatch}%`)
			.orWhere('FirstName', 'like', `%${textToMatch}%`)
			.orWhere('LastName', 'like', `%${textToMatch}%`)
			.orWhere('CreateDate', 'like', `%${textToMatch}%`)
			.count('UserId', { as: 'count' });

		aircrashes = await db
			.from('dbo.Ibbit_User')
			.where('Email', 'like', `%${textToMatch}%`)
			.orWhere('FirstName', 'like', `%${textToMatch}%`)
			.orWhere('LastName', 'like', `%${textToMatch}%`)
			.orWhere('CreateDate', 'like', `%${textToMatch}%`)
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	} else {
		counter = await db
			.from('dbo.Ibbit_User')
			.count('UserId', { as: 'count' })
			.first();

		aircrashes = await db
			.from('dbo.Ibbit_User')
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	}

	res.status(200).send({ count: counter, body: aircrashes });
});

router.get(
	'/:userId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		const { userId } = req.params;

		const user = await db
			.column('IU.*', 'HSU.ExpirationDate')
			.select()
			.from('dbo.Ibbit_User as IU')
			.join('dbo.HSUser as HSU', 'HSU.UserId', '=', 'IU.UserId')
			.where('IU.UserId', userId)
			.first();

		user.access = await db
			.select('*')
			.from('dbo.HSUserAccess')
			.where('dbo.HSUserAccess.UserId', userId);

		if (!user) {
			res.status(403).send('User id not found');
			return;
		}

		res.status(200).send(user);
	}
);

router.put(
	'/:userId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { userId } = req.params;

		const { user = {}, expirationDate, access } = req.body;

		//updates the main user table
		const updatedUser = await db('dbo.Ibbit_User')
			.update(user)
			.where('dbo.Ibbit_User.UserId', userId)
			.returning('*');
		if (updatedUser) {
			//updates the expiration date
			await db('dbo.Ibbit_User')
				.update({ ExpirationDate: expirationDate })
				.where('dbo.Ibbit_User.UserId', userId);
			// updates the user access
			// await db('dbo.HSUserAccess')
			// .where('dbo.HSUserAccess.UserId', userId);
		} else {
			res.status(404).send({ message: `User not found` });
			return;
		}

		res.status(200).send({ message: 'success' });
	}
);

router.get(
	'/access/:userId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { userId } = req.params;
		const exists = await db
			.select('*')
			.from('dbo.Ibbit_User')
			.where('dbo.Ibbit_User.UserId', userId)
			.returning('*');

		if (!exists) {
			res.status(404).send({ message: 'User not found' });
			return;
		}

		const access = await db
			.select('*')
			.from('dbo.Website_UserAccess')
			.where('dbo.Website_UserAccess.UserID', userId)
			.returning('*');

		if (!access) {
			res.status(200).send({ message: 'User has no permissions loaded' });
			return;
		}

		res.status(200).send(access);
	}
);

router.put(
	'/access/:userId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		// const permissions = req.decodedToken['yg-claims'].permissions;
		// if(!permissions.includes('edit')) res.sendStatus(403);

		const { userId } = req.params;
		const { access } = req.body;
		const exists = await db
			.select('*')
			.from('dbo.Ibbit_User')
			.where('dbo.Ibbit_User.UserId', userId)
			.returning('*');

		if (!exists) {
			res.status(404).send({ message: 'User not found' });
			return;
		}

		const editedAccess = access.filter((x: { UAID: any }) => x.UAID);
		const newAccess = access.filter((x: { UAID: any }) => !x.UAID);
		if (editedAccess.length > 0) {
			editedAccess.forEach(async (access: { UAID: any }) => {
				const accessBody = { ...access };
				delete accessBody.UAID;
				await db('dbo.Website_UserAccess')
					.update(accessBody)
					.where('dbo.Website_UserAccess.UAID', access.UAID)
					.returning('*');
			});
		}

		if (newAccess.length > 0) {
			await db
				.insert(newAccess)
				.into('dbo.Website_UserAccess')
				.returning('*')
				.then((rows: any) => {
					return rows;
				});
		}

		res.status(200).send({ message: 'success' });
	}
);

module.exports = router;
