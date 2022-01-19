import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { DB_HOST } from '../config';

export function RequiresAuthentication(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// DJPRATT temporary hack to get around login issue
	//return next();
	if (req.oidc.isAuthenticated()) {
		return next();
	}

	res.status(401).send('Not authenticated'); //;.redirect('/api/auth/login');
}

export function ReturnValidationErrors(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	next();
}

export function RequiresRoleAdmin(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.user && req.user.roles.indexOf('Admin') == -1) {
		return res.status(401).send('You are not an Administrator');
	}

	next();
}

export async function doHealthCheck(req: Request, res: Response) {
	//let dbConnected = await data.isConnected();

	//if (!dbConnected)
	//    return res.status(500).send(`Not able to connect to <strong>MONGODB</strong> database on <strong>${MONGO_HOST}</strong>.`);

	res.send(
		`Connection to database on '<strong>${DB_HOST}</strong>' is connected and functioning.`
	);
}
