import type { ReactNode } from "react";
import { cn } from "@/presentation/shared/utils";

interface RuleItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function RuleItem({ icon, title, description, className }: RuleItemProps) {
  return (
    <li className={cn("flex items-center gap-3", className)}>
      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#4E0000] text-white shrink-0">
        {icon}
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-[#4E0000]">{title}</span>
        <span className="text-sm text-[#4E0000]/60">{description}</span>
      </div>
    </li>
  );
}
