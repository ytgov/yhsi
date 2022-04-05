import express, { Request, Response } from "express";
import axios from "axios";
import { stringify } from "querystring"
import moment from "moment";
import { GIS_FEATURE_PASSWORD, GIS_FEATURE_USERNAME, GIS_PORTAL_CLIENT_ID, GIS_PORTAL_CLIENT_SECRET } from "../config";

export const mapsRouter = express.Router();

let PORTAL_TOKEN = { access_token: "", expires_in: 0, renew_after: moment().utc(true) };
let FEATURE_TOKEN = { access_token: "", expires_in: 0, renew_after: moment().utc(true) };


mapsRouter.get("/", async (req, res) => {
    await loadPortalToken();

    res.json(PORTAL_TOKEN)
});

mapsRouter.get("/sites*", async (req: Request, res: Response) => {
    await loadFeatureToken();

    let query = req.query;
    delete query.token;
    let queryString = stringify(query as any);

    let path = req.path;
    path = path.replace(/^\/sites/, "");

    let ms = `https://deptweb.gov.yk.ca/arcgis/rest/services/Tour_YHIS/YHIS_Internal/MapServer${path}?${queryString}`;

    await axios.get(ms, { headers: { "X-Esri-Authorization": `Bearer ${FEATURE_TOKEN.access_token}`, "Content-Type": "application/json" } })
        .then(async (resp) => {
            if (resp.data.error) {
                console.log("ERROR RESPONSE:", resp.data.error)
                await loadFeatureToken();
                return res.redirect("/maps");
            }
   
            return res.json(await filterSites(resp.data));
        })
        .catch(err => { console.log(err); return res.json({ error: "BROKEN" }) });
})

async function loadPortalToken() {
    let now = moment().utc(true);

    if (now.isBefore(PORTAL_TOKEN.renew_after))
        return;

    console.log("GIS: NEW PORTAL TOKEN");

    await axios.post(`https://yukon.maps.arcgis.com/sharing/rest/oauth2/token?client_id=${GIS_PORTAL_CLIENT_ID}&client_secret=${GIS_PORTAL_CLIENT_SECRET}&grant_type=client_credentials`)
        .then(resp => {
            PORTAL_TOKEN = resp.data;
            PORTAL_TOKEN.renew_after = moment().utc(true).add(PORTAL_TOKEN.expires_in - (60 * 15), 'seconds');
        })
        .catch(err => {
            console.log("ERROR", err)
        });
}

async function loadFeatureToken() {
    let now = moment().utc(true);

    if (now.isBefore(FEATURE_TOKEN.renew_after))
        return;

    console.log("GIS: NEW FEATURE TOKEN");

    let body = {
        username: GIS_FEATURE_USERNAME,
        password: GIS_FEATURE_PASSWORD,
        f: "json"
    };

    await axios.post(`https://deptweb.gov.yk.ca/arcgis/tokens/generateToken`, stringify(body), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
        .then(resp => {
            let { token, expires } = resp.data;
            let renew_after = moment(expires).subtract(30, "minutes");
            FEATURE_TOKEN = { access_token: token, expires_in: 3600, renew_after };
        })
        .catch(err => {
            console.log("ERROR", err)
        });
}

async function filterSites(portalResponse: any) {

    let accessList = ["115O/15/004", "117D/12/024", "116N/7/15", "116C/07/027"]

    if (portalResponse.features) {
        let filtered = new Array();

        for (let feature of portalResponse.features) {
            if (feature.attributes && feature.attributes.YHSI_ID) {
                let id = feature.attributes.YHSI_ID;

                if (accessList.indexOf(id) >= 0)
                    filtered.push(feature);
            }
            else {
                filtered.push(feature);
            }
        }

        portalResponse.features = filtered;
    }

    return portalResponse;
}
