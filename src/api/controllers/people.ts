import { Request, Response } from 'express';
var express = require('express');
var router = express.Router();

import { RequiresAuthentication } from '../middleware';
var _ = require('lodash'); //added for testing
router.use(express.json()); // for parsing application/json
router.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

router.get('/', RequiresAuthentication, async (req: Request, res: Response) => {
	const db = req.app.get('db');

	const {
		page = 0,
		limit = 10,
		textToMatch = '',
		sortBy = 'PersonId',
		sort = 'asc',
	} = req.query;
	const offset = Number(page) * Number(limit) || 0;
	let counter = 0;
	let people = [];

	if (textToMatch) {
		counter = await db
			.from('Person.Person')
			.where('Surname', 'like', `%${textToMatch}%`)
			.orWhere('GivenName', 'like', `%${textToMatch}%`)
			.orWhere('BirthYear', 'like', `%${textToMatch}%`)
			.orWhere('BirthAccuracy', 'like', `%${textToMatch}%`)
			.orWhere('DeathYear', 'like', `%${textToMatch}%`)
			.orWhere('DeathAccuracy', 'like', `%${textToMatch}%`)
			.count('PersonID', { as: 'count' });

		people = await db
			.from('Person.Person')
			.where('Surname', 'like', `%${textToMatch}%`)
			.orWhere('GivenName', 'like', `%${textToMatch}%`)
			.orWhere('BirthYear', 'like', `%${textToMatch}%`)
			.orWhere('BirthAccuracy', 'like', `%${textToMatch}%`)
			.orWhere('DeathYear', 'like', `%${textToMatch}%`)
			.orWhere('DeathAccuracy', 'like', `%${textToMatch}%`)
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	} else {
		counter = await db
			.from('Person.Person')
			.count('PersonID', { as: 'count' })
			.first();

		people = await db
			.from('Person.Person')
			.orderBy(`${sortBy}`, `${sort}`)
			.limit(limit)
			.offset(offset);
	}

	res.status(200).send({ count: counter, body: people });
});

router.get(
	'/:personId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');
		const { personId } = req.params;

		const person = await db
			.from('Person.Person')
			.where('Person.PersonID', personId)
			.first();

		if (!person) {
			res.status(403).send('Person id not found');
			return;
		}

		res.status(200).send(person);
	}
);

//Modify Person
router.put(
	'/:personId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { personId } = req.params;

		const { person = {} } = req.body;

		const updatePerson = await db('Person.Person')
			.update(person)
			.where('Person.Person.PersonID', personId)
			.returning('*');

		if (updatePerson.length == 0) {
			res.status(404).send({ message: `Couldn´t find the person` });
		}

		res.status(200).send({ message: 'success' });
	}
);

//Add Person
router.post(
	'/',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { person } = req.body;

		const newPerson = await db
			.insert(person)
			.into('Person.Person')
			.returning('*');

		if (!newPerson) {
			res.status(400).send({ message: `The data sent is wrong or incomplete` });
			return;
		}

		res.status(200).send({ message: 'success' });
	}
);

router.get(
	'/:personId/histories',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { personId } = req.params;

		const histories = await db
			.from('Person.History')
			.where('History.PersonID', personId);

		if (histories.length == 0) {
			res.status(200).send({
				message: 'The person doesnt exist or doesn´t have any historc records',
			});
			return;
		}

		res.status(200).send({ histories });
	}
);
//Modify history
router.put(
	'/history/:historyId',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { historyId } = req.params;

		const { history } = req.body;

		const updateHistory = await db('Person.History')
			.update(history)
			.where('Person.History.PersonHistID', historyId)
			.returning('*');

		if (updateHistory.length == 0) {
			res
				.status(404)
				.send({ message: `Couldn't find the desired history record` });
			return;
		}

		res.status(200).send({ message: 'success' });
	}
);

//Add history
router.post(
	'/:personId/history',
	RequiresAuthentication,
	async (req: Request, res: Response) => {
		const db = req.app.get('db');

		const { personId } = req.params;

		const { history } = req.body;

		history.PersonID = personId;

		const exists = await db
			.from('Person.History')
			.where('History.PersonID', personId)
			.returning('*');

		if (!exists) {
			res.status(404).send({ message: 'The person doesnt exist' });
			return;
		}

		const newHistory = await db
			.insert(history)
			.into('Person.History')
			.returning('*');

		if (!newHistory) {
			res.status(400).send({ message: `The data sent is wrong or incomplete` });
			return;
		}

		res.status(200).send({ message: 'success' });
	}
);
/* Delete history record (OPTIONAL, COMMENTED FOR SECURITY PURPOSES... UNCOMMENT IF NEEDED )
router.delete('/history/:historyId', RequiresAuthentication, async (req, res) => {
    const db = req.app.get('db');
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('edit')) res.sendStatus(403);
  
    const { historyId } = req.params;
    
    const resp = await db('Person.History')
        .where('Person.History.PersonHistID', historyId)
        .del()
        .returning('*');

    console.log(res);
    if(!resp){
      res.status(404).send({ message: `Couldn't find the desired history record`});
      return;
    }
  
    res.status(200).send({ message: 'success' });
});
*/

module.exports = router;
