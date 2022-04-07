import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';

import {
	aircrashRouter,
	boatsRouter,
	burialsRouter,
	catalogsRouter,
	categoryTypesRouter,
	communitiesRouter,
	constructionPeriodsRouter,
	contributingResourceTypesRouter,
	designationTypesRouter,
	firstNationAssociationTypesRouter,
	firstNationsRouter,
	historicalPatternTypesRouter,
	historiesRouter,
	mapsRouter,
	ntsMapSheetsRouter,
	ownerRouter,
	ownershipTypesRouter,
	peopleRouter,
	photoBatchRouter,
	photoOwnersRouter,
	photoRouter,
	photosExtraRouter,
	placeEditsRouter,
	placeRouter,
	recordTypesRouter,
	registerRouter,
	revisionLogTypesRouter,
	siteCategoryTypesRouter,
	siteStatusesRouter,
	staticRouter,
	userRouter,
	usersExtraRouter,
	ytPlaceHistoryRouter,
	ytPlaceRouter,
	deployRouter
} from './routes';

import * as config from './config';
import { doHealthCheck } from './utils/healthCheck';
import { configureAuthentication } from './routes/auth';
import { RequiresAuthentication } from './middleware';
import { CreateMigrationRoutes } from './data/migrator';

const app = express();

// Use qs for query parsing
// This setting is on by default, so I'm only surfacing it here for clarity.
// https://expressjs.com/en/api.html#app.settings.table -> query parser
app.set('query parser', 'extended');

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
			'img-src': ["'self'", 'data:', 'https:', 'blob:'],
			'object-src': ["'none'"],
			'script-src': ["'self'", 'https://js.arcgis.com', "'unsafe-eval'"], // added https to accomodate esri components?
			'script-src-attr': ["'none'"],
			'style-src': ["'self'", 'https:', "'unsafe-inline'"],
			'worker-src': ["'self'", 'blob:'],
			'connect-src': [
				"'self'",
				'https://*.arcgis.com',
				'https://services.arcgisonline.com',
				'https://mapservices.gov.yk.ca'
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


CreateMigrationRoutes(app);

configureAuthentication(app);

app.get('/api/healthCheck', (req: Request, res: Response) => {
	doHealthCheck(res);
});

app.use('/api/user', userRouter);
app.use('/api/place', RequiresAuthentication, placeRouter);
app.use('/api/ytplace', RequiresAuthentication, ytPlaceRouter);
app.use('/api/ytplacehistory', RequiresAuthentication, ytPlaceHistoryRouter);
app.use('/api/photo', RequiresAuthentication, photoRouter);
app.use('/api/photobatch', RequiresAuthentication, photoBatchRouter);
app.use('/api/register', registerRouter);

////console.log("B", boats)

app.use('/api/boats', RequiresAuthentication, boatsRouter);
app.use('/api/category-types', RequiresAuthentication, categoryTypesRouter);
app.use('/api/communities', RequiresAuthentication, communitiesRouter);
app.use('/api/construction-periods', RequiresAuthentication, constructionPeriodsRouter);
app.use('/api/contributing-resource-types', RequiresAuthentication, contributingResourceTypesRouter);
app.use('/api/designation-types', RequiresAuthentication, designationTypesRouter);
app.use('/api/first-nation-association-types', RequiresAuthentication, firstNationAssociationTypesRouter);
app.use('/api/first-nations', RequiresAuthentication, firstNationsRouter);
app.use('/api/historical-pattern-types', RequiresAuthentication, historicalPatternTypesRouter);
app.use('/api/nts-map-sheets', RequiresAuthentication, ntsMapSheetsRouter);
app.use('/api/people', RequiresAuthentication, peopleRouter);
app.use('/api/owners', RequiresAuthentication, ownerRouter);
app.use('/api/ownership-types', RequiresAuthentication, ownershipTypesRouter);
app.use('/api/aircrash', RequiresAuthentication, aircrashRouter);
app.use('/api/histories', RequiresAuthentication, historiesRouter);
app.use('/api/catalogs', RequiresAuthentication, catalogsRouter);
app.use('/api/people', RequiresAuthentication, peopleRouter);
app.use('/api/photo-owners', RequiresAuthentication, photoOwnersRouter);
app.use('/api/photos', photosExtraRouter);
app.use('/api/revision-log-types', RequiresAuthentication, revisionLogTypesRouter);
app.use('/api/place-edits', RequiresAuthentication, placeEditsRouter);
app.use('/api/record-types', RequiresAuthentication, recordTypesRouter);
app.use('/api/site-category-types', RequiresAuthentication, siteCategoryTypesRouter);
app.use('/api/site-statuses', RequiresAuthentication, siteStatusesRouter);
app.use('/api/users', usersExtraRouter);
app.use('/api/people', peopleRouter);
app.use('/api/burials', burialsRouter);
// app.use('/api/extras/photos', RequiresAuthentication, photosExtraRouter);
// app.use('/api/extras/users', RequiresAuthentication, usersExtraRouter);
app.use("/api/maps", mapsRouter)

app.use('/api/deploy', deployRouter);
app.use('/api', RequiresAuthentication, staticRouter);

// serves the static files generated by the front-end
app.use(express.static(path.join(__dirname, 'web')));

// if no other routes match, just send the front-end
app.use((req: Request, res: Response) => {
	res.sendFile(path.join(__dirname, 'web') + '/index.html');
});

app.listen(config.API_PORT, () => {
	console.log(`API listening on port ${config.API_PORT}`);
});
