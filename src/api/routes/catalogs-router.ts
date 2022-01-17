import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";
import { StaticService } from "../services";

export const catalogsRouter = express.Router();
const db = knex(DB_CONFIG);
const staticService = new StaticService(DB_CONFIG);

catalogsRouter.get('/community',
async (req: Request, res: Response) => {
  const { textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page * limit) || 0;
  let counter = [{ count: 0 }];

  let communities = [];

  if (textToMatch) {
    counter = await db.from('Community')
      .where('Name', 'like', `%${textToMatch}%`)
      .count('Id', { as: 'count' });

      communities = await db.from('Community')
      .where('Name', 'like', `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);

  } else {
    counter = await db.from('Community').count('Id', { as: 'count' });

    communities = await db.select('*')
      .from('Community').orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);;

  }

  res.status(200).send({ count: counter[0].count, body: communities });
});

catalogsRouter.post('/community',
  async (req: Request, res: Response) => {
    const { community = {} } = req.body; 

    const response = await db.insert(community)
      .into('Community')
      .returning('*');

    res.status(200).send(response);
  });


catalogsRouter.put('/community/:communityId',
  [param("communityId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const { community = {} } = req.body;

    await db('Community')
      .update(community)
      .where('community.id', communityId);

    res.status(200).send({ message: 'success' });
  });

  
catalogsRouter.get('/photo-owner',
async (req: Request, res: Response) => {
  const { textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page * limit) || 0;
  let counter = [{ count: 0 }];

  let owners = [];

  if (textToMatch) {
    counter = await db.from('PhotoOwner')
      .where('Name', 'like', `%${textToMatch}%`)
      .orWhere('Email', 'like', `%${textToMatch}%`)
      .orWhere('Address', 'like', `%${textToMatch}%`)
      .orWhere('Telephone', 'like', `%${textToMatch}%`)
      .orWhere('ContactPerson', 'like', `%${textToMatch}%`)
      .count('Id', { as: 'count' });

      owners = await db.from('PhotoOwner')
      .where('Name', 'like', `%${textToMatch}%`)
      .orWhere('Email', 'like', `%${textToMatch}%`)
      .orWhere('Address', 'like', `%${textToMatch}%`)
      .orWhere('Telephone', 'like', `%${textToMatch}%`)
      .orWhere('ContactPerson', 'like', `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);

  } else {
    counter = await db.from('PhotoOwner').count('Id', { as: 'count' });

    owners = await db.select('*')
      .from('PhotoOwner').orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);;

  }

  res.status(200).send({ count: counter[0].count, body: owners });
});


catalogsRouter.get('/photo-project',
async (req: Request, res: Response) => {
  const { textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page * limit) || 0;
  let counter = [{ count: 0 }];

  let items = [];

  if (textToMatch) {
    counter = await db.from('PhotoProject')
      .where('Name', 'like', `%${textToMatch}%`)
      .orWhere('Permit', 'like', `%${textToMatch}%`)
      .orWhere('Year', 'like', `%${textToMatch}%`)
      .orWhere('Section', 'like', `%${textToMatch}%`)
      .count('Id', { as: 'count' });

      items = await db.from('PhotoProject')
      .where('Name', 'like', `%${textToMatch}%`)
      .orWhere('Permit', 'like', `%${textToMatch}%`)
      .orWhere('Year', 'like', `%${textToMatch}%`)
      .orWhere('Section', 'like', `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);

  } else {
    counter = await db.from('PhotoProject').count('Id', { as: 'count' });

    items = await db.select('*')
      .from('PhotoProject').orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);;

  }

  let sections = await staticService.getPhotoProjectSections();
  for (let item of items) {
    item.section = sections.filter(c => c.value == item.Section)[0]; 
  }

  res.status(200).send({ count: counter[0].count, body: items });
});


catalogsRouter.get('/photo-subject',
async (req: Request, res: Response) => {
  const { textToMatch = '', sortBy = 'Id', sort = 'asc' } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = (page * limit) || 0;
  let counter = [{ count: 0 }];

  let items = [];

  if (textToMatch) {
    counter = await db.from('PhotoSubject')
      .where('Name', 'like', `%${textToMatch}%`)
      .count('Id', { as: 'count' });

      items = await db.from('PhotoSubject')
      .where('Name', 'like', `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);

  } else {
    counter = await db.from('PhotoSubject').count('Id', { as: 'count' });

    items = await db.select('*')
      .from('PhotoSubject').orderBy(`${sortBy}`, `${sort}`)
      .limit(limit).offset(offset);;

  }

  res.status(200).send({ count: counter[0].count, body: items });
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

