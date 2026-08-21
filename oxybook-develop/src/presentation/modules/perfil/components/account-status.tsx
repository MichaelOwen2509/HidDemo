interface AccountStatusProps {
  status: "regular" | "com_pendencia" | "bloqueado";
  bookLimit: number;
  available: number;
}

const statusConfig = {
  regular: { label: "Regular", className: "bg-green-100 text-green-700" },
  com_pendencia: { label: "Com pendência", className: "bg-rose-100 text-rose-600" },
  bloqueado: { label: "Bloqueado", className: "bg-red-100 text-red-700" },
};

export function AccountStatus({ status, bookLimit, available }: AccountStatusProps) {
  const { label, className } = statusConfig[status];

  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 flex flex-col gap-4">
      <span className="font-medium text-[#142840]">Status da Conta</span>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1a1a1a]/60">Status:</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
            {label}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1a1a1a]/60">Limite de livros:</span>
          <span className="text-sm font-medium text-[#1a1a1a]">{bookLimit} livros</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#101828]/60">Disponível:</span>
          <span className="text-sm font-medium text-[#4E0000]">{available} livros</span>
        </div>
      </div>
    </div>
  );
}
