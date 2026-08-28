"use client";

import { useState } from "react";
import { ActiveLoans } from "../active-loan";
import { LoanHistory } from "../loan-history";

type Tab = "active" | "history";

export default function LoanPanel() {
	const [tab, setTab] = useState<Tab>("active");

	return (
		<div className="w-full flex flex-col gap-3">
			<div className="flex bg-[#FFFFFF] p-1 gap-1 rounded-xl border border-[#6746354D]">
				<button
					onClick={() => setTab("active")}
					className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
						tab === "active"
							? "bg-[#4E0000] text-white font-medium shadow-sm"
							: "text-[#142840] hover:text-white hover:bg-[#5a1515]"
					}`}
				>
					Empréstimos Ativos
				</button>

				<button
					onClick={() => setTab("history")}
					className={`flex-1 text-sm py-2 rounded-lg transition-colors ${
						tab === "history"
							? "bg-[#4E0000] text-white font-medium shadow-sm"
							: "text-[#142840] hover:text-white hover:bg-[#5a1515]"
					}`}
				>
					Histórico
				</button>
			</div>

			<div className="max-h-[80vh] overflow-y-auto">
				{tab === "active" ? <ActiveLoans /> : <LoanHistory />}
			</div>
		</div>
	);
}
