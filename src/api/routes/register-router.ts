import express, { Request, Response } from "express";
import { DB_CONFIG } from "../config"
import { PhotoService, PlaceService } from "../services";
import moment from "moment";
import { createThumbnail } from "../utils/image";

const placeService = new PlaceService(DB_CONFIG);
const photoService = new PhotoService(DB_CONFIG);

export const registerRouter = express.Router();

registerRouter.get("/", async (req: Request, res: Response) => {
    let data = await placeService.getRegisterAll();
    data.map(d => d.recognitionDate = moment(d.recognitionDate).add(7, 'hours').format("YYYY-MM-DD"));
    res.json({ data });
});

registerRouter.get("/:id", async (req: Request, res: Response) => {
    let { id } = req.params;
    let data = await placeService.getRegisterById(parseInt(id));

    if (!data) {
        return res.status(404).send();
    }

    data.placeDescriptionEn = "1111";
    data.placeDescriptionFr = "";
    data.heritageValueEn = "";
    data.heritageValueFr = "";
    data.characterDefEn = "";
    data.characterDefFr = "";
    data.descBoundEn = "";
    data.descBoundFr = "";
    data.additionalInfoEn = "";
    data.additionalInfoFr = "";

    let descs = await placeService.getDescriptionsFor(parseInt(id));

    for (let desc of descs) {
        if (desc.type == 5) {
            data.placeDescriptionEn = desc.descriptionText;
            data.placeDescriptionFr = 'FRENCH: ' + desc.descriptionText;
        }
        else if (desc.type == 4) {
            data.heritageValueEn = desc.descriptionText;
            data.heritageValueFr = 'FRENCH: ' + desc.descriptionText;
        }
        else if (desc.type == 2) {
            data.characterDefEn = desc.descriptionText;
            data.characterDefFr = 'FRENCH: ' + desc.descriptionText;
        }
        else if (desc.type == 6) {
            data.descBoundEn = desc.descriptionText;
            data.descBoundFr = 'FRENCH: ' + desc.descriptionText;
        }
        else if (desc.type == 30) {
            data.additionalInfoEn = desc.descriptionText;
            data.additionalInfoFr = 'FRENCH: ' + desc.descriptionText;
        }
    }

    res.json({ data });
});

registerRouter.get("/:id/photos", async (req: Request, res: Response) => {
    let { id } = req.params;
    let data = await placeService.getRegisterById(parseInt(id));

    if (!data) {
        return res.status(404).send();
    }

    let photos = await photoService.getAllForPlace(parseInt(id));

    res.json({ data: photos });
});

registerRouter.get("/:id/photos/:photoId", async (req: Request, res: Response) => {
    let { id, photoId } = req.params;
    let data = await placeService.getRegisterById(parseInt(id));

    if (!data) {
        return res.status(404).send();
    }

    await photoService.getFileById(photoId)
        .then(async photo => {
            if (photo && photo.file) {
                let t = await createThumbnail(photo.file);
                return res.contentType("image/jpg").send(t);
            }

            return res.status(404).send("Photo not found");
        })
        .catch(err => {
            console.error(err)
            return res.status(404).send("Photo not found");
        })
});
