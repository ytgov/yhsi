import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";

export const ytPlaceHistoryRouter = express.Router();
const db = knex(DB_CONFIG);

ytPlaceHistoryRouter.post('/',
  async (req: Request, res: Response) => {
    const history = req.body;
    history.placeId = parseInt(history.placeId);

    const response = await db.insert(history)
      .into('Place.PlaceHistory')
      .returning('*');

    res.status(200).send(response); 

  });

  ytPlaceHistoryRouter.put('/:historyId',
  [param("historyId").notEmpty()], ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const history = req.body;
    const { historyId } = req.params;
    //make the update
    await db('Place.PlaceHistory')
      .update(history)
      .where('Place.PlaceHistory.id', historyId);

    res.status(200).send({ message: 'success' });
  });
