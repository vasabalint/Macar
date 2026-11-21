import { ErrorRequestHandler, RequestHandler } from 'express';
import { sendError } from '../utils/respond';

export const notFound: RequestHandler = (_req, res) => {
	sendError(res, 404, 'NOT_FOUND', 'The requested endpoint was not found.');
};

// Keep parser errors useful without exposing the submitted body or stack trace.
export const handleError: ErrorRequestHandler = (error, _req, res, next) => {
	if (res.headersSent) {
		return next(error);
	}

	const type = error?.type;
	const status = error?.status;
	if (status === 400 && type === 'entity.parse.failed') {
		return sendError(res, 400, 'VALIDATION_ERROR', 'The request body contains invalid JSON.', [
			{ field: 'body', message: 'Send a valid JSON object.' },
		]);
	}

	if (status === 413 && type === 'entity.too.large') {
		return sendError(res, 413, 'VALIDATION_ERROR', 'The request body exceeds the 100 KB limit.', [
			{ field: 'body', message: 'Reduce the request body size to at most 100 KB.' },
		]);
	}

	if (status === 415 && (type === 'charset.unsupported' || type === 'encoding.unsupported')) {
		return sendError(res, 415, 'VALIDATION_ERROR', 'The request body encoding is unsupported.', [
			{ field: 'body', message: 'Send UTF-8 JSON with a supported content encoding.' },
		]);
	}

	if (error instanceof URIError && status === 400) {
		return sendError(res, 400, 'VALIDATION_ERROR', 'The request path contains invalid encoding.', [
			{ field: 'path', message: 'Use valid URL encoding in the request path.' },
		]);
	}

	// Other parser failures include corrupt compressed data and invalid body sizes.
	if (status === 400) {
		return sendError(res, 400, 'VALIDATION_ERROR', 'The request body could not be read.', [
			{ field: 'body', message: 'Check the request body and its content headers.' },
		]);
	}

	console.error('Unhandled API error:', error);
	return sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected server error occurred.');
};
