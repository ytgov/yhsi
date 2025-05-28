import * as path from 'path';
import * as dotenv from 'dotenv';

let dotEnvPath;
switch (process.env.NODE_ENV) {
	case 'test':
		dotEnvPath = `.env.test`;
		break;
	case 'production':
		dotEnvPath = `.env.production`;
		break;
	default:
		dotEnvPath = `.env.development`;
}
dotenv.config({ path: dotEnvPath });

export const API_PORT = parseInt(process.env.API_PORT || '3000');
export const FRONTEND_URL = process.env.FRONTEND_URL || 'localhost:8080';
export const AUTH_REDIRECT = process.env.AUTH_REDIRECT || process.env.FRONTEND_URL || '';
export const NODE_ENV = process.env.NODE_ENV;

export const DB_NAME = process.env.DB_NAME || '';
export const DB_USER = process.env.DB_USER || '';
export const DB_PASS = process.env.DB_PASS || '';
export const DB_HOST = process.env.DB_HOST || '';
export const DB_PORT = process.env.DB_PORT || '1433';

export const CLIENT_ID = process.env.CLIENT_ID || '';
export const ISSUER_BASE_URL = process.env.ISSUER_BASE_URL || '';
export const AUTH_DB_CONNECTION = process.env.AUTH_DB_CONNECTION || '';

export const DB_CONFIG = {
	client: 'mssql',
	connection: {
		host: DB_HOST,
		user: DB_USER,
		password: DB_PASS,
		database: DB_NAME,
		port: parseInt(DB_PORT),
	},
	migrations: {
		directory: path.resolve(__dirname, './data/migrations'),
		extension: 'ts',
		stub: path.resolve(__dirname, './data/templates/sample-migration.ts'),
	},
	seeds: {
		directory: path.resolve(__dirname, `./data/seeds/${NODE_ENV}`),
		extension: 'ts',
		stub: path.resolve(__dirname, './data/templates/sample-seed.ts'),
	},
};

export const GIS_PORTAL_CLIENT_ID = process.env.GIS_PORTAL_CLIENT_ID || '';
export const GIS_PORTAL_CLIENT_SECRET = process.env.GIS_PORTAL_CLIENT_SECRET || '';
export const GIS_FEATURE_USERNAME = process.env.GIS_FEATURE_USERNAME || '';
export const GIS_FEATURE_PASSWORD = process.env.GIS_FEATURE_PASSWORD || '';

// Configure Sentry (GlitchTip) for Monitorings)
export const SENTRY_DSN = process.env.SENTRY_DSN || '';
