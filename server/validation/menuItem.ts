import { MENU_CATEGORIES, MenuCategory } from '../types';
import { ErrorDetail } from '../utils/respond';

export interface MenuItemInput {
	name: string;
	category: MenuCategory;
	sellingPrice: number;
	description: string;
	isAvailable: boolean;
}

export type ValidationResult =
	| { valid: true; value: MenuItemInput }
	| { valid: false; details: ErrorDetail[] };

const ALLOWED_FIELDS = ['name', 'category', 'sellingPrice', 'description', 'isAvailable'];
const READ_ONLY_FIELDS = ['id', 'ownerId', 'createdAt', 'updatedAt'];

export const NAME_MIN = 3;
export const NAME_MAX = 80;
export const DESCRIPTION_MAX = 300;
export const PRICE_MAX = 1000;

// Validates the body of POST and PUT requests. PUT replaces the whole item,
// so both use the same rules: name, category and sellingPrice are required,
// description and isAvailable are optional.
export function validateMenuItemBody(body: unknown): ValidationResult {
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		return {
			valid: false,
			details: [{ field: 'body', message: 'Request body must be a JSON object.' }],
		};
	}

	const input = body as Record<string, unknown>;
	const details: ErrorDetail[] = [];

	for (const field of Object.keys(input)) {
		if (READ_ONLY_FIELDS.includes(field)) {
			details.push({ field, message: `${field} is set by the server and cannot be sent.` });
		} else if (!ALLOWED_FIELDS.includes(field)) {
			details.push({ field, message: `Unknown field "${field}".` });
		}
	}

	const { name, category, sellingPrice, description, isAvailable } = input;

	if (name === undefined || name === null) {
		details.push({ field: 'name', message: 'Name is required.' });
	} else if (typeof name !== 'string') {
		details.push({ field: 'name', message: 'Name must be a string.' });
	} else if (name.trim().length < NAME_MIN || name.trim().length > NAME_MAX) {
		details.push({
			field: 'name',
			message: `Name must contain between ${NAME_MIN} and ${NAME_MAX} characters.`,
		});
	}

	if (category === undefined || category === null) {
		details.push({ field: 'category', message: 'Category is required.' });
	} else if (typeof category !== 'string' || !MENU_CATEGORIES.includes(category as MenuCategory)) {
		details.push({
			field: 'category',
			message: `Category must be one of: ${MENU_CATEGORIES.join(', ')}.`,
		});
	}

	if (sellingPrice === undefined || sellingPrice === null) {
		details.push({ field: 'sellingPrice', message: 'Selling price is required.' });
	} else if (typeof sellingPrice !== 'number' || !Number.isFinite(sellingPrice)) {
		details.push({ field: 'sellingPrice', message: 'Selling price must be a number.' });
	} else if (sellingPrice <= 0 || sellingPrice > PRICE_MAX) {
		details.push({
			field: 'sellingPrice',
			message: `Selling price must be greater than 0 and at most ${PRICE_MAX}.`,
		});
	}

	if (description !== undefined) {
		if (typeof description !== 'string') {
			details.push({ field: 'description', message: 'Description must be a string.' });
		} else if (description.length > DESCRIPTION_MAX) {
			details.push({
				field: 'description',
				message: `Description must contain at most ${DESCRIPTION_MAX} characters.`,
			});
		}
	}

	if (isAvailable !== undefined && typeof isAvailable !== 'boolean') {
		details.push({ field: 'isAvailable', message: 'isAvailable must be true or false.' });
	}

	if (details.length > 0) {
		return { valid: false, details };
	}

	return {
		valid: true,
		value: {
			name: (name as string).trim(),
			category: category as MenuCategory,
			sellingPrice: Math.round((sellingPrice as number) * 100) / 100,
			description: ((description as string | undefined) ?? '').trim(),
			isAvailable: (isAvailable as boolean | undefined) ?? true,
		},
	};
}
