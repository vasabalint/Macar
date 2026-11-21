import { NextFunction, Request, Response } from 'express';
import { sendError } from '../utils/respond';

// Unknown routes get the JSON error envelope instead of Express's HTML page.
export function notFound(req: Request, res: Response) {
	return sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} was not found.`);
}

// Turns thrown errors into the JSON error envelope without exposing
// stack traces or other internal details to the client.
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
	const error = err as { type?: string; status?: number };

	if (error.type === 'entity.parse.failed') {
		return sendError(res, 400, 'VALIDATION_ERROR', 'Request body must be valid JSON.', [
			{ field: 'body', message: 'The JSON in the request body could not be parsed.' },
		]);
	}

	console.error(err);
	return sendError(res, 500, 'INTERNAL_ERROR', 'Something went wrong on the server.');
}
