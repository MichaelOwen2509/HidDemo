import { Loan } from "../../../types/loan.types";
import {
	RefreshCw,
	Calendar,
	TriangleAlert,
	Clock,
	CircleCheckBig,
} from "lucide-react";

const statusConfig = {
	on_time: {
		label: "No prazo",
		textColor: "text-green-600",
		bgColor: "bg-green-50",
		icon: CircleCheckBig,
		dateColor: "text-green-600",
	},
	late: {
		label: "Atrasado",
		textColor: "text-[#C10007]",
		bgColor: "bg-[#FFE2E2]",
		icon: TriangleAlert,
		dateColor: "text-red-500",
	},
	expiring_soon: {
		label: "Vence em breve",
		textColor: "text-[#F59E0B]",
		bgColor: "bg-[#FDF3E1]",
		icon: Clock,
		dateColor: "text-yellow-600",
	},
};

function formatDate(iso: string) {
	return new Date(iso).toLocaleDateString("pt-BR");
}

function getDaysInfo(dueDate: string) {
	const today = new Date();
	const due = new Date(dueDate);
	const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);

	if (diff < 0) return `${Math.abs(diff)} dias de atraso`;
	if (diff === 0) return "Vence hoje";
	return `${diff} dias restantes`;
}

interface Props {
	loan: Loan;
}

export default function LoanCard({ loan }: Props) {
	const s = statusConfig[loan.status as keyof typeof statusConfig];
	const StatusIcon = s.icon;

	return (
		<div className="bg-white rounded-lg border border-[#6746354D] p-3 min-h-[160px]">
			<div className="flex gap-2">
				{loan.book.coverUrl ? (
					<img
						src={loan.book.coverUrl}
						alt={loan.book.title}
						className="w-20 h-25 rounded object-cover shrink-0"
					/>
				) : (
					<div className="w-14 h-20 rounded bg-gray-200 shrink-0" />
				)}

				<div className="flex-1 min-w-0">
					<div className="flex justify-between items-start gap-2">
						<div>
							<p className="font-semibold text-sm leading-tight text-[#4E0000CC]">
								{loan.book.title}
							</p>
							<p className="text-xs mt-0.5 text-[#4E0000CC]">
								{loan.book.author}
							</p>
						</div>
						<span
							className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${s.textColor} ${s.bgColor}`}
						>
							<StatusIcon size={18} />
							{s.label}
						</span>
					</div>

					<p className="text-xs text-[#142840] flex items-center gap-1 mt-2">
						<Calendar size={16} color="#142840" />
						Empréstimo: {formatDate(loan.borrowedAt)}
					</p>

					<p
						className={`text-xs flex items-center gap-1 mt-0.5 ${s.dateColor}`}
					>
						Devolução: {formatDate(loan.dueDate)} • {getDaysInfo(loan.dueDate)}
					</p>
				</div>
			</div>

			<div className="flex gap-2 mt-3">
				<button className="flex-1 bg-[#4E0000] text-white text-xs py-2 rounded-lg hover:bg-[#5a1515] transition-colors">
					Devolver Livro
				</button>
				<button className="flex items-center gap-1 border-2 border-[#6746354D] text-xs text-[#4E0000] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
					<RefreshCw size={16} />
					Renovar
				</button>
			</div>
		</div>
	);
}
