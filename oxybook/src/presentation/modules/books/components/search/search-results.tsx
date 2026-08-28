"use client";

import { useState } from "react";
import { Pagination } from "@/presentation/shared/components/pagination/pagination";
import { AvailableBookCard } from "../books-available/available-book-card";
import type { SearchParams } from "./types";

// Banco de dados atualizado com as propriedades 'epc' para cada livro
const mockBooks = [
	{
		epc: "B1B100000000009876543210",
		id: "1",
		title: "The Silver Crow",
		author: "Osvaldo Sousa",
		category: "literatura",
		description:
			"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam o amanhã. Entre desafios, descobertas e grandes ideias, este livro mostra como o futuro começa com quem decide criar algo novo hoje.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "B1B1006020006094374909C1",
		id: "2",
		title: "Código Limpo",
		author: "Robert C. Martin",
		category: "tecnologia",
		description:
			"Um guia para escrever código de qualidade, focado em boas práticas e princípios que tornam o software mais fácil de manter e evoluir ao longo do tempo.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "B1B100000000000000003333",
		id: "3",
		title: "Cultura da convergência",
		author: "Henry Jenkins",
		category: "Progamação",
		description:
			"Dicas e filosofias para desenvolvedores que desejam aprimorar suas habilidades e se tornar profissionais mais completos e eficazes no mercado",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "B1B100000000000000000000",
		id: "4",
		title: "O Programador Pragmático",
		author: "David Thomas",
		category: "tecnologia",
		description:
			"Dicas e filosofias para desenvolvedores que desejam aprimorar suas habilidades e se tornar profissionais mais completos e eficazes no mercado.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "ABC000000000000000000002",
		id: "5",
		title: "Processo Penal",
		author: "Guilherme Nucci",
		category: "direito",
		description:
			"Manual abrangente do processo penal brasileiro, com análise detalhada da legislação vigente e jurisprudência dos tribunais superiores.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "ABC000000000000000000003",
		id: "6",
		title: "A Jornada do Herói",
		author: "Maria Silva",
		category: "literatura",
		description:
			"Um romance épico sobre superação, amizade e a busca pelo propósito de vida em um mundo em constante transformação.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "ABC000000000000000000001",
		id: "7",
		title: "Sistemas Distribuídos",
		author: "Andrew Tanenbaum",
		category: "tecnologia",
		description:
			"Fundamentos e arquiteturas de sistemas distribuídos modernos, cobrindo consenso, replicação e tolerância a falhas em larga escala.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "ABC000000000000000000004",
		id: "8",
		title: "Direito Civil",
		author: "Flávio Tartuce",
		category: "direito",
		description:
			"Estudo aprofundado do direito civil brasileiro, com análise das principais mudanças legislativas e seus impactos nas relações privadas.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "ABC000000000000000000005",
		id: "9",
		title: "Mil Sóis Esplêndidos",
		author: "Khaled Hosseini",
		category: "literatura",
		description:
			"Uma história poderosa de amizade e resistência entre duas mulheres afegãs em meio a décadas de guerra, perda e esperança.",
		coverUrl: "/image/capa-livro.png",
	},
];

type SearchResultsProps = SearchParams;

export function SearchResults({ query, category }: SearchResultsProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const filtered = mockBooks.filter((book) => {
		const matchesQuery =
			!query ||
			book.title.toLowerCase().includes(query.toLowerCase()) ||
			book.author.toLowerCase().includes(query.toLowerCase());
		const matchesCategory = !category || book.category === category;
		return matchesQuery && matchesCategory;
	});

	if (filtered.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-[#674635]/50">
				<p className="text-lg">
					{query
						? `Nenhum resultado para "${query}"`
						: "Nenhum livro encontrado"}
				</p>
				<p className="mt-2 text-sm">Tente outros termos de busca</p>
			</div>
		);
	}

	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const paginated = filtered.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	return (
		<div>
			<div className="grid justify-items-center gap-10 md:grid-cols-2 xl:grid-cols-3">
				{paginated.map((book) => (
					<AvailableBookCard
						key={book.id}
						id={book.id} // <-- CORREÇÃO: Propriedade id adicionada aqui
						title={book.title}
						author={book.author}
						description={book.description}
						coverUrl={book.coverUrl}
					/>
				))}
			</div>

			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				totalItems={filtered.length}
				itemsPerPage={itemsPerPage}
				onPageChange={setCurrentPage}
				onItemsPerPageChange={(items) => {
					setItemsPerPage(items);
					setCurrentPage(1);
				}}
			/>
		</div>
	);
}
