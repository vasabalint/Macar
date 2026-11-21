import { NextFunction, Request, Response } from 'express';
import { findUserByToken } from '../data/users';
import { User } from '../types';
import { sendError } from '../utils/respond';

// Make the authenticated user available as req.user in route handlers.
declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

// Reads "Authorization: Bearer <token>" and attaches the matching mock user.
// Responds with 401 when the header is missing, malformed or the token is unknown.
export function authenticate(req: Request, res: Response, next: NextFunction) {
	const header = req.headers.authorization;

	if (!header) {
		return sendError(
			res,
			401,
			'UNAUTHORIZED',
			'Authentication token is missing. Send it as "Authorization: Bearer <token>".'
		);
	}

	const parts = header.trim().split(/\s+/);
	const [scheme, token] = parts;

	if (parts.length !== 2 || scheme.toLowerCase() !== 'bearer' || !token) {
		return sendError(
			res,
			401,
			'UNAUTHORIZED',
			'Authorization header must use the format "Bearer <token>".'
		);
	}

	const user = findUserByToken(token);

	if (!user) {
		return sendError(res, 401, 'UNAUTHORIZED', 'Authentication token is invalid.');
	}

	req.user = user;
	next();
}
