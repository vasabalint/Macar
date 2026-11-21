import { Response } from 'express';

export type ErrorCode =
	| 'VALIDATION_ERROR'
	| 'UNAUTHORIZED'
	| 'FORBIDDEN'
	| 'NOT_FOUND'
	| 'METHOD_NOT_ALLOWED'
	| 'CONFLICT'
	| 'INTERNAL_ERROR';

export interface ErrorDetail {
	field: string;
	message: string;
}

// Sends an error using the shared envelope:
// { success: false, error: { code, message, details? } }
export function sendError(
	res: Response,
	status: number,
	code: ErrorCode,
	message: string,
	details?: ErrorDetail[]
): Response {
	return res.status(status).json({
		success: false,
		error: details ? { code, message, details } : { code, message },
	});
}
