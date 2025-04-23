export interface BaseNote {
	id: string;
	title: string;
	content: string;
	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Note extends BaseNote {
	padId: string;
}

export interface Bookmark {
	id: string;
	noteId: string;
	line: number;
	label: string;
	color: string;
	createdAt: string;
	updatedAt: string;
}
