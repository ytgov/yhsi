import { Request, Response, NextFunction } from 'express';
import { isEmpty, isString, isUndefined } from 'lodash';
import { timingSafeEqual } from 'crypto';

import { SERVICE_ACCOUNT_API_KEY, DB_CONFIG } from '@/config';
import { UserService } from '@/services';

const SERVICE_ACCOUNT_EMAIL = 'service@yhsi.internal';
const userService = new UserService(DB_CONFIG);

export async function injectServiceAccountMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (isEmpty(SERVICE_ACCOUNT_API_KEY)) {
		return next();
	}

	const token = req.headers['x-api-key'];
	if (!isString(token)) {
		return next();
	}

	if (token.length !== SERVICE_ACCOUNT_API_KEY.length) {
		return next();
	}

	if (!timingSafeEqual(Buffer.from(token), Buffer.from(SERVICE_ACCOUNT_API_KEY))) {
		return next();
	}

	try {
		const serviceUser = await userService.getByEmail(SERVICE_ACCOUNT_EMAIL);
		if (isUndefined(serviceUser)) {
			throw new Error('Unable to find service account');
		}

		req.user = serviceUser;
		req.isServiceAccount = true;
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}

	return next();
}

export default injectServiceAccountMiddleware;
