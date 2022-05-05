import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config";
import knex from "knex";
import { ReturnValidationErrors } from "../middleware";
import { param, query } from "express-validator";
import { CatalogService } from "../services";
const catalogService = new CatalogService();
export const catalogsRouter = express.Router();
const db = knex(DB_CONFIG);
//const staticService = new StaticService(DB_CONFIG);

catalogsRouter.get("/community", async (req: Request, res: Response) => {
  const community = await db("Community").orderBy("Community.id", "asc");

  res.send(community);
});

catalogsRouter.get("/originalmedia", async (req: Request, res: Response) => {
  const media = await db("OriginalMedia").orderBy("OriginalMedia.id", "asc");

  res.send(media);
});

catalogsRouter.get("/vesseltype", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Id", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  let counter = [{ count: 0 }];

  let types = [];

  if (textToMatch) {
    counter = await db
      .from("Boat.Type")
      .where("Boat.Type.Type", "like", `%${textToMatch}%`)
      .count("Id", { as: "count" });

    types = await db
      .from("Boat.Type")
      .where("Boat.Type.Type", "like", `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit)
      .offset(offset);
  } else {
    counter = await db.from("Boat.Type").count("Id", { as: "count" });

    types = await db
      .select("*")
      .from("Boat.Type")
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit)
      .offset(offset);
  }

  res.status(200).send({ count: counter[0].count, body: types });
});

catalogsRouter.put(
  "/vesseltype/:vesselId",
  [param("vesselId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { vesselId } = req.params;
    const { vesselType = {} } = req.body;

    await db("boat.Type").update(vesselType).where("boat.Type.Id", vesselId);

    res.status(200).send({ message: "success" });
  }
);

// changed this route from "/new" to "/" to follow RESTFUL conventions
catalogsRouter.post("/vesseltype", async (req: Request, res: Response) => {
  /*  const db = req.app.get('db');
   
     const permissions = req.decodedToken['yg-claims'].permissions;
     if (!permissions.includes('create')) res.sendStatus(403); */

  const { vesselType = {} } = req.body;

  const response = await db.insert(vesselType).into("boat.Type").returning("*");

  res.status(200).send(response);
});

catalogsRouter.get("/placetype", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Id", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  let counter = [{ count: 0 }];

  let types = [];

  if (textToMatch) {
    counter = await db
      .from("Place.PlaceTypeLookup")
      .where("PlaceTypeLookup.PlaceType", "like", `%${textToMatch}%`)
      .count("Id", { as: "count" });

    types = await db
      .from("Place.PlaceTypeLookup")
      .where("Place.PlaceTypeLookup.PlaceType", "like", `%${textToMatch}%`)
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit)
      .offset(offset);
  } else {
    counter = await db
      .from("Place.PlaceTypeLookup")
      .count("Id", { as: "count" });

    types = await db
      .select("*")
      .from("Place.PlaceTypeLookup")
      .orderBy(`${sortBy}`, `${sort}`)
      .limit(limit)
      .offset(offset);
  }

  res.status(200).send({ count: counter[0].count, body: types });
});

catalogsRouter.post("/placetype", async (req: Request, res: Response) => {
  const { placeType = {} } = req.body;

  const response = await db
    .insert(placeType)
    .into("Place.PlaceTypeLookup")
    .returning("*");

  res.status(200).send(response);
});

catalogsRouter.put(
  "/placetype/:placeTypeId",
  [param("placeTypeId").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { placeTypeId } = req.params;
    const { placeType = {} } = req.body;

    await db("place.PlaceTypeLookup")
      .update(placeType)
      .where("place.PlaceTypeLookup.id", placeTypeId);

    res.status(200).send({ message: "success" });
  }
);

//RELIGION

catalogsRouter.get("/religion/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Religion", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  let counter = [{ count: 0 }];
  const data = await catalogService.doReligionSearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.get("/religion", async (req: Request, res: Response) => {
  const data = await catalogService.getAllReligions();

  res.send(data);
});

catalogsRouter.put(
  "/religion/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    await db("Burial.ReligionLookup").update(data).where("Burial.ReligionLookup.ReligionLupID", id);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.post("/religion", async (req: Request, res: Response) => {
  const { data = {} } = req.body;                   

  const response = await db
    .insert(data)
    .into("Burial.ReligionLookup")
    .returning("*");

  res.status(200).send(response);
});

//CAUSES

catalogsRouter.get("/cause/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Cause", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  let counter = [{ count: 0 }];
  const data = await catalogService.doCauseSearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.get("/cause", async (req: Request, res: Response) => {
  const data = await catalogService.getAllCauses();

  res.send(data);
});

catalogsRouter.put(
  "/cause/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    await db("Burial.CauseLookup").update(data).where("Burial.CauseLookup.CauseLUpID", id);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.post("/cause", async (req: Request, res: Response) => {
  const { data = {} } = req.body;
    console.log(data);
  const response = await db
    .insert(data)
    .into("Burial.CauseLookup")
    .returning("*");

  res.status(200).send(response);
});

//CEMETARIES

catalogsRouter.get("/cemetary/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Cemetary", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  const data = await catalogService.doCemetarySearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.get("/cemetary", async (req: Request, res: Response) => {
  const data = await catalogService.getAllCemetaries();

  res.send(data);
});

catalogsRouter.put(
  "/cemetary/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body; 

    await db("Burial.CemetaryLookup").update(data).where("Burial.CemetaryLookup.CemetaryLUpID", id);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.post("/cemetary", async (req: Request, res: Response) => {
  const { data = {} } = req.body;
  
  const response = await db
    .insert(data)
    .into("Burial.CemetaryLookup")
    .returning("*");

  res.status(200).send(response);
});

//OCCUPATIONS

catalogsRouter.get("/occupation/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Occupation", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  const data = await catalogService.doOccupationSearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.get("/occupation", async (req: Request, res: Response) => {
  const data = await catalogService.getAllOcupations();

  res.send(data);
});

catalogsRouter.put(
  "/occupation/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    await db("Burial.OccupationLookup").update(data).where("Burial.OccupationLookup.OccupationLupID", id);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.post("/occupation", async (req: Request, res: Response) => {
  const { data = {} } = req.body;

  const response = await db
    .insert(data)
    .into("Burial.OccupationLookup")
    .returning("*");

  res.status(200).send(response);
});

//MEMBERSHIPS

catalogsRouter.get("/membership/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Membership", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  const data = await catalogService.doMembershipSearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.get("/membership", async (req: Request, res: Response) => {
  const data = await catalogService.getAllMemberships();

  res.send(data);
});

catalogsRouter.put(
  "/membership/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    await db("Burial.MembershipLookup").update(data).where("Burial.MembershipLookup.MembershipLupID", id);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.post("/membership", async (req: Request, res: Response) => {
  const { data = {} } = req.body;

  const response = await db
    .insert(data)
    .into("Burial.MembershipLookup")
    .returning("*");

  res.status(200).send(response);
});

//RELATIONSHIPS


catalogsRouter.get("/relationship/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Relationship", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  const data = await catalogService.doRelationshipSearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.get("/relationship", async (req: Request, res: Response) => {

  const data = await catalogService.getAllRelationships();

  res.send(data);
});

catalogsRouter.put(
  "/relationship/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    await db("Burial.RelationLookup").update(data).where("Burial.RelationLookup.RelationLupID", id);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.post("/relationship", async (req: Request, res: Response) => {
  const { data = {} } = req.body;

  const response = await db
    .insert(data)
    .into("Burial.RelationLookup")
    .returning("*");

  res.status(200).send(response);
});

//ROUTES
catalogsRouter.get("/route", async (req: Request, res: Response) => {
  const response = await catalogService.getAllRoutes();

  res.status(200).send(response);
});


//ASSET TYPES
catalogsRouter.get("/asset-type", async (req: Request, res: Response) => {
  const response = await catalogService.getAllAssetTypes();
  res.status(200).send(response);
});

catalogsRouter.post("/asset-type", async (req: Request, res: Response) => {
  const { data = {} } = req.body;

  const response = await catalogService.newAssetType(data);

  res.status(200).send(response);
});

catalogsRouter.put(
  "/asset-type/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    let resObj = await catalogService.modifyAssetType(parseInt(id), data);

    console.log(resObj);

    res.status(200).send({ message: "success" });
  }
);

catalogsRouter.get("/asset-type/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Type", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  const data = await catalogService.doAssetTypeSearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

//CATEGORIES
catalogsRouter.get("/category", async (req: Request, res: Response) => {
  const response = await catalogService.getAllCategories();
  res.status(200).send(response);
});

catalogsRouter.get("/category/search", async (req: Request, res: Response) => {
  const { textToMatch = "", sortBy = "Category", sort = "asc" } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = parseInt(req.query.limit as string);
  const offset = page * limit || 0;
  const data = await catalogService.doCategorySearch(page, limit, offset, { textToMatch, sortBy, sort });

  res.send(data);
});

catalogsRouter.post("/category", async (req: Request, res: Response) => {
  const { data = {} } = req.body;

  const response = await catalogService.newCategory(data);

  res.status(200).send(response);
});

catalogsRouter.put(
  "/category/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    let resObj = await catalogService.modifyCategory(parseInt(id), data);

    res.status(200).send({ message: "success" });
  }
);
//MAINTAINERS
catalogsRouter.get("/maintainer", async (req: Request, res: Response) => {
  const response = await catalogService.getAllMaintainers();
  res.status(200).send(response);
});

catalogsRouter.post("/maintainer", async (req: Request, res: Response) => {
  const { data = {} } = req.body;

  const response = await catalogService.newMaintainer(data);

  res.status(200).send(response);
});

catalogsRouter.put(
  "/maintainer/:id",
  [param("id").notEmpty()],
  ReturnValidationErrors,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data = {} } = req.body;

    let resObj = await catalogService.modifyMaintainer(parseInt(id), data);
    console.log(resObj);
    res.status(200).send({ message: "success" });
  }
);


