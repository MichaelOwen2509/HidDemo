import { TriangleAlert } from "lucide-react";

interface Fine {
  bookTitle: string;
  daysOverdue: number;
  amount: number;
}

interface PendingFinesProps {
  fines: Fine[];
}

export function PendingFines({ fines }: PendingFinesProps) {
  const total = fines.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-lg bg-[#F59E0B1F] flex items-center justify-center shrink-0">
          <TriangleAlert size={18} className="text-amber-500" />
        </span>
        <span className="font-semibold text-[#142840]">Multas Pendentes</span>
      </div>

      <div className="flex flex-col gap-2">
        {fines.map((fine, index) => (
          <div key={index} className="rounded-xl bg-[#F59E0B1F] p-4 flex flex-col gap-1">
            <span className="text-sm font-medium text-[#674635]">{fine.bookTitle}</span>
            <span className="text-xs text-amber-500">{fine.daysOverdue} dias de atraso</span>
            <span className="text-base font-bold text-[#674635] mt-1">
              R$ {fine.amount.toFixed(2).replace(".", ",")}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-[#E5E7EB]" />

      <div className="flex items-center justify-between">
        <span className="text-sm text-[#1a1a1a]/60">Total a pagar:</span>
        <span className="text-lg font-bold text-[#4E0000]">
          R$ {total.toFixed(2).replace(".", ",")}
        </span>
      </div>

      <button
        type="button"
        className="w-full rounded-xl bg-[#4E0000] text-white font-semibold py-3.5 text-sm hover:bg-[#3a0000] transition-colors"
      >
        Pagar Multas
      </button>
    </div>
  );
}
