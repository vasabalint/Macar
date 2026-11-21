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

export interface ListMeta {
	total: number;
	page: number;
	perPage: number;
}

// Sends a success response using the shared envelope:
// { success: true, message, data, meta? }
export function sendSuccess(
	res: Response,
	status: number,
	message: string,
	data: unknown,
	meta?: ListMeta
): Response {
	return res.status(status).json(
		meta ? { success: true, message, data, meta } : { success: true, message, data }
	);
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
