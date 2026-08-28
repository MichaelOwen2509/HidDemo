import { FilterButton } from "./filter-button";
import { SearchResults } from "./search-results";
import type { SearchParams } from "./types";

type SearchPageProps = SearchParams;

export function SearchPage({ query, category }: SearchPageProps) {
	return (
		<>
			<div className="mb-15 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
				<div className="flex max-w-[564px] flex-col gap-4">
					<h1 className="text-[40px] font-normal leading-[42px] text-[#4E0000CC]">
						{query ? `Resultados para "${query}"` : "Explorar acervo"}
					</h1>
					<p className="text-lg leading-relaxed text-[#67463599]">
						Confira os livros encontrados com base no termo pesquisado e explore
						as opções disponíveis no acervo.
					</p>
				</div>

				<FilterButton initialQuery={query} initialCategory={category} />
			</div>

			<SearchResults
				key={`${query ?? ""}-${category ?? ""}`}
				query={query}
				category={category}
			/>
		</>
	);
}
