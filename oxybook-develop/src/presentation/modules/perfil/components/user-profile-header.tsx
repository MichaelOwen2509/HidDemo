import { User } from "lucide-react";

interface UserProfileHeaderProps {
  name: string;
  email: string;
  memberSince: string;
  totalLoans: number;
  returnedBooks: number;
  activeLoans: number;
}

export function UserProfileHeader({
  name,
  email,
  memberSince,
  totalLoans,
  returnedBooks,
  activeLoans,
}: UserProfileHeaderProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8D5C4]">
      <div className="bg-[#4E0000] px-8 py-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0">
          <User size={32} className="text-[#4E0000]" />
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-white text-xl font-semibold">{name}</span>
          <span className="text-white/80 text-sm">{email}</span>
          <span className="text-white/60 text-sm">Membro desde {memberSince}</span>
        </div>
      </div>

      <div className="bg-white grid grid-cols-3 divide-x divide-[#E8D5C4]">
        <StatItem value={totalLoans} label="Total de Empréstimos" />
        <StatItem value={returnedBooks} label="Livros Devolvidos" />
        <StatItem value={activeLoans} label="Empréstimos Ativos" />
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-5">
      <span className="text-2xl font-bold text-[#1a1a1a]">{value}</span>
      <span className="text-sm text-[#1a1a1a]/60 text-center">{label}</span>
    </div>
  );
}
