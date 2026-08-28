"use client";

import { useState } from "react";
import Image from "next/image";
import { TextAlignJustify, ChevronDown, Search } from "lucide-react";

const CATEGORIES = ["Pesquisa Geral", "Título", "Autor", "Gênero", "ISBN"];

export function SectionHero() {
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("Pesquisa Geral");
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<section className="max-w-6xl mx-auto px-6">
			<div
				className="relative w-full rounded-2xl overflow-hidden shadow-xl border-1 border-[#6746354D]"
				style={{
					background: "#FFFFFF",
				}}
			>
				<div className="relative flex flex-col md:flex-row items-stretch min-h-[260px]">
					<div className="flex-1 flex flex-col justify-center px-18 py-12 z-10">
						<h1 className="text-4xl md:text-4xl font-manrope leading-tight tracking-tight text-[#4E0000CC] mb-4 font-regular">
							Bem-vindo ao{" "}
							<span className="relative font-medium inline-block text-[#4E0000]">
								OxyBook
							</span>
							<br />
							sua biblioteca digital.
						</h1>

						<p className="text-sm md:text-base text-[#67463599] mb-8 max-w-xs leading-relaxed">
							Explore o acervo, encontre novos livros e gerencie seus
							empréstimos de forma simples e rápida.
						</p>

						<div className="relative flex items-stretch w-full max-w-md rounded-lg border border-[#6746354D] bg-white shadow-sm overflow-visible">
							<div className="relative flex-shrink-0">
								<button
									type="button"
									onClick={() => setDropdownOpen((prev) => !prev)}
									className="flex items-center gap-1.5 px-3 h-full text-sm font-medium text-gray-600 border-r border-[#6746354D] hover:bg-gray-50 transition-colors rounded-l-lg whitespace-nowrap"
								>
									<TextAlignJustify size={15} color="#4E0000CC" />

									<span className="text-xs text-[#4E000099]">{category}</span>

									<ChevronDown size={15} color="#4E0000CC" />
								</button>

								{dropdownOpen && (
									<ul className="absolute top-full left-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
										{CATEGORIES.map((cat) => (
											<li key={cat}>
												<button
													type="button"
													onClick={() => {
														setCategory(cat);
														setDropdownOpen(false);
													}}
													className={`w-full text-left px-4 py-2 text-sm transition-colors${
														category === cat
															? "bg-red-50 text-[#b84040] font-semibold"
															: "text-gray-700 hover:bg-gray-50"
													}`}
												>
													{cat}
												</button>
											</li>
										))}
									</ul>
								)}
							</div>

							<input
								type="text"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Digite sua busca aqui"
								className="flex-1 px-4 py-2.5 text-sm text-gray-700 bg-transparent outline-none placeholder:text-[#4E000099] min-w-0"
							/>

							<button
								type="button"
								className="px-4 py-2.5 text-[#4E0000CC] hover:text-[#4E0000CC] hover:bg-gray-50 transition-colors rounded-r-lg border-l border-[#6746354D]"
							>
								<Search size={20} color="#4E0000CC" />
							</button>
						</div>
					</div>

					<div className="hidden md:flex items-stretch flex-shrink-0 pr-18">
						<div className="relative w-[400px]">
							<Image
								src="/image/books.png"
								alt="Livros da biblioteca"
								fill
								className="object-cover"
								priority
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
