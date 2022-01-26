import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";

export const catalogsRouter = express.Router();
const db = knex(DB_CONFIG);

catalogsRouter.get('/community', async (req: Request, res: Response) => {
  const community = await db('Community').orderBy('Community.id', 'asc');

  res.send(community);
});

catalogsRouter.get('/originalmedia', async (req: Request, res: Response) => {
  const media = await db('OriginalMedia').orderBy('OriginalMedia.id', 'asc');

  res.send(media);
});

catalogsRouter.get('/vesseltype',
  async (req: Request, res: Response) => {
    const { textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);
    const offset = (page * limit) || 0;
    let counter = [{ count: 0 }];

    let types = [];

    if (textToMatch) {
      counter = await db.from('Boat.Type')
        .where('Boat.Type.Type', 'like', `%${textToMatch}%`)
        .count('Id', { as: 'count' });

      types = await db.from('Boat.Type')
        .where('Boat.Type.Type', 'like', `%${textToMatch}%`)
        .orderBy(`${sortBy}`, `${sort}`)
        .limit(limit).offset(offset);

    } else {
      counter = await db.from('Boat.Type').count('Id', { as: 'count' });

      types = await db.select('*')
        .from('Boat.Type').orderBy(`${sortBy}`, `${sort}`)
        .limit(limit).offset(offset);;

    }

    res.status(200).send({ count: counter[0].count, body: types });
  });

catalogsRouter.put('/vesseltype/:vesselId',
  [param("vesselId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { vesselId } = req.params;
    const { vesselType = {} } = req.body;

    await db('boat.Type')
      .update(vesselType)
      .where('boat.Type.Id', vesselId);


    res.status(200).send({ message: 'success' });
  });

// changed this route from "/new" to "/" to follow RESTFUL conventions
catalogsRouter.post('/vesseltype',
  async (req: Request, res: Response) => {
    /*  const db = req.app.get('db');
   
     const permissions = req.decodedToken['yg-claims'].permissions;
     if (!permissions.includes('create')) res.sendStatus(403); */

    const { vesselType = {} } = req.body;

    const response = await db.insert(vesselType)
      .into('boat.Type')
      .returning('*');

    res.status(200).send(response);
  });

  
catalogsRouter.get('/placetype',
async (req: Request, res: Response) => {
  const { textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page * limit) || 0;
  let counter = [{ count: 0 }];

  let types = [];

  if (textToMatch) {
    counter = await db.from('Place.PlaceTypeLookup')
      .where('PlaceTypeLookup.PlaceType', 'like', `%${textToMatch}%`)
      .count('Id', { as: 'count' });

    types = await db.from('Place.PlaceTypeLookup')
      .where('Place.PlaceTypeLookup.PlaceType', 'like', `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);

  } else {
    counter = await db.from('Place.PlaceTypeLookup').count('Id', { as: 'count' });

    types = await db.select('*')
      .from('Place.PlaceTypeLookup').orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);;

  }

  res.status(200).send({ count: counter[0].count, body: types });
});

catalogsRouter.post('/placetype',
  async (req: Request, res: Response) => {
    const { placeType = {} } = req.body;

    const response = await db.insert(placeType)
      .into('Place.PlaceTypeLookup')
      .returning('*');

    res.status(200).send(response);
  });

catalogsRouter.put('/placetype/:placeTypeId',
  [param("placeTypeId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { placeTypeId } = req.params;
    const { placeType = {} } = req.body;

    await db('place.PlaceTypeLookup')
      .update(placeType)
      .where('place.PlaceTypeLookup.id', placeTypeId);


    res.status(200).send({ message: 'success' });
  });

