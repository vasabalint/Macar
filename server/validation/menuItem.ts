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

	if (typeof name !== 'string' || name.trim() === '') {
		details.push({ field: 'name', message: 'Name is required.' });
	}

	if (typeof category !== 'string' || !MENU_CATEGORIES.includes(category as MenuCategory)) {
		details.push({
			field: 'category',
			message: `Category is required and must be one of: ${MENU_CATEGORIES.join(', ')}.`,
		});
	}

	if (typeof sellingPrice !== 'number') {
		details.push({ field: 'sellingPrice', message: 'Selling price is required.' });
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
