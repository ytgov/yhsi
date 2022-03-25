import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';

import {
<<<<<<< HEAD
	userRouter,
	placeRouter,
	photoRouter,
	photoBatchRouter,
	registerRouter,
	staticRouter,
	ytPlaceHistoryRouter,
	ytPlaceRouter,
} from './routes';
import {
	boatsRouter,
	ownerRouter,
	aircrashRouter,
	historiesRouter,
	catalogsRouter,
	usersExtraRouter,
	photosExtraRouter,
	peopleRouter,
	photoOwnersRouter,
	burialsRouter
} from './routes';
=======
	aircrashRouter,
	boatsRouter,
	burialsRouter,
	catalogsRouter,
	communitiesRouter,
	constructionPeriodsRouter,
	firstNationAssociationTypesRouter,
	firstNationsRouter,
	historiesRouter,
	ntsMapSheetsRouter,
	ownerRouter,
	ownershipTypesRouter,
	peopleRouter,
	photoBatchRouter,
	photoOwnersRouter,
	photoRouter,
	photosExtraRouter,
	placeRouter,
	registerRouter,
	revisionLogTypesRouter,
	siteStatusesRouter,
	staticRouter,
	userRouter,
	usersExtraRouter,
	ytPlaceHistoryRouter,
	ytPlaceRouter,
} from './routes';
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf

import * as config from './config';
import { doHealthCheck } from './utils/healthCheck';
import { configureAuthentication } from './routes/auth';
import { RequiresAuthentication } from './middleware';

<<<<<<< HEAD

/*
var ownersRouter = require('./controllers/owners');
var historiesRouter = require('./controllers/histories');
var aircrashRouter = require('./controllers/aircrash');
var catalogsRouter = require('./controllers/catalogs');
var usersRouter = require('./controllers/users');
var peopleRouter = require('./controllers/people');
var photoOwners = require('./controllers/photoOwners');
var boatsRouter = require('./controllers/boats');
var photosRouter = require('./controllers/photos');*/

var knex = require('knex');

=======
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(helmet());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			'default-src': ["'self'"],
			'base-uri': ["'self'"],
			'block-all-mixed-content': [],
			'font-src': ["'self'", 'https:', 'data:'],
			'frame-ancestors': ["'self'"],
			'img-src': ["'self'", 'data:', 'https:'],
			'object-src': ["'none'"],
			'script-src': ["'self'", 'https://js.arcgis.com', "'unsafe-eval'"], // added https to accomodate esri components?
			'script-src-attr': ["'none'"],
			'style-src': ["'self'", 'https:', "'unsafe-inline'"],
			'worker-src': ["'self'", 'blob:'],
			'connect-src': [
				"'self'",
				'https://*.arcgis.com',
				'https://services.arcgisonline.com',
			],
		},
	})
);

// very basic CORS setup
app.use(
	cors({
		origin: config.FRONTEND_URL,
		optionsSuccessStatus: 200,
		credentials: true,
	})
);

configureAuthentication(app);

app.get('/api/healthCheck', (req: Request, res: Response) => {
	doHealthCheck(res);
});

app.use('/api/user', RequiresAuthentication, userRouter);
app.use('/api/place', RequiresAuthentication, placeRouter);
app.use('/api/ytplace', RequiresAuthentication, ytPlaceRouter);
app.use('/api/ytplacehistory', RequiresAuthentication, ytPlaceHistoryRouter);
app.use('/api/photo', RequiresAuthentication, photoRouter);
app.use('/api/photobatch', RequiresAuthentication, photoBatchRouter);
app.use('/api/register', registerRouter);

////console.log("B", boats)

app.use('/api/boats', RequiresAuthentication, boatsRouter);
<<<<<<< HEAD
app.use('/api/people', RequiresAuthentication, peopleRouter);
app.use('/api/owners', RequiresAuthentication, ownerRouter);
=======
app.use('/api/communities', RequiresAuthentication, communitiesRouter);
app.use('/api/construction-periods', RequiresAuthentication, constructionPeriodsRouter);
app.use('/api/first-nation-association-types', RequiresAuthentication, firstNationAssociationTypesRouter);
app.use('/api/first-nations', RequiresAuthentication, firstNationsRouter);
app.use('/api/nts-map-sheets', RequiresAuthentication, ntsMapSheetsRouter);
app.use('/api/people', RequiresAuthentication, peopleRouter);
app.use('/api/owners', RequiresAuthentication, ownerRouter);
app.use('/api/ownership-types', RequiresAuthentication, ownershipTypesRouter);
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
app.use('/api/aircrash', RequiresAuthentication, aircrashRouter);
app.use('/api/histories', RequiresAuthentication, historiesRouter);
app.use('/api/catalogs', RequiresAuthentication, catalogsRouter);
app.use('/api/people', RequiresAuthentication, peopleRouter);
app.use('/api/photo-owners', RequiresAuthentication, photoOwnersRouter);
app.use('/api/photos', photosExtraRouter);
<<<<<<< HEAD
=======
app.use('/api/revision-log-types', RequiresAuthentication, revisionLogTypesRouter);
app.use('/api/site-statuses', RequiresAuthentication, siteStatusesRouter);
>>>>>>> 0cdf0c39d93068ce691cb9c87d8d8dd0e9875eaf
app.use('/api/users', usersExtraRouter);
app.use('/api/people', peopleRouter);
app.use('/api/burials', burialsRouter);
// app.use('/api/extras/photos', RequiresAuthentication, photosExtraRouter);
// app.use('/api/extras/users', RequiresAuthentication, usersExtraRouter);

app.use('/api', RequiresAuthentication, staticRouter);

// serves the static files generated by the front-end
app.use(express.static(path.join(__dirname, 'web')));

// if no other routes match, just send the front-end
app.use((req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, 'web') + '/index.html');
});

app.listen(config.API_PORT, () => {
	//console.log(`API listening on port ${config.API_PORT}`);
});
