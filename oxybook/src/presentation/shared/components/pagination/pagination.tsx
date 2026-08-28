import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (items: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20];

export function Pagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
}: PaginationProps) {
	const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const to = Math.min(currentPage * itemsPerPage, totalItems);

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<nav
			aria-label="Paginação dos resultados"
			className="mt-10 flex min-h-15 w-full items-center justify-between gap-4 rounded-lg px-5 py-4"
		>
			<p className="text-sm text-[#4E0000CC]">
				{from}-{String(to).padStart(2, "0")} de {totalItems} itens
			</p>

			<div className="flex items-center gap-3">
				<PaginationButton
					ariaLabel="Página anterior"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage <= 1}
				>
					<ChevronLeft size={16} aria-hidden="true" />
				</PaginationButton>

				{pages.map((page) => (
					<button
						key={page}
						type="button"
						onClick={() => onPageChange(page)}
						className={
							page === currentPage
								? "flex size-7 items-center justify-center rounded-md border border-[#4E0000] bg-[#4E0000] text-sm font-bold text-white"
								: "flex size-7 items-center justify-center rounded-md bg-white text-sm text-[#4E0000CC] hover:bg-[#F7EFEA]"
						}
						aria-current={page === currentPage ? "page" : undefined}
					>
						{page}
					</button>
				))}

				<PaginationButton
					ariaLabel="Próxima página"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage >= totalPages}
				>
					<ChevronRight size={16} aria-hidden="true" />
				</PaginationButton>
			</div>

			<div className="flex items-center gap-2 text-sm text-[#4E0000CC]">
				<div className="relative">
					<select
						value={itemsPerPage}
						onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
						className="flex h-7 w-12.5 cursor-pointer appearance-none items-center justify-center gap-2 rounded-md border border-[#4E0000] bg-[#4E0000] pl-2 text-sm font-medium text-white outline-none"
						aria-label="Itens por página"
					>
						{ITEMS_PER_PAGE_OPTIONS.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
					<ChevronDown
						size={12}
						className="pointer-events-none absolute top-1/2 right-1.5 -translate-y-1/2 text-white"
						aria-hidden="true"
					/>
				</div>
				<span className="uppercase">Itens por página</span>
			</div>
		</nav>
	);
}

function PaginationButton({
	ariaLabel,
	onClick,
	disabled,
	children,
}: {
	ariaLabel: string;
	onClick: () => void;
	disabled?: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			aria-label={ariaLabel}
			onClick={onClick}
			disabled={disabled}
			className="flex size-7 items-center justify-center rounded-md border border-[#4E0000] bg-[#4E0000] text-white disabled:opacity-40"
		>
			{children}
		</button>
	);
}
