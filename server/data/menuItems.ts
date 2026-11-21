import { MenuItem } from '../types';

// In-memory mock data. Everything resets to this initial state whenever
// the server restarts.
//
// "item_999" is intentionally NOT in the list and can be used to
// demonstrate a 404 Not Found response.

const now = '2026-11-20T10:00:00.000Z';

export const menuItems: MenuItem[] = [
	{
		id: 'item_101',
		name: 'Lentil Soup',
		category: 'starter',
		sellingPrice: 6.5,
		description: 'Red lentil soup with lemon and toasted bread.',
		isAvailable: true,
		ownerId: 'user-a',
		createdAt: now,
		updatedAt: now,
	},
	{
		id: 'item_102',
		name: 'Grilled Chicken Plate',
		category: 'main',
		sellingPrice: 14.9,
		description: 'Grilled chicken breast with rice and seasonal salad.',
		isAvailable: true,
		ownerId: 'user-a',
		createdAt: now,
		updatedAt: now,
	},
	{
		id: 'item_103',
		name: 'Fresh Lemonade',
		category: 'drink',
		sellingPrice: 3.5,
		description: 'House-made lemonade with mint.',
		isAvailable: false,
		ownerId: 'user-a',
		createdAt: now,
		updatedAt: now,
	},
	{
		id: 'item_201',
		name: 'Beef Burger',
		category: 'main',
		sellingPrice: 12.0,
		description: 'Beef patty, cheddar, pickles and fries.',
		isAvailable: true,
		ownerId: 'user-b',
		createdAt: now,
		updatedAt: now,
	},
	{
		id: 'item_202',
		name: 'Caesar Salad',
		category: 'starter',
		sellingPrice: 8.0,
		description: 'Romaine, parmesan, croutons and Caesar dressing.',
		isAvailable: true,
		ownerId: 'user-b',
		createdAt: now,
		updatedAt: now,
	},
	{
		id: 'item_203',
		name: 'Chocolate Brownie',
		category: 'dessert',
		sellingPrice: 5.5,
		description: 'Warm brownie with vanilla ice cream.',
		isAvailable: true,
		ownerId: 'user-b',
		createdAt: now,
		updatedAt: now,
	},
];

let nextId = 300;

export function generateMenuItemId(): string {
	nextId += 1;
	return `item_${nextId}`;
}
