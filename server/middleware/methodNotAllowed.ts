import { RequestHandler } from 'express';
import { sendError } from '../utils/respond';

export function methodNotAllowed(methods: string[]): RequestHandler {
	const allow = [...methods, 'OPTIONS'].join(', ');
	return (req, res) => {
		res.set('Allow', allow);
		if (req.method === 'OPTIONS') {
			res.status(204).end();
			return;
		}
		sendError(res, 405, 'METHOD_NOT_ALLOWED', 'The HTTP method is not supported for this endpoint.');
	};
}
