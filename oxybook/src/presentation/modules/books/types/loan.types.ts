export type LoanStatus = "on_time" | "late" | "expiring_soon";

export interface Book {
	title: string;
	author: string;
	coverUrl?: string;
}

export interface Loan {
	id: string;
	book: Book;
	borrowedAt: string;
	dueDate: string;
	status: LoanStatus;
}

export interface LoanHistory {
	id: string;
	book: Book;
	borrowedAt: string;
	dueDate: string;
	returnedAt: string;
	fine?: number;
	returnStatus: "on_time" | "late";
}
