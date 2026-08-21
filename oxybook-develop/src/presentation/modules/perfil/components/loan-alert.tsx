import { TriangleAlert } from "lucide-react";

interface LoanAlertProps {
  overdueCount: number;
}

export function LoanAlert({ overdueCount }: LoanAlertProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
          <TriangleAlert size={18} className="text-red-500" />
        </span>
        <span className="font-semibold text-[#82181A]">Atenção!</span>
      </div>
      <p className="text-sm text-[#C10007]">
        Você possui {overdueCount} {overdueCount === 1 ? "livro atrasado" : "livros atrasados"}. Devolva o quanto antes para evitar mais multas.
      </p>
    </div>
  );
}
