import express, { Request, Response } from 'express';
import axios from 'axios';
import { stringify } from 'querystring';
import moment from 'moment';
import {
	DB_CONFIG,
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
	renew_after: moment().utc(true),
};
let FEATURE_TOKEN = {
	access_token: '',
	expires_in: 0,
	renew_after: moment().utc(true),
};
const placeService = new PlaceService(DB_CONFIG);

mapsRouter.get('/', authorize(), async (req, res) => {
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
	const now = moment().utc(true);

	if (now.isBefore(PORTAL_TOKEN.renew_after)) return;

	console.log('GIS: NEW PORTAL TOKEN');

	await axios
		.post(
			`https://yukon.maps.arcgis.com/sharing/rest/oauth2/token?client_id=${GIS_PORTAL_CLIENT_ID}&client_secret=${GIS_PORTAL_CLIENT_SECRET}&grant_type=client_credentials`
		)
		.then((resp: any) => {
			PORTAL_TOKEN = resp.data;
			PORTAL_TOKEN.renew_after = moment()
				.utc(true)
				.add(PORTAL_TOKEN.expires_in - 60 * 15, 'seconds');
		})
		.catch((err: any) => {
			console.log('ERROR', err);
		});
}

async function loadFeatureToken() {
	let now = moment().utc(true);

	if (now.isBefore(FEATURE_TOKEN.renew_after)) return;

	console.log('GIS: NEW FEATURE TOKEN');

	let body = {
		username: GIS_FEATURE_USERNAME,
		password: GIS_FEATURE_PASSWORD,
		f: 'json',
	};

	await axios
		.post(
			`https://deptweb.gov.yk.ca/prod/tokens/generateToken`,
			stringify(body),
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		)
		.then((resp: any) => {
			let { token, expires } = resp.data;
			let renew_after = moment(expires).utc(true).subtract(30, 'minutes');
			FEATURE_TOKEN = { access_token: token, expires_in: 3600, renew_after };
		})
		.catch((err: any) => {
			console.log('ERROR', err);
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
