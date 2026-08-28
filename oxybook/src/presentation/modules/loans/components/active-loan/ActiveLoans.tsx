import { Loan } from "../../../types/loan.types";
import { LoanCard } from "../loan-card";

const mockLoans: Loan[] = [
	{
		id: "1",
		book: {
			title: "Atomic Habits",
			author: "James Clear",
			coverUrl: "/image/capa-livro.png",
		},
		borrowedAt: "2026-03-30",
		dueDate: "2026-04-13",
		status: "on_time",
	},
	{
		id: "2",
		book: {
			title: "Atomic Habits",
			author: "James Clear",
			coverUrl: "/image/capa-livro.png",
		},
		borrowedAt: "2026-03-30",
		dueDate: "2026-04-08",
		status: "late",
	},
	{
		id: "3",
		book: {
			title: "Atomic Habits",
			author: "James Clear",
			coverUrl: "/image/capa-livro.png",
		},
		borrowedAt: "2026-03-30",
		dueDate: "2026-03-04",
		status: "expiring_soon",
	},
	{
		id: "4",
		book: {
			title: "Atomic Habits",
			author: "James Clear",
			coverUrl: "/image/capa-livro.png",
		},
		borrowedAt: "2026-03-30",
		dueDate: "2026-03-04",
		status: "expiring_soon",
	},
];

export default function ActiveLoans() {
	if (mockLoans.length === 0) {
		return (
			<p className="text-sm text-gray-400 text-center py-8">
				Nenhum empréstimo ativo.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{mockLoans.map((loan) => (
				<LoanCard key={loan.id} loan={loan} />
			))}
		</div>
	);
}
