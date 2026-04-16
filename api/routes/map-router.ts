import express, { Request, Response } from 'express';
import axios from 'axios';
import { stringify } from 'querystring';
import { addSeconds, subMinutes, isBefore } from 'date-fns';
import {
	GIS_FEATURE_PASSWORD,
	GIS_FEATURE_USERNAME,
	GIS_PORTAL_CLIENT_ID,
	GIS_PORTAL_CLIENT_SECRET,
} from '../config';
import { User } from 'models';
import { PlaceService } from '../services';
import { authorize } from '../middleware/authorization';

export const mapsRouter = express.Router();

let PORTAL_TOKEN = {
	access_token: '',
	expires_in: 0,
	renew_after: new Date(),
};
let FEATURE_TOKEN = {
	access_token: '',
	expires_in: 0,
	renew_after: new Date(),
};
const placeService = new PlaceService();

mapsRouter.get('/', authorize(), async (_req, res) => {
	await loadPortalToken();
	res.json(PORTAL_TOKEN);
});

mapsRouter.get('/sites*', authorize(), async (req: Request, res: Response) => {
	await loadFeatureToken();

	const currentUser = req.user as User;
	const query = req.query;
	delete query.token;
	const queryString = stringify(query as any);

	let path = req.path;
	path = path.replace(/^\/sites/, '');

	const ms = `https://deptweb.gov.yk.ca/prod/rest/services/TC-YHSI/YHIS_Internal/MapServer${path}?${queryString}`;

	await axios
		.get(ms, {
			headers: {
				'X-Esri-Authorization': `Bearer ${FEATURE_TOKEN.access_token}`,
				'Content-Type': 'application/json',
			},
		})
		.then(async (resp: any) => {
			if (resp.data.error) {
				console.log('ERROR RESPONSE:', resp.data.error);
				await loadFeatureToken();
				return res.redirect('/maps');
			}

			return res.json(await filterSites(resp.data, currentUser));
		})
		.catch((err: any) => {
			console.log(err);
			return res.json({ error: 'BROKEN' });
		});
});

async function loadPortalToken() {
	const now = new Date();

	if (isBefore(now, PORTAL_TOKEN.renew_after)) return;

	await axios
		.post(
			`https://yukon.maps.arcgis.com/sharing/rest/oauth2/token?client_id=${GIS_PORTAL_CLIENT_ID}&client_secret=${GIS_PORTAL_CLIENT_SECRET}&grant_type=client_credentials`
		)
		.then((resp: any) => {
			PORTAL_TOKEN = resp.data;
			PORTAL_TOKEN.renew_after = addSeconds(new Date(), PORTAL_TOKEN.expires_in - 60 * 15);
		})
		.catch((err: any) => {
			console.error('GIS portal token error:', err);
		});
}

async function loadFeatureToken() {
	const now = new Date();

	if (isBefore(now, FEATURE_TOKEN.renew_after)) return;

	const body = {
		username: GIS_FEATURE_USERNAME,
		password: GIS_FEATURE_PASSWORD,
		f: 'json',
	};

	await axios
		.post(`https://deptweb.gov.yk.ca/prod/tokens/generateToken`, stringify(body), {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		})
		.then((resp: any) => {
			const { token, expires } = resp.data;
			const renew_after = subMinutes(new Date(expires), 30);
			FEATURE_TOKEN = { access_token: token, expires_in: 3600, renew_after };
		})
		.catch((err: any) => {
			console.error('GIS feature token error:', err);
		});
}

async function filterSites(portalResponse: any, user: User) {
	const results = await placeService.getIdsForUser(user);
	const accessList = results.map((r) => r.yHSIId);

	if (portalResponse.features) {
		const filtered = [];

		for (const feature of portalResponse.features) {
			if (feature.attributes && feature.attributes.YHSI_ID) {
				const id = feature.attributes.YHSI_ID;

				if (accessList.indexOf(id) >= 0) filtered.push(feature);
			} else {
				filtered.push(feature);
			}
		}

		portalResponse.features = filtered;
	}

	return portalResponse;
}
