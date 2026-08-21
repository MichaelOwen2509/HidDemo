import { AccountStatus } from "./account-status";
import { LoanAlert } from "./loan-alert";
import { PendingFines } from "./pending-fines";

interface Fine {
  bookTitle: string;
  daysOverdue: number;
  amount: number;
}

interface ProfileAsideProps {
  overdueCount: number;
  fines: Fine[];
  accountStatus: "regular" | "com_pendencia" | "bloqueado";
  bookLimit: number;
  available: number;
}

export function ProfileAside({
  overdueCount,
  fines,
  accountStatus,
  bookLimit,
  available,
}: ProfileAsideProps) {
  return (
    <aside className="w-80 shrink-0 flex flex-col gap-4">
      {overdueCount > 0 && <LoanAlert overdueCount={overdueCount} />}
      {fines.length > 0 && <PendingFines fines={fines} />}
      <AccountStatus status={accountStatus} bookLimit={bookLimit} available={available} />
    </aside>
  );
}
