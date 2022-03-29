import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";

export const historiesRouter = express.Router();
const db = knex(DB_CONFIG);

historiesRouter.get('/:id',
  [param("id").notEmpty()],
  [query("page").default(0).isInt(), query("limit").default(10).isInt({ gt: 0 })], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page * limit) || 0;

    // this parameter is used in the query below, but not sure what this means
    let boatId = parseInt(req.params.id as string);

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

historiesRouter.get('/owner/:id',
  [param("id").notEmpty()],
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page * limit) || 0;


    // this parameter is used in the query below, but not sure what this means - Resp : sorry this was unfinished code mb.
    const ownerid = parseInt(req.params.id as string);

    const histories = await db.select('*')
      .from('Boat.OwnerHistory')
      // .join('boat.Owner', 'boat.BoatOwner.ownerid', '=', 'boat.owner.id')
      // .orderBy('boat.boatowner.ownerid', 'asc')
      .where('Boat.OwnerHistory.OwnerId', ownerid)
      .orderBy('')
      .limit(limit).offset(offset);

    res.status(200).send(histories);
  });

historiesRouter.post('/owner/new',
  async (req: Request, res: Response) => {

    const { history = {} } = req.body;

    const response = await db.insert(history)
      .into('boat.OwnerHistory')
      .returning('*');

    res.status(200).send(response);

  });

historiesRouter.put('/owner/:historyId',
  [param("historyId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {

    const { history } = req.body;
    const { historyId } = req.params;
    //make the update
    let resp = await db('boat.OwnerHistory')
      .update(history)
      .where('boat.OwnerHistory.Id', historyId);

    res.status(200).send({ message: 'success', resp});
  });
