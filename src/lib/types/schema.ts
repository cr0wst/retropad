// This file contains type definitions shared between client and server code

export interface User {
	id: string;
	name: string;
	email: string;
	providerId: string;
	provider: string;
	avatarUrl: string;
	isAdmin: boolean;
	createdAt: Date;
}

export interface Session {
	id: string;
	userId: string;
	expiresAt: Date;
}

export interface Pad {
	id: string;
	ownerId: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}
