import express, { Request, Response } from "express";
import { body, check, validationResult } from "express-validator";
import { nullIfEmpty } from "../utils/validation";
import { DB_CONFIG } from "../config";
import { StaticService } from "../services";

const staticService = new StaticService(DB_CONFIG);
export const staticRouter = express.Router();

staticRouter.get("/community", async (req: Request, res: Response) => {
    let list = await staticService.getCommunities();
    return res.json({ data: list });
});

staticRouter.get("/first-nation", async (req: Request, res: Response) => {
    let list = await staticService.getFirstNations();
    return res.json({ data: list });
});

staticRouter.get("/functional-type", async (req: Request, res: Response) => {
    let list = await staticService.getFunctionalTypes();
    return res.json({ data: list });
});

staticRouter.get("/original-media", async (req: Request, res: Response) => {
    let list = await staticService.getOriginalMedias();
    return res.json({ data: list });
});

staticRouter.get("/place-theme", async (req: Request, res: Response) => {
    let list = await staticService.getPlaceThemes();
    return res.json({ data: list });
});

staticRouter.get("/statute", async (req: Request, res: Response) => {
    let list = await staticService.getStatutes();
    return res.json({ data: list });
});

staticRouter.get("/jurisdiction", async (req: Request, res: Response) => {
    let list = staticService.getJurisdictions();
    return res.json({ data: list });
});

staticRouter.get("/owner-consent", async (req: Request, res: Response) => {
    let list = staticService.getOwnerConsents();
    return res.json({ data: list });
});

staticRouter.get("/category", async (req: Request, res: Response) => {
    let list = staticService.getCategories();
    return res.json({ data: list });
});

staticRouter.get("/designation-type", async (req: Request, res: Response) => {
    let list = staticService.getDesignationTypes();
    return res.json({ data: list });
});

staticRouter.get("/condition", async (req: Request, res: Response) => {
    let list = staticService.getConditions();
    return res.json({ data: list });
});

staticRouter.get("/coordinate-determination", async (req: Request, res: Response) => {
    let list = staticService.getCoordinateDeterminations();
    return res.json({ data: list });
});

staticRouter.get("/site-status", async (req: Request, res: Response) => {
    let list = staticService.getSiteStatuses();
    return res.json({ data: list });
});

staticRouter.get("/record-type", async (req: Request, res: Response) => {
    let list = staticService.getRecordTypes();
    return res.json({ data: list });
});

staticRouter.get("/site-category", async (req: Request, res: Response) => {
    let list = staticService.getSiteCategories();
    return res.json({ data: list });
});

staticRouter.get("/contributing-resource-type", async (req: Request, res: Response) => {
    let list = staticService.getContributingResourceTypes();
    return res.json({ data: list });
});

staticRouter.get("/photo-owner", async (req: Request, res: Response) => {
    let list = await staticService.getPhotoOwners();
    return res.json({ data: list });
});

staticRouter.get("/photo-owner/:id",
    [check("id").isInt().notEmpty()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let list = await staticService.getPhotoOwner(parseInt(id));
        return res.json({ data: list });
    });

staticRouter.post("/photo-owner",
    [
        body("name").isString().notEmpty().trim(),
        body("email").toLowerCase().trim().customSanitizer(nullIfEmpty),
        body("address").trim().customSanitizer(nullIfEmpty),
        body("telephone").trim().customSanitizer(nullIfEmpty),
        body("contactPerson").trim().customSanitizer(nullIfEmpty)
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { name, email, address, telephone, contactPerson } = req.body;
        let result = await staticService.addPhotoOwner({ name, email, address, telephone, contactPerson });
        return res.json({ data: result });
    });

staticRouter.put("/photo-owner/:id",
    [
        check("id").isInt().notEmpty(),
        body("name").isString().notEmpty().trim(),
        body("email").toLowerCase().trim().customSanitizer(nullIfEmpty),
        body("address").trim().customSanitizer(nullIfEmpty),
        body("telephone").trim().customSanitizer(nullIfEmpty),
        body("contactPerson").trim().customSanitizer(nullIfEmpty)
    ], async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let { name, email, address, telephone, contactPerson } = req.body;
        let result = await staticService.updatePhotoOwner(parseInt(id), { name, email, address, telephone, contactPerson });
        return res.json({ data: result });
    });

staticRouter.delete("/photo-owner/:id",
    [check("id").isInt().notEmpty()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let list = await staticService.deletePhotoOwner(parseInt(id));
        return res.json({ data: list });
    });


staticRouter.get("/photo-project", async (req: Request, res: Response) => {
    let list = await staticService.getPhotoProjects();
    return res.json({ data: list });
});

staticRouter.get("/photo-project/:id",
    [check("id").isInt().notEmpty()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let list = await staticService.getPhotoProject(parseInt(id));
        return res.json({ data: list });
    });

staticRouter.post("/photo-project",
    [
        body("name").isString().notEmpty().trim(),
        body("permit").trim().customSanitizer(nullIfEmpty),
        body("year").trim().customSanitizer(nullIfEmpty),
        body("section").isInt().notEmpty()
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { name, permit, year, section } = req.body;
        let result = await staticService.addPhotoProject({ name, permit, year, section });
        return res.json({ data: result });
    });

staticRouter.put("/photo-project/:id",
    [
        check("id").isInt().notEmpty(),
        body("name").isString().notEmpty().trim(),
        body("permit").trim().customSanitizer(nullIfEmpty),
        body("year").trim().customSanitizer(nullIfEmpty),
        body("section").isInt().notEmpty()
    ], async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let { name, permit, year, section } = req.body;
        let result = await staticService.updatePhotoProject(parseInt(id), { name, permit, year, section });
        return res.json({ data: result });
    });

staticRouter.delete("/photo-project/:id",
    [check("id").isInt().notEmpty()],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id as string;
        let list = await staticService.deletePhotoProject(parseInt(id));
        return res.json({ data: list });
    });