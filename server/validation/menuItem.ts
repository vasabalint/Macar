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
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;

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

	const { name, category, sellingPrice, description, isAvailable } = body as Record<
		string,
		unknown
	>;
	const details: ErrorDetail[] = [];

	for (const field of Object.keys(body)) {
		if (!ALLOWED_FIELDS.includes(field)) {
			details.push({ field, message: 'Unknown field. Only editable menu item fields are allowed.' });
		}
	}

	if (typeof name !== 'string') {
		details.push({ field: 'name', message: 'Name is required and must be a string.' });
	} else if (name.trim().length < MIN_NAME_LENGTH || name.trim().length > MAX_NAME_LENGTH) {
		details.push({
			field: 'name',
			message: `Name must contain between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters after trimming.`,
		});
	}

	if (typeof category !== 'string' || !MENU_CATEGORIES.includes(category as MenuCategory)) {
		details.push({
			field: 'category',
			message: `Category is required and must be one of: ${MENU_CATEGORIES.join(', ')}.`,
		});
	}

	if (typeof sellingPrice !== 'number' || !Number.isFinite(sellingPrice) || sellingPrice < 0) {
		details.push({
			field: 'sellingPrice',
			message: 'Selling price is required and must be a finite number of at least 0.',
		});
	}

	if (Object.hasOwn(body, 'description')) {
		if (typeof description !== 'string') {
			details.push({ field: 'description', message: 'Description must be a string when provided.' });
		} else if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
			details.push({
				field: 'description',
				message: `Description must contain at most ${MAX_DESCRIPTION_LENGTH} characters after trimming.`,
			});
		}
	}

	if (Object.hasOwn(body, 'isAvailable') && typeof isAvailable !== 'boolean') {
		details.push({ field: 'isAvailable', message: 'Availability must be a boolean when provided.' });
	}

	if (details.length > 0) {
		return { valid: false, details };
	}

	return {
		valid: true,
		value: {
			name: (name as string).trim(),
			category: category as MenuCategory,
			sellingPrice: sellingPrice as number,
			description: typeof description === 'string' ? description.trim() : '',
			isAvailable: typeof isAvailable === 'boolean' ? isAvailable : true,
		},
	};
}
