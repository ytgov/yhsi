import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import { body, check, query, validationResult } from "express-validator";
import { PlaceService, StaticService } from "../services";
import { Place } from "../data";

const placeService = new PlaceService(DB_CONFIG);
const staticService = new StaticService(DB_CONFIG);
const PAGE_SIZE = 5;

export const placeRouter = express.Router();

placeRouter.get("/",
    [
        query("page").default(1).isInt({ gt: 0 })
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let page = parseInt(req.query.page as string);
        let skip = (page - 1) * PAGE_SIZE;
        let take = PAGE_SIZE;

        let list = await placeService.getAll(skip, take)
            .then(data => data)
            .catch((err) => { console.error("Database Error", err); return undefined; });

        let item_count = await placeService.getPlaceCount()
            .then(data => data)
            .catch((err) => { console.error("Database Error", err); return 0; });

        let page_count = Math.ceil(item_count / PAGE_SIZE);

        if (list) {
            return res.json({ data: list, meta: { page, page_size: PAGE_SIZE, item_count, page_count } });
        }

        return res.status(500).send("Error")
    });

placeRouter.post("/generate-id",
    [
        body("nTSMapSheet").isString().bail().notEmpty().trim()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { nTSMapSheet } = req.body;

        let newId = await placeService.generateIdFor(nTSMapSheet);

        res.json({ data: { yHSIId: newId, nTSMapSheet } });
    });

placeRouter.get("/:id",
    [
        check("id").notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let id = parseInt(req.params.id);
        let fnList = await staticService.getFirstNations();
        let themeList = await staticService.getPlaceThemes();
        let functionalTypes = await staticService.getFunctionalTypes();

        await placeService.getById(id)
            .then(async (place) => {
                if (place) {

                    let associations = combine(await placeService.getAssociationsFor(place.id), placeService.getAssociationTypes(), 'value', 'type', 'text');
                    let fnAssociations = combine(await placeService.getFNAssociationsFor(place.id), placeService.getFNAssociationTypes(), 'value', 'firstNationAssociationType', "text");
                    fnAssociations = combine(fnAssociations, fnList, "id", "firstNationId", "description");

                    let names = await placeService.getNamesFor(place.id);
                    let historicalPatterns = combine(await placeService.getHistoricalPatternsFor(place.id), placeService.getHistoricalPatterns(), 'value', "historicalPatternType", "text");
                    let dates = combine(await placeService.getDatesFor(place.id), placeService.getDateTypes(), "value", "type", "text");
                    let constructionPeriods = combine(await placeService.getConstructionPeriodsFor(place.id), placeService.getConstructionPeriodTypes(), "value", "type", "text")
                    let themes = combine(combine(await placeService.getThemesFor(place.id), themeList, "id", "placeThemeId", "type", "typeName"), themeList, "id", "placeThemeId", "category", "categoryName");
                    let functionalUses = combine(await placeService.getFunctionUsesFor(place.id), placeService.getFunctionalUseTypes(), "value", "functionalUseType", "text", "functionalUseTypeText");
                    functionalUses = combine(functionalUses, functionalTypes, "id", "functionalTypeId", "description", "functionalTypeText")
                    let ownerships = combine(await placeService.getOwnershipsFor(place.id), placeService.getOwnershipTypes(), "value", "ownershipType", "text");
                    let previousOwnerships = await placeService.getPreviousOwnershipsFor(place.id);
                    let contacts = combine(await placeService.getContactsFor(place.id), placeService.getContactTypes(), "value", "contactType", "text", "contactTypeText");
                    let revisionLogs = combine(await placeService.getRevisionLogFor(place.id), placeService.getRevisionLogTypes(), "value", "revisionLogType", "text", "revisionLogTypeText");
                    let webLinks = combine(await placeService.getWebLinksFor(place.id), placeService.getWebLinkTypes(), "value", "type", "text");
                    let descriptions = combine(await placeService.getDescriptionsFor(place.id), placeService.getDescriptionTypes(), "value", "type", "text");
                    
                    let relationships = {
                        associations: { data: associations },
                        firstNationAssociations: { data: fnAssociations },
                        names: { data: names },
                        historicalPatterns: { data: historicalPatterns },
                        dates: { data: dates },
                        constructionPeriods: {data: constructionPeriods},
                        themes: { data: themes },
                        functionalUses: { data: functionalUses },
                        ownerships: { data: ownerships },
                        previousOwnerships: { data: previousOwnerships },
                        photos: { data: [] },
                        contacts: { data: contacts },
                        revisionLogs: { data: revisionLogs },
                        webLinks: { data: webLinks },
                        descriptions: { data: descriptions },
                    };

                    return res.send({
                        data: place,
                        relationships
                    });
                }
                else {
                    return res.status(404).send("Site not found");
                }
            })
            .catch(err => {
                console.error(err)
                return res.status(404).send("Site not found");
            })
    });

placeRouter.post("/",
    [
        body("primaryName").isString().bail().notEmpty().trim(),
        body("yHSIId").isString().bail().notEmpty().trim(),
        body("jurisdiction").isInt().bail().notEmpty(),
        body("statuteId").isInt().bail().notEmpty(),
        body("statute2Id").isInt().bail().notEmpty(),
        body("ownerConsent").isInt().bail().notEmpty(),
        body("category").isInt().bail().notEmpty(),
        body("isPubliclyAccessible").isBoolean().bail().notEmpty(),
        body("communityId").isInt().bail().notEmpty(),
        body("siteStatus").isInt().bail().notEmpty(),
        body("floorCondition").isInt().bail().notEmpty(),
        body("wallCondition").isInt().bail().notEmpty(),
        body("doorCondition").isInt().bail().notEmpty(),
        body("roofCondition").isInt().bail().notEmpty(),
        body("coordinateDetermination").isInt().bail().notEmpty(),
        body("showInRegister").isBoolean().bail().notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let result = await placeService.addPlace(req.body as Place).then(item => item)
            .catch(err => {
                return res.json({ errors: [err.originalError.info.message] });
            });

        return res.json({ data: result });
    });

placeRouter.put("/:id",
    [
        check("id").isInt().bail().notEmpty(),
        body("primaryName").isString().bail().notEmpty().trim(),
        body("yHSIId").isString().bail().notEmpty().trim(),
        body("jurisdiction").isInt().bail().notEmpty(),
        body("statuteId").isInt().bail().notEmpty(),
        body("statute2Id").isInt().bail().notEmpty(),
        body("ownerConsent").isInt().bail().notEmpty(),
        body("category").isInt().bail().notEmpty(),
        body("isPubliclyAccessible").isBoolean().bail().notEmpty(),
        body("communityId").isInt().bail().notEmpty(),
        body("siteStatus").isInt().bail().notEmpty(),
        body("floorCondition").isInt().bail().notEmpty(),
        body("wallCondition").isInt().bail().notEmpty(),
        body("doorCondition").isInt().bail().notEmpty(),
        body("roofCondition").isInt().bail().notEmpty(),
        body("coordinateDetermination").isInt().bail().notEmpty(),
        body("showInRegister").isBoolean().bail().notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let result = await placeService.updatePlace(parseInt(id), req.body as Place).then(item => item)
            .catch(err => {
                return res.json({ errors: [err.originalError.info.message] });
            });

        return res.json({ data: result });
    });

function combine(list1: Array<any>, list2: Array<any>, linker: any, linker2: any, value: any, typeText: any = "typeText"): any[] {
    list1.forEach(item => {
        let match = list2.filter(i => i[linker] == item[linker2]);

        if (match && match[0]) {
            let add = { [typeText]: match[0][value] }
            item = Object.assign(item, add)
        }
        else
            item = Object.assign(item, { [typeText]: null })
    });

    return list1;
}