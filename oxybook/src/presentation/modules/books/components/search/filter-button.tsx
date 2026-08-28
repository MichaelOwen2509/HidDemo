"use client";

import { SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/presentation/external/components/ui/popover";
import { cn } from "@/presentation/shared/utils";

const CATEGORIES = [
	{ value: "direito", label: "Direito" },
	{ value: "tecnologia", label: "Tecnologia" },
	{ value: "literatura", label: "Literatura" },
];

interface FilterButtonProps {
	initialQuery?: string;
	initialCategory?: string;
}

export function FilterButton({
	initialQuery = "",
	initialCategory = "",
}: FilterButtonProps) {
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState(initialCategory);
	const [open, setOpen] = useState(false);

	const activeFiltersCount = selectedCategory ? 1 : 0;

	const handleApply = () => {
		const params = new URLSearchParams();
		if (initialQuery) params.set("q", initialQuery);
		if (selectedCategory) params.set("categoria", selectedCategory);

		const queryString = params.toString();
		router.push(queryString ? `/busca?${queryString}` : "/busca");
		setOpen(false);
	};

	const handleClear = () => {
		setSelectedCategory("");
		const params = new URLSearchParams();
		if (initialQuery) params.set("q", initialQuery);
		router.push(initialQuery ? `/busca?q=${initialQuery}` : "/busca");
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						"relative flex h-[46px] w-[114px] items-center justify-center gap-1.5 rounded-lg border px-5 text-base font-medium transition-colors",
						activeFiltersCount > 0
							? "border-[#4E0000] bg-white text-[#4E0000] hover:bg-[#F7EFEA]"
							: "border-[#6746354D] bg-[#4E0000] text-white hover:bg-[#3A0000]",
					)}
				>
					Filtro
					<SlidersHorizontal size={17} aria-hidden="true" />
					{activeFiltersCount > 0 && (
						<span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[#4E0000] text-[10px] font-bold text-white">
							{activeFiltersCount}
						</span>
					)}
				</button>
			</PopoverTrigger>

			<PopoverContent>
				<div className="flex flex-col gap-4">
					<p className="text-sm font-semibold text-[#4E0000CC]">Categoria</p>

					<div className="flex flex-col gap-2">
						{CATEGORIES.map(({ value, label }) => (
							<label
								key={value}
								className="flex cursor-pointer items-center gap-2 text-sm text-[#674635]"
							>
								<input
									type="radio"
									name="categoria"
									value={value}
									checked={selectedCategory === value}
									onChange={() => setSelectedCategory(value)}
									className="accent-[#4E0000]"
								/>
								{label}
							</label>
						))}
					</div>

					<div className="flex gap-2 pt-1">
						<button
							type="button"
							onClick={handleClear}
							className="flex-1 rounded-md border border-[#D8C8BE] py-1.5 text-sm text-[#4E0000] transition-colors hover:bg-[#F7EFEA]"
						>
							Limpar
						</button>
						<button
							type="button"
							onClick={handleApply}
							className="flex-1 rounded-md bg-[#4E0000] py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#3A0000]"
						>
							Aplicar
						</button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
