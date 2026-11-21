import { User } from '../types';

// Predefined mock users. There is no real login: clients send one of these
// tokens as "Authorization: Bearer <token>".
export const users: User[] = [
	{ id: 'user-a', name: 'User A', role: 'user', token: 'user-a-token' },
	{ id: 'user-b', name: 'User B', role: 'user', token: 'user-b-token' },
	{ id: 'admin', name: 'Administrator', role: 'admin', token: 'admin-token' },
];

export function findUserByToken(token: string): User | undefined {
	return users.find((user) => user.token === token);
}
