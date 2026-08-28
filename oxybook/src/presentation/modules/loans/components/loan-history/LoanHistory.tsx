import { LoanHistory as LoanHistoryType } from "../../../types/loan.types";
import { Calendar, TriangleAlert, CircleCheckBig } from "lucide-react";

const mockHistory: LoanHistoryType[] = [
	{
		id: "1",
		book: { title: "1984", author: "George Orwell" },
		borrowedAt: "2026-02-15",
		dueDate: "2026-02-22",
		returnedAt: "2026-02-22",
		returnStatus: "on_time",
	},
	{
		id: "2",
		book: { title: "O Hobbit", author: "J.R.R. Tolkien" },
		borrowedAt: "2026-02-01",
		dueDate: "2026-02-08",
		returnedAt: "2026-02-10",
		fine: 4.0,
		returnStatus: "late",
	},
	{
		id: "3",
		book: { title: "O Hobbit", author: "J.R.R. Tolkien" },
		borrowedAt: "2026-02-01",
		dueDate: "2026-02-08",
		returnedAt: "2026-02-10",
		fine: 4.0,
		returnStatus: "late",
	},
	{
		id: "4",
		book: { title: "1984", author: "George Orwell" },
		borrowedAt: "2026-02-15",
		dueDate: "2026-02-22",
		returnedAt: "2026-02-22",
		returnStatus: "on_time",
	},
];

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR");
}

export default function LoanHistory() {
	if (mockHistory.length === 0) {
		return (
			<p className="text-sm text-gray-400 text-center py-8">
				Nenhum histórico encontrado.
			</p>
		);
	}

	return (
		<div className="space-y-3">
			{mockHistory.map((item) => (
				<div
					key={item.id}
					className="bg-white rounded-lg border border-[#6746354D] p-4 min-h-[120px]"
				>
					<div className="flex justify-between items-start">
						<div>
							<p className="font-semibold text-sm text-[#4E0000]">
								{item.book.title}
							</p>
							<p className="text-xs text-[#4E0000]">{item.book.author}</p>
						</div>
						{item.returnStatus === "on_time" ? (
							<span className="inline-flex gap-1 text-xs px-2 py-1 rounded-full font-medium text-green-600 bg-green-50">
								<CircleCheckBig size={18} />
								Devolvido no prazo
							</span>
						) : (
							<span className="inline-flex gap-1 text-xs px-2 py-1 rounded-full font-medium text-yellow-600 bg-yellow-50">
								<TriangleAlert size={18} />
								Devolvido com atraso
							</span>
						)}
					</div>

					<div className="grid grid-cols-3 gap-2 mt-3">
						<div>
							<p className="text-xs text-[#4E0000]">Empréstimo</p>
							<div className="flex items-center gap-1 mt-0.5">
								<Calendar size={16} color="#4E0000" />
								<p className="text-xs text-[#4E0000]">
									{formatDate(item.borrowedAt)}
								</p>
							</div>
						</div>

						<div>
							<p className="text-xs text-[#4E0000]">Prazo</p>
							<div className="flex items-center gap-1 mt-0.5">
								<Calendar size={16} color="#4E0000" />
								<p className="text-xs text-[#4E0000]">
									{formatDate(item.dueDate)}
								</p>
							</div>
						</div>

						<div>
							<p className="text-xs text-[#4E0000]">Devolvido em</p>
							<div className="flex items-center gap-1 mt-0.5">
								<Calendar size={16} color="#4E0000" />
								<p
									className={`text-xs ${item.returnStatus === "late" ? "text-yellow-600" : ""}`}
								>
									{formatDate(item.returnedAt)}
								</p>
							</div>
						</div>
					</div>

					{item.fine && (
						<div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
							<span className="text-xs text-[#F59E0B]">Multa aplicada:</span>
							<span className="text-sm font-bold text-[#4E0000CC]">
								R$ {item.fine.toFixed(2)}
							</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
