import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";

export const historiesRouter = express.Router();
const db = knex(DB_CONFIG);

historiesRouter.get('/',
  [query("page").default(0).isInt(), query("limit").default(10).isInt({ gt: 0 })], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    /* const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db'); */
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page * limit) || 0;

    // this parameter is used in the query below, but not sure what this means
    let boatId = 0;

    const histories = await db.select('*')
      .from('Boat.History')
      // .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
      // .orderBy('boat.boatowner.ownerid', 'asc')
      .where('boat.history.uid', boatId)
      .limit(limit).offset(offset);

    res.status(200).send(histories);
  });

// changed this route from "/new" to "/" to follow RESTFUL conventions
historiesRouter.post('/',
  async (req: Request, res: Response) => {
    /* const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403); */

    const { history = {} } = req.body;

    const response = await db.insert(history)
      .into('boat.History')
      .returning('*');

    res.status(200).send(response);

  });

historiesRouter.put('/:historyId',
  [param("historyId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    /* const db = req.app.get('db');
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('edit')) res.sendStatus(403); */

    const { history } = req.body;
    const { historyId } = req.params;
    //make the update
    await db('boat.History')
      .update(history)
      .where('boat.History.id', historyId);

    res.status(200).send({ message: 'success' });
  });

//OWNER HISTORIES

historiesRouter.get('/owner/',
  async (req: Request, res: Response) => {
    /* const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('view')) res.sendStatus(403);
  
    const db = req.app.get('db'); */
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page * limit) || 0;


    // this parameter is used in the query below, but not sure what this means
    let boatId = 0;

    const histories = await db.select('*')
      .from('Boat.History')
      // .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
      // .orderBy('boat.boatowner.ownerid', 'asc')
      .where('boat.history.uid', boatId)
      .limit(limit).offset(offset);

    res.status(200).send(histories);
  });

historiesRouter.post('/owner/new',
  async (req: Request, res: Response) => {
    /* const db = req.app.get('db');
  
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('create')) res.sendStatus(403); */

    const { history = {} } = req.body;

    const response = await db.insert(history)
      .into('boat.OwnerHistory')
      .returning('*');

    res.status(200).send(response);

  });

historiesRouter.put('/owner/:historyId',
  [param("historyId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    /* const db = req.app.get('db');
    const permissions = req.decodedToken['yg-claims'].permissions;
    if (!permissions.includes('edit')) res.sendStatus(403); */

    const { history } = req.body;
    const { historyId } = req.params;
    //make the update
    await db('boat.OwnerHistory')
      .update(history)
      .where('boat.OwnerHistory.Id', historyId);

    res.status(200).send({ message: 'success' });
  });
