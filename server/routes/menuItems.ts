import { Router } from 'express';
import { menuItems } from '../data/menuItems';
import { MENU_CATEGORIES, MenuCategory, MenuItem, User } from '../types';
import { ErrorDetail, sendError, sendSuccess } from '../utils/respond';

const router = Router();

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 50;

// Admins can access every item; regular users only the items they own.
function canAccess(user: User, item: MenuItem): boolean {
	return user.role === 'admin' || item.ownerId === user.id;
}

function parsePositiveInt(value: unknown): number | null {
	if (typeof value !== 'string' || !/^\d+$/.test(value)) return null;
	const parsed = Number(value);
	return parsed >= 1 ? parsed : null;
}

// GET /api/v1/menu-items?page=1&perPage=10&category=main
router.get('/', (req, res) => {
	const user = req.user!;
	const details: ErrorDetail[] = [];

	let page = 1;
	if (req.query.page !== undefined) {
		const parsed = parsePositiveInt(req.query.page);
		if (parsed === null) {
			details.push({ field: 'page', message: 'Page must be a whole number of at least 1.' });
		} else {
			page = parsed;
		}
	}

	let perPage = DEFAULT_PER_PAGE;
	if (req.query.perPage !== undefined) {
		const parsed = parsePositiveInt(req.query.perPage);
		if (parsed === null || parsed > MAX_PER_PAGE) {
			details.push({
				field: 'perPage',
				message: `perPage must be a whole number between 1 and ${MAX_PER_PAGE}.`,
			});
		} else {
			perPage = parsed;
		}
	}

	const category = req.query.category;
	if (
		category !== undefined &&
		(typeof category !== 'string' || !MENU_CATEGORIES.includes(category as MenuCategory))
	) {
		details.push({
			field: 'category',
			message: `Category must be one of: ${MENU_CATEGORIES.join(', ')}.`,
		});
	}

	if (details.length > 0) {
		return sendError(
			res,
			400,
			'VALIDATION_ERROR',
			'The request contains invalid query parameters.',
			details
		);
	}

	const visible = menuItems.filter(
		(item) => canAccess(user, item) && (category === undefined || item.category === category)
	);
	const start = (page - 1) * perPage;
	const pageItems = visible.slice(start, start + perPage);

	return sendSuccess(res, 200, 'Menu items retrieved successfully.', pageItems, {
		total: visible.length,
		page,
		perPage,
	});
});

// GET /api/v1/menu-items/:id
// Items owned by another user return 404 (not 403) so regular users
// cannot discover which item IDs exist.
router.get('/:id', (req, res) => {
	const item = menuItems.find((candidate) => candidate.id === req.params.id);

	if (!item || !canAccess(req.user!, item)) {
		return sendError(
			res,
			404,
			'NOT_FOUND',
			`Menu item with id "${req.params.id}" was not found.`
		);
	}

	return sendSuccess(res, 200, 'Menu item retrieved successfully.', item);
});

export default router;
