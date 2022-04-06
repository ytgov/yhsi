import express, { Request, Response } from "express";
import { DB_CONFIG } from '../config';
import knex from "knex";
import { ReturnValidationErrors } from '../middleware';
import { param, query } from 'express-validator';
import { PeopleService } from "../services";
import { renderFile } from "pug";
import { generatePDF } from "../utils/pdf-generator";

const peopleService = new PeopleService();
export const peopleRouter = express.Router();
const db = knex(DB_CONFIG);

peopleRouter.get(
  '/',
  [
    query('page').default(0).isInt(),
    query('limit').default(10).isInt({ gt: 0 }),
    query('textToMatch').default('').isString(),
    query('sortBy').default('PersonId').isString(),
    query('sort').default('asc').isString(),
  ],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
	const limit = parseInt(req.query.limit as string);
    const textToMatch = (req.query.textToMatch as string);
    const sortBy = (req.query.sortBy as string);
    const sort = (req.query.sort as string);

	const offset = page * limit || 0;

    let counter = 0;
    let data = await peopleService.doSearch(page, limit, offset,{sortBy, sort, textToMatch});

    res.status(200).send(data);
  }
);

peopleRouter.get(
  '/:personId',
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
		const { personId } = req.params;
	////console.log(personId);
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
peopleRouter.put(
	'/:personId',
	ReturnValidationErrors,
	async (req: Request, res: Response) => {

		const { personId } = req.params;
		const { person = {} } = req.body;
		// console.log(person);
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

peopleRouter.post(
  '/',
  ReturnValidationErrors,
  async (req: Request, res: Response) => {

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

peopleRouter.get(
  '/:personId/histories',
  ReturnValidationErrors,
  async (req: Request, res: Response) => {

    const { personId } = req.params;

		const histories = await db
			.from('Person.History')
			.where('History.PersonID', personId)
			.orderBy('SeqID', 'desc');

		if (histories.length == 0) {
			res.status(200).send({
				message: 'The person doesnt exist or doesn´t have any historc records',
			});
			return;
		}

		res.status(200).send({ histories });
  }
);

peopleRouter.put(
  '/history/:historyId',
  ReturnValidationErrors,
  async (req: Request, res: Response) => {

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

peopleRouter.post(
	'/:personId/history',
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
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

peopleRouter.post('/pdf',   
ReturnValidationErrors,
async (req: Request, res: Response) => {
	const { page = 0, limit = 0, textToMatch = '', sortBy = '', sort } = req.body;
		//console.log(req.body);
	const offset = 0;
	let people = await peopleService.doSearch(page, limit, offset, { sortBy, sort, textToMatch });
	// not working right now
	// Compile template.pug, and render a set of data
	let data = renderFile('./templates/people/peopleGrid.pug', {
		data: people.body
	});

	let pdf = await generatePDF(data)
	res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
	res.setHeader('Content-type', 'application/pdf');
	res.send(pdf);
});

peopleRouter.post(
	'/pdf/:personId',
	[param('personId').notEmpty()],
	ReturnValidationErrors,
	async (req: Request, res: Response) => {
		const { personId } = req.params;

		const person = await peopleService.getById(personId);

		let data = renderFile('./templates/people/peopleView.pug', {
			data: person
		});

		let pdf = await generatePDF(data)
		res.setHeader('Content-disposition', 'attachment; filename="burials.html"');
		res.setHeader('Content-type', 'application/pdf');
		res.send(pdf);
});

peopleRouter.post('/export',
	  ReturnValidationErrors,
	  async (req: Request, res: Response) => {
		const { page = 0, limit = 0, textToMatch = '', sortBy = '', sort } = req.body;
		//console.log(req.body);
		const offset = 0;
		let data = await peopleService.doSearch(page, limit, offset, { sortBy, sort, textToMatch });
		res.status(200).send(data.body);
});
