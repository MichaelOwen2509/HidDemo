"use client";

import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");

	const handleSearch = () => {
		const params = new URLSearchParams();
		if (query) params.set("q", query);
		if (category) params.set("categoria", category);
		router.push(`/busca?${params.toString()}`);
	};

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
			<label className="relative block sm:w-65">
				<Search
					size={14}
					className="-translate-y-1/2 absolute top-1/2 left-4 text-[#674635]/35"
				/>
				<input
					type="search"
					placeholder="Leis..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					className="h-9 w-full rounded-md border border-[#D8C8BE] bg-white pr-4 pl-10 text-sm text-[#4E0000] outline-none transition-colors placeholder:text-[#674635]/35 focus:border-[#4E0000]/50"
				/>
			</label>

			<label className="relative block sm:w-37.5">
				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="h-9 w-full appearance-none rounded-md border border-[#D8C8BE] bg-white px-4 pr-9 text-sm text-[#674635]/55 outline-none transition-colors focus:border-[#4E0000]/50"
				>
					<option value="">Direito</option>
					<option value="tecnologia">Tecnologia</option>
					<option value="literatura">Literatura</option>
				</select>
				<ChevronDown
					size={14}
					className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 text-[#674635]/35"
				/>
			</label>

			<button
				type="button"
				onClick={handleSearch}
				className="flex h-9 items-center justify-center gap-2 rounded-md bg-[#4E0000] px-5 text-sm font-medium text-white transition-colors hover:bg-[#3A0000]"
			>
				Buscar
				<Search size={16} strokeWidth={2} />
			</button>

			<Link
				href="/busca"
				className="flex h-9 items-center justify-center rounded-md border border-[#D8C8BE] bg-white px-5 text-sm font-medium text-[#4E0000] transition-colors hover:bg-[#F7EFEA]"
			>
				Ver todos
			</Link>
		</div>
	);
}
