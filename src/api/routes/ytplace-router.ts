import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import { body, check, param, query, validationResult } from "express-validator";
import { PhotoService, YtPlaceService, SortDirection, SortStatement, StaticService } from "../services";
import { HistoricalPattern, Name, Place, Dates, PLACE_FIELDS, ConstructionPeriod, Theme, FunctionalUse, Association, FirstNationAssociation, Ownership, PreviousOwnership, Photo, WebLink, RevisionLog, Contact, Description } from "../data";
import { ReturnValidationErrors } from "../middleware";
import moment from "moment";

const ytPlaceService = new YtPlaceService(DB_CONFIG);
const staticService = new StaticService(DB_CONFIG);
const photoService = new PhotoService(DB_CONFIG);
const PAGE_SIZE = 10;

export const ytPlaceRouter = express.Router();

ytPlaceRouter.get("/",
    [query("page").default(1).isInt({ gt: 0 })], ReturnValidationErrors,
    async (req: Request, res: Response) => {


        let page = parseInt(req.query.page as string);
        let skip = (page - 1) * PAGE_SIZE;
        let take = PAGE_SIZE;

        let list = await ytPlaceService.getAll(skip, take)
            .then(data => data)
            .catch((err) => { console.error("Database Error", err); return undefined; });

        let item_count = await ytPlaceService.getPlaceCount()
            .then(data => data)
            .catch((err) => { console.error("Database Error", err); return 0; });

        let page_count = Math.ceil(item_count / PAGE_SIZE);

        if (list) {
            return res.json({ data: list, meta: { page, page_size: PAGE_SIZE, item_count, page_count } });
        }

        return res.status(500).send("Error")
    });

ytPlaceRouter.post("/search", [body("page").isInt().default(1)],
    async (req: Request, res: Response) => {
        let { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
        let sort = new Array<SortStatement>();

        sortBy.forEach((s: string, i: number) => {
            sort.push({ field: s, direction: sortDesc[i] ? SortDirection.ASCENDING : SortDirection.DESCENDING })
        })

        let skip = (page - 1) * itemsPerPage;
        let take = itemsPerPage;
        let results = await ytPlaceService.doSearch(query, sort, page, itemsPerPage, skip, take);

        /*let communities = await staticService.getCommunities();
        let categories = await staticService.getCategories();
        let statuses = await staticService.getSiteStatuses();

        for (let place of results.data) {
            place.community = communities.filter(c => c.id == place.communityId)[0];
            place.category = categories.filter(c => c.value == place.category)[0];
            place.status = statuses.filter(c => c.value == place.siteStatus)[0];
        }*/

        // Fetch place types as string with line breaks
        // Djpratt TODO - br is a placeholder
        for (let place of results.data) {    
            let placeTypes = await ytPlaceService.getPlaceTypesFor(place.id);
            
            let placeTypesString = '';
            for (let placeType of placeTypes) {  
                placeTypesString += placeType.type+'<br>';
            }
            place.placeTypes = placeTypesString;
        }

        for (let place of results.data) {    
            let firstNationNames = await ytPlaceService.getFirstNationNamesFor(place.id);
              
            let fnNamesString = '';
            for (let fnName of firstNationNames) {  
                fnNamesString += fnName.fnName+'<br>';
            } 
            place.firstNationNames = fnNamesString;
  
        }

        for (let place of results.data) {    
            let alternateNames = await ytPlaceService.getAlternateNamesFor(place.id);
              
            let altNamesString = '';
            for (let altName of alternateNames) {  
                altNamesString += altName.alternateName+'<br>';
            } 
            place.alternateNames = altNamesString;
  
        }

        res.json(results);
    });

ytPlaceRouter.post("/generate-id",
    [
        body("nTSMapSheet").isString().bail().notEmpty().trim()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { nTSMapSheet } = req.body;

        let newId = await ytPlaceService.generateIdFor(nTSMapSheet);

        res.json({ data: { yHSIId: newId, nTSMapSheet } });
    });

ytPlaceRouter.get("/:id",
    [
        check("id").notEmpty()
    ], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let id = parseInt(req.params.id);
        let fnList = await staticService.getFirstNations();

        await ytPlaceService.getById(id)
            .then(async (place) => {
                if (place) {
                    let placeTypes = await ytPlaceService.getPlaceTypesFor(place.id);
                    let fnNames = await ytPlaceService.getFirstNationNamesFor(place.id);
                    let altNames = await ytPlaceService.getAlternateNamesFor(place.id);
                    let histories = await ytPlaceService.getPlaceHistoriesFor(place.id);                 

                    // TODO: add function photoService to fetch all photos given an array of rowids (or something)
                    //let photos = await photoService.getAllForPlace(place.id);
                    //let placePhotos = await ytPlaceService.getPlacePhotosFor(place.id);
                    //let photos = combine(getPhotos, placePhotos, "rowId", "photoRowId", Photo);
 
                    let fnAssociations = await ytPlaceService.getFNAssociationsFor(place.id);
                    fnAssociations = combine(fnAssociations, fnList, "firstNationId", "id", "description");               

                    let relationships = {
                        placeTypes: { data: placeTypes },
                        fnNames: { data: fnNames },
                        altNames: { data: altNames },
                        histories: { data: histories },
                        fnAssociations: { data: fnAssociations },
                        //photos: { data: photos },
                    };

                    return res.send({
                        data: place,
                        relationships
                    });
                }
                else {
                    return res.status(404).send("Place not found");
                }
            })
            .catch(err => {
                console.error(err)
                return res.status(404).send("Place not found");
            })
    });

ytPlaceRouter.post("/",
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

        let result = await ytPlaceService.addPlace(req.body as Place).then(item => item)
            .catch(err => {
                return res.json({ errors: [err.originalError.info.message] });
            });

        return res.json({ data: result });
    });

ytPlaceRouter.put("/:id/summary",
    [
        param("id").isInt().notEmpty(),
        body("primaryName").isString().bail().notEmpty().trim(),
        body("showInRegister").isBoolean().notEmpty()
    ], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { secondaryNames, historicalPatterns } = req.body;
        let updater = req.body;
        delete updater.secondaryNames;
        delete updater.historicalPatterns;
        delete updater.yHSIId;

        updater.siteCategories = (updater.siteCategories as string[]).join(',')

        console.log(updater)

        await ytPlaceService.updatePlace(parseInt(id), updater);
        let oldNames = await ytPlaceService.getNamesFor(parseInt(id));
        secondaryNames = secondaryNames.map((n: Name) => Object.assign(n, { description: n.description.trim() }));

        for (let on of oldNames) {
            let match = secondaryNames.filter((n: Name) => n.description == on.description);

            if (match.length == 0) {
                await ytPlaceService.removeSecondaryName(on.id);
            }
        }

        for (let on of secondaryNames) {
            let match = oldNames.filter((n: Name) => n.description == on.description);

            if (match.length == 0) {
                delete on.id;
                await ytPlaceService.addSecondaryName(on);
            }
        }

        let oldPatterns = await ytPlaceService.getHistoricalPatternsFor(parseInt(id))

        for (let on of oldPatterns) {
            let match = historicalPatterns.filter((n: HistoricalPattern) => n.comments == on.comments && n.historicalPatternType == on.historicalPatternType);

            if (match.length == 0) {
                await ytPlaceService.removeHistoricalPattern(on.id);
            }
        }

        for (let on of historicalPatterns) {
            let match = oldPatterns.filter((n: HistoricalPattern) => n.comments == on.comments && n.historicalPatternType == on.historicalPatternType);

            if (match.length == 0) {
                delete on.id;
                delete on.typeText;
                await ytPlaceService.addHistoricalPattern(on);
            }
        }

        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

ytPlaceRouter.put("/:id/location",
    [
        param("id").isInt().notEmpty(),
    ], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let updater = req.body;

        await ytPlaceService.updatePlace(parseInt(id), updater);
        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

ytPlaceRouter.put("/:id/dates",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { dates, constructionPeriods } = req.body;
        let updater = req.body;

        delete updater.dates;
        delete updater.constructionPeriods;

        await ytPlaceService.updatePlace(parseInt(id), updater);

        let oldDates = await ytPlaceService.getDatesFor(parseInt(id));
        dates = dates.map((n: Dates) => Object.assign(n, { details: n.details.trim() }));

        for (let on of oldDates) {
            let match = dates.filter((n: Dates) => n.type == on.type && n.details == on.details && n.fromDate == on.fromDate && n.toDate == on.toDate);

            if (match.length == 0) {
                await ytPlaceService.removeDate(on.id);
            }
        }

        for (let on of dates) {
            let match = oldDates.filter((n: Dates) => n.type == on.type && n.details == on.details && n.fromDate == on.fromDate && n.toDate == on.toDate);

            if (match.length == 0) {
                delete on.id;
                delete on.from_menu;
                delete on.to_menu;
                delete on.typeText;
                await ytPlaceService.addDate(on);
            }
        }

        let oldConst = await ytPlaceService.getConstructionPeriodsFor(parseInt(id));

        for (let on of oldConst) {
            let match = constructionPeriods.filter((n: ConstructionPeriod) => n.type == on.type);

            if (match.length == 0) {
                await ytPlaceService.removeConstructionPeriod(on.id);
            }
        }

        for (let on of constructionPeriods) {
            let match = oldConst.filter((n: ConstructionPeriod) => n.type == on.type);

            if (match.length == 0) {
                delete on.id;
                delete on.typeText;
                await ytPlaceService.addConstructionPeriod(on);
            }
        }
        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

ytPlaceRouter.put("/:id/themes",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { themes, functionalUses } = req.body;
        let updater = req.body;

        delete updater.themes;
        delete updater.functionalUses;

        await ytPlaceService.updatePlace(parseInt(id), updater);

        let oldThemes = await ytPlaceService.getThemesFor(parseInt(id));

        for (let on of oldThemes) {
            let match = themes.filter((n: Theme) => n.placeThemeId == on.placeThemeId);

            if (match.length == 0) {
                await ytPlaceService.removeTheme(on.id);
            }
        }

        for (let on of themes) {
            let match = oldThemes.filter((n: Theme) => n.placeThemeId == on.placeThemeId);

            if (match.length == 0) {
                delete on.typeName;
                await ytPlaceService.addTheme(on);
            }
        }

        let oldFunctions = await ytPlaceService.getFunctionUsesFor(parseInt(id));

        for (let on of oldFunctions) {
            let match = functionalUses.filter((n: FunctionalUse) => n.functionalTypeId == on.functionalTypeId && n.functionalUseType == on.functionalUseType);

            if (match.length == 0) {
                await ytPlaceService.removeFunctionalUse(on.id);
            }
        }

        for (let on of functionalUses) {
            let match = oldFunctions.filter((n: FunctionalUse) => n.functionalTypeId == on.functionalTypeId && n.functionalUseType == on.functionalUseType);

            if (match.length == 0) {
                delete on.typeName;
                await ytPlaceService.addFunctionalUse(on);
            }
        }


        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

ytPlaceRouter.put("/:id/all",
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
        let result = await ytPlaceService.updatePlace(parseInt(id), req.body as Place).then(item => item)
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
