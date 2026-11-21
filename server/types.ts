export type Role = 'user' | 'admin';

export interface User {
	id: string;
	name: string;
	role: Role;
	token: string;
}

export const MENU_CATEGORIES = ['starter', 'main', 'dessert', 'drink'] as const;
export type MenuCategory = (typeof MENU_CATEGORIES)[number];

export interface MenuItem {
	id: string;
	name: string;
	category: MenuCategory;
	sellingPrice: number;
	description: string;
	isAvailable: boolean;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}
