import { Request, Response } from "express";
const express = require("express");
import { DB_CONFIG } from "../config"
import { body, check, param, query, validationResult } from "express-validator";
import { PhotoService, PlaceService, SortDirection, SortStatement, StaticService } from "../services";
import { HistoricalPattern, Name, Place, Dates, PLACE_FIELDS, ConstructionPeriod, Theme, FunctionalUse, Association, FirstNationAssociation, Ownership, PreviousOwnership, WebLink, RevisionLog, Contact, Description } from "../data";
import { ReturnValidationErrors } from "../middleware";
const moment = require("moment");

const placeService = new PlaceService(DB_CONFIG);
const staticService = new StaticService(DB_CONFIG);
const photoService = new PhotoService(DB_CONFIG);
const PAGE_SIZE = 10;

export const placeRouter = express.Router();

placeRouter.get("/",
    [query("page").default(1).isInt({ gt: 0 })], ReturnValidationErrors,
    async (req: Request, res: Response) => {
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

placeRouter.post("/search", [body("page").isInt().default(1)],
    async (req: Request, res: Response) => {
        let { query, sortBy, sortDesc, page, itemsPerPage } = req.body;
        let sort = new Array<SortStatement>();

        sortBy.forEach((s: string, i: number) => {
            sort.push({ field: s, direction: sortDesc[i] ? SortDirection.ASCENDING : SortDirection.DESCENDING })
        })

        let skip = (page - 1) * itemsPerPage;
        let take = itemsPerPage;
        let results = await placeService.doSearch(query, sort, page, itemsPerPage, skip, take);

        /*let communities = await staticService.getCommunities();
        let categories = await staticService.getCategories();
        let statuses = await staticService.getSiteStatuses();

        for (let place of results.data) {
            place.community = communities.filter(c => c.id == place.communityId)[0];
            place.category = categories.filter(c => c.value == place.category)[0];
            place.status = statuses.filter(c => c.value == place.siteStatus)[0];
        }*/

        res.json(results);
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
    ], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let id = parseInt(req.params.id);
        let fnList = await staticService.getFirstNations();
        let themeList = await staticService.getPlaceThemes();
        let functionalTypes = await staticService.getFunctionalTypes();

        await placeService.getById(id)
            .then(async (place) => {
                if (place) {
                    place.siteCategories = (place.siteCategories as string).split(',');

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

                    let photos = await photoService.getAllForPlace(id);

                    let relationships = {
                        associations: { data: associations },
                        firstNationAssociations: { data: fnAssociations },
                        names: { data: names },
                        historicalPatterns: { data: historicalPatterns },
                        dates: { data: dates },
                        constructionPeriods: { data: constructionPeriods },
                        themes: { data: themes },
                        functionalUses: { data: functionalUses },
                        ownerships: { data: ownerships },
                        previousOwnerships: { data: previousOwnerships },
                        photos: { data: photos },
                        contacts: { data: contacts },
                        revisionLogs: { data: revisionLogs },
                        webLinks: { data: webLinks },
                        descriptions: { data: descriptions },
                    };

                    if (place.recognitionDate)
                        (place as any).recognitionDateDisplay = moment(place.recognitionDate).add(7, 'hours').format("YYYY-MM-DD");
                    else
                        (place as any).recognitionDateDisplay = "";

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

placeRouter.put("/:id/summary",
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

        await placeService.updatePlace(parseInt(id), updater);
        let oldNames = await placeService.getNamesFor(parseInt(id));
        secondaryNames = secondaryNames.map((n: Name) => Object.assign(n, { description: n.description.trim() }));

        for (let on of oldNames) {
            let match = secondaryNames.filter((n: Name) => n.description == on.description);

            if (match.length == 0) {
                await placeService.removeSecondaryName(on.id);
            }
        }

        for (let on of secondaryNames) {
            let match = oldNames.filter((n: Name) => n.description == on.description);

            if (match.length == 0) {
                delete on.id;
                await placeService.addSecondaryName(on);
            }
        }

        let oldPatterns = await placeService.getHistoricalPatternsFor(parseInt(id))

        for (let on of oldPatterns) {
            let match = historicalPatterns.filter((n: HistoricalPattern) => n.comments == on.comments && n.historicalPatternType == on.historicalPatternType);

            if (match.length == 0) {
                await placeService.removeHistoricalPattern(on.id);
            }
        }

        for (let on of historicalPatterns) {
            let match = oldPatterns.filter((n: HistoricalPattern) => n.comments == on.comments && n.historicalPatternType == on.historicalPatternType);

            if (match.length == 0) {
                delete on.id;
                delete on.typeText;
                await placeService.addHistoricalPattern(on);
            }
        }

        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/location",
    [
        param("id").isInt().notEmpty(),
    ], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let updater = req.body;

        await placeService.updatePlace(parseInt(id), updater);
        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/dates",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { dates, constructionPeriods } = req.body;
        let updater = req.body;

        delete updater.dates;
        delete updater.constructionPeriods;

        await placeService.updatePlace(parseInt(id), updater);

        let oldDates = await placeService.getDatesFor(parseInt(id));
        dates = dates.map((n: Dates) => Object.assign(n, { details: n.details.trim() }));

        for (let on of oldDates) {
            let match = dates.filter((n: Dates) => n.type == on.type && n.details == on.details && n.fromDate == on.fromDate && n.toDate == on.toDate);

            if (match.length == 0) {
                await placeService.removeDate(on.id);
            }
        }

        for (let on of dates) {
            let match = oldDates.filter((n: Dates) => n.type == on.type && n.details == on.details && n.fromDate == on.fromDate && n.toDate == on.toDate);

            if (match.length == 0) {
                delete on.id;
                delete on.from_menu;
                delete on.to_menu;
                delete on.typeText;
                await placeService.addDate(on);
            }
        }

        let oldConst = await placeService.getConstructionPeriodsFor(parseInt(id));

        for (let on of oldConst) {
            let match = constructionPeriods.filter((n: ConstructionPeriod) => n.type == on.type);

            if (match.length == 0) {
                await placeService.removeConstructionPeriod(on.id);
            }
        }

        for (let on of constructionPeriods) {
            let match = oldConst.filter((n: ConstructionPeriod) => n.type == on.type);

            if (match.length == 0) {
                delete on.id;
                delete on.typeText;
                await placeService.addConstructionPeriod(on);
            }
        }
        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/themes",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { themes, functionalUses } = req.body;
        let updater = req.body;

        delete updater.themes;
        delete updater.functionalUses;

        await placeService.updatePlace(parseInt(id), updater);

        let oldThemes = await placeService.getThemesFor(parseInt(id));

        for (let on of oldThemes) {
            let match = themes.filter((n: Theme) => n.placeThemeId == on.placeThemeId);

            if (match.length == 0) {
                await placeService.removeTheme(on.id);
            }
        }

        for (let on of themes) {
            let match = oldThemes.filter((n: Theme) => n.placeThemeId == on.placeThemeId);

            if (match.length == 0) {
                delete on.typeName;
                await placeService.addTheme(on);
            }
        }

        let oldFunctions = await placeService.getFunctionUsesFor(parseInt(id));

        for (let on of oldFunctions) {
            let match = functionalUses.filter((n: FunctionalUse) => n.functionalTypeId == on.functionalTypeId && n.functionalUseType == on.functionalUseType);

            if (match.length == 0) {
                await placeService.removeFunctionalUse(on.id);
            }
        }

        for (let on of functionalUses) {
            let match = oldFunctions.filter((n: FunctionalUse) => n.functionalTypeId == on.functionalTypeId && n.functionalUseType == on.functionalUseType);

            if (match.length == 0) {
                delete on.typeName;
                await placeService.addFunctionalUse(on);
            }
        }


        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/associations",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { associations, firstNationAssociations } = req.body;

        let oldAssoc = await placeService.getAssociationsFor(parseInt(id));

        for (let on of oldAssoc) {
            let match = associations.filter((n: Association) => n.type == on.type && n.description == on.description);

            if (match.length == 0) {
                await placeService.removeAssociation(on.id);
            }
        }

        for (let on of associations) {
            let match = oldAssoc.filter((n: Association) => n.type == on.type && n.description == on.description);

            if (match.length == 0) {
                delete on.typeText;
                delete on.id;
                await placeService.addAssociation(on);
            }
        }

        let oldFunctions = await placeService.getFNAssociationsFor(parseInt(id));
        for (let on of oldFunctions) {
            let match = firstNationAssociations.filter((n: FirstNationAssociation) => n.firstNationAssociationType == on.firstNationAssociationType && n.firstNationId == on.firstNationId && n.comments == on.comments);

            if (match.length == 0) {
                await placeService.removeFNAssociation(on.id);
            }
        }

        for (let on of firstNationAssociations) {
            let match = oldFunctions.filter((n: FirstNationAssociation) => n.firstNationAssociationType == on.firstNationAssociationType && n.firstNationId == on.firstNationId && n.comments == on.comments);

            if (match.length == 0) {
                console.log(on)
                delete on.id;
                delete on.typeText;
                await placeService.addFNAssociation(on);
            }
        }

        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/legal",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { ownerships, prevOwnerships } = req.body;
        let updater = req.body;

        delete updater.ownerships;
        delete updater.prevOwnerships;

        await placeService.updatePlace(parseInt(id), updater);

        let oldOwners = await placeService.getOwnershipsFor(parseInt(id));

        for (let on of oldOwners) {
            let match = ownerships.filter((n: Ownership) => n.ownershipType == on.ownershipType && n.comments == on.comments);

            if (match.length == 0) {
                await placeService.removeOwnership(on.id);
            }
        }

        for (let on of ownerships) {
            let match = oldOwners.filter((n: Ownership) => n.ownershipType == on.ownershipType && n.comments == on.comments);

            if (match.length == 0) {
                await placeService.addOwnership(on);
            }
        }

        let oldFunctions = await placeService.getPreviousOwnershipsFor(parseInt(id));

        for (let on of oldFunctions) {
            let match = prevOwnerships.filter((n: PreviousOwnership) => n.ownershipDate == on.ownershipDate && n.ownershipNumber == on.ownershipNumber && n.ownershipName == on.ownershipName);

            if (match.length == 0) {
                await placeService.removePreviousOwnership(on.id);
            }
        }

        for (let on of prevOwnerships) {
            let match = oldFunctions.filter((n: PreviousOwnership) => n.ownershipDate == on.ownershipDate && n.ownershipNumber == on.ownershipNumber && n.ownershipName == on.ownershipName);

            if (match.length == 0) {
                delete on.typeName;
                await placeService.addPreviousOwnership(on);
            }
        }

        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/management",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { links, contacts, revisionLogs } = req.body;
        let updater = req.body;

        delete updater.links;
        delete updater.contacts;
        delete updater.revisionLogs;

        await placeService.updatePlace(parseInt(id), updater);

        let oldLinks = await placeService.getWebLinksFor(parseInt(id));

        for (let on of oldLinks) {
            let match = links.filter((n: WebLink) => n.type == on.type && n.address == on.address);

            if (match.length == 0) {
                await placeService.removeWebLink(on.id);
            }
        }

        for (let on of links) {
            let match = oldLinks.filter((n: WebLink) => n.type == on.type && n.address == on.address);

            if (match.length == 0) {
                delete on.id;
                delete on.typeText;
                await placeService.addWebLink(on);
            }
        }

        let oldLogs = await placeService.getRevisionLogFor(parseInt(id));

        for (let on of oldLogs) {
            let match = revisionLogs.filter((n: RevisionLog) => n.revisionLogType == on.revisionLogType && n.revisionDate == on.revisionDate && n.revisedBy == on.revisedBy && n.details == on.details);

            if (match.length == 0) {
                await placeService.removeRevisionLog(on.id);
            }
        }

        for (let on of revisionLogs) {
            let match = oldLogs.filter((n: RevisionLog) => n.revisionLogType == on.revisionLogType && n.revisionDate == on.revisionDate && n.revisedBy == on.revisedBy && n.details == on.details);

            if (match.length == 0) {
                delete on.revisionLogTypeText;
                delete on.id;
                await placeService.addRevisionLog(on);
            }
        }

        let oldContacts = await placeService.getContactsFor(parseInt(id));

        for (let on of oldContacts) {
            let match = contacts.filter((n: Contact) => n.contactType == on.contactType && n.firstName == on.firstName && n.lastName == on.lastName && n.phoneNumber == on.phoneNumber && n.email == on.email && n.mailingAddress == on.mailingAddress && n.description == on.description);

            if (match.length == 0) {
                await placeService.removeContact(on.id);
            }
        }

        for (let on of contacts) {
            let match = oldContacts.filter((n: Contact) => n.contactType == on.contactType && n.firstName == on.firstName && n.lastName == on.lastName && n.phoneNumber == on.phoneNumber && n.email == on.email && n.mailingAddress == on.mailingAddress && n.description == on.description);

            if (match.length == 0) {
                delete on.id;
                delete on.contactTypeText;
                await placeService.addContact(on);
            }
        }

        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });

placeRouter.put("/:id/description",
    [param("id").isInt().notEmpty(),], ReturnValidationErrors,
    async (req: Request, res: Response) => {
        let { id } = req.params;
        let { descriptions } = req.body;

        let oldDescs = await placeService.getDescriptionsFor(parseInt(id));

        for (let on of oldDescs) {
            let match = descriptions.filter((n: Description) => n.type == on.type && n.descriptionText == on.descriptionText);

            if (match.length == 0) {
                await placeService.removeDescription(on.id);
            }
        }

        for (let on of descriptions) {
            let match = oldDescs.filter((n: Description) => n.type == on.type && n.descriptionText == on.descriptionText);

            if (match.length == 0) {
                delete on.typeText;
                delete on.id;
                await placeService.addDescription(on);
            }
        }

        return res.json({ messages: [{ variant: "success", text: "Site updated" }] });
    });


placeRouter.put("/:id/all",
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
