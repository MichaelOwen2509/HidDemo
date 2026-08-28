import type { Book } from "@/types/book";

export type BookDetails = Book & {
	slug: string;
	mainTitle: string;
	edition: string;
	category: string;
	publisher: string;
	year: number;
	pages: number;
	isbn: string;
	subjects: string;
	secondaryAuthors: string[];
	availableCopies: number;
	totalCopies: number;
	location: string;
};

export const books: BookDetails[] = [
	{
		id: "1",
		slug: "the-silver-crow",
		title: "Lakukan Semau Mu",
		mainTitle:
			"Água e energia elétrica [recurso eletrônico] : teoria e prática sobre o uso eficiente / Caroline Daiane Raduns; Diane Meri Weiller Johann; Fernanda da Cunha Pereira; Luana Obregon Carvalho; Luis Fernando Espinosa Cocian; Taciana Paula Ederle .",
		edition: "2. ed.",
		author: "Osvaldo Sousa",
		description:
			"Água e energia elétrica [recurso eletrônico] : teoria e prática sobre o uso eficiente / Caroline Daiane Raduns; Diane Meri Weiller Johann; Fernanda da Cunha Pereira; Luana Obregon Carvalho; Luis Fernando Espinosa Cocian; Taciana Paula Ederle .",
		coverUrl: "/image/figma/screen-book-cover-7971db.png",
		category: "Engenharia de software; Engenharia da computação",
		publisher: "Unijuí",
		year: 2025,
		pages: 328,
		isbn: "9788541904742",
		subjects: "Engenharia de software; Engenharia da computação",
		secondaryAuthors: [
			"Carvalho, Luana Obregon",
			"Cocian, Luis Fernando Espinosa",
			"Ederle, Taciana Paula",
			"Johann, Diane Meri Weiller",
			"Pereira, Fernanda da Cunha",
			"Raduns, Caroline Daiane",
		],
		availableCopies: 4,
		totalCopies: 6,
		location: "Estante A3, prateleira 2",
	},
	{
		id: "2",
		slug: "algoritmos-em-pratica",
		title: "Algoritmos em Prática",
		mainTitle: "Algoritmos em Prática / Marina Costa.",
		edition: "1. ed.",
		author: "Marina Costa",
		description:
			"Fundamentos de lógica, estruturas de dados e resolução de problemas para estudantes.",
		coverUrl: "/image/capa-livro.png",
		category: "Computação",
		publisher: "CEUMA Press",
		year: 2024,
		pages: 412,
		isbn: "978-85-00000-02-8",
		subjects: "Computação; Algoritmos; Estruturas de dados",
		secondaryAuthors: ["Costa, Marina"],
		availableCopies: 2,
		totalCopies: 5,
		location: "Estante B1, prateleira 4",
	},
	{
		id: "3",
		slug: "design-de-sistemas",
		title: "Design de Sistemas",
		mainTitle: "Design de Sistemas / Henrique Alves.",
		edition: "1. ed.",
		author: "Henrique Alves",
		description:
			"Conceitos essenciais para criar interfaces, fluxos e produtos digitais consistentes.",
		coverUrl: "/image/capa-livro.png",
		category: "Design",
		publisher: "OxyBooks",
		year: 2025,
		pages: 276,
		isbn: "978-85-00000-03-5",
		subjects: "Design; Interfaces digitais; Sistemas",
		secondaryAuthors: ["Alves, Henrique"],
		availableCopies: 5,
		totalCopies: 5,
		location: "Estante C2, prateleira 1",
	},
	{
		id: "4",
		slug: "pesquisa-cientifica-essencial",
		title: "Pesquisa Científica Essencial",
		mainTitle: "Pesquisa Científica Essencial / Livia Andrade.",
		edition: "3. ed.",
		author: "Livia Andrade",
		description:
			"Métodos, escrita acadêmica e boas práticas para desenvolver trabalhos de pesquisa.",
		coverUrl: "/image/capa-livro.png",
		category: "Metodologia",
		publisher: "Biblioteca CEUMA",
		year: 2023,
		pages: 224,
		isbn: "978-85-00000-04-2",
		subjects: "Metodologia; Pesquisa científica; Escrita acadêmica",
		secondaryAuthors: ["Andrade, Livia"],
		availableCopies: 1,
		totalCopies: 3,
		location: "Estante D4, prateleira 3",
	},
	{
		id: "5",
		slug: "fundamentos-de-redes",
		title: "Fundamentos de Redes",
		mainTitle: "Fundamentos de Redes / Rafael Moraes.",
		edition: "2. ed.",
		author: "Rafael Moraes",
		description:
			"Conceitos de comunicação, protocolos e infraestrutura para redes modernas.",
		coverUrl: "/image/capa-livro.png",
		category: "Redes de computadores",
		publisher: "CEUMA Press",
		year: 2022,
		pages: 360,
		isbn: "978-85-00000-05-9",
		subjects: "Redes; Infraestrutura; Protocolos",
		secondaryAuthors: ["Moraes, Rafael"],
		availableCopies: 3,
		totalCopies: 4,
		location: "Estante B2, prateleira 1",
	},
	{
		id: "6",
		slug: "banco-de-dados-aplicado",
		title: "Banco de Dados Aplicado",
		mainTitle: "Banco de Dados Aplicado / Camila Nunes.",
		edition: "1. ed.",
		author: "Camila Nunes",
		description:
			"Modelagem, consultas e organização de dados para aplicações acadêmicas e profissionais.",
		coverUrl: "/image/capa-livro.png",
		category: "Banco de dados",
		publisher: "OxyBooks",
		year: 2024,
		pages: 298,
		isbn: "978-85-00000-06-6",
		subjects: "Banco de dados; SQL; Modelagem",
		secondaryAuthors: ["Nunes, Camila"],
		availableCopies: 2,
		totalCopies: 4,
		location: "Estante B3, prateleira 2",
	},
	{
		id: "7",
		slug: "engenharia-de-software-moderna",
		title: "Engenharia de Software Moderna",
		mainTitle: "Engenharia de Software Moderna / Pedro Lima.",
		edition: "4. ed.",
		author: "Pedro Lima",
		description:
			"Práticas de projeto, testes e manutenção para produtos de software confiáveis.",
		coverUrl: "/image/capa-livro.png",
		category: "Engenharia de software",
		publisher: "Biblioteca CEUMA",
		year: 2025,
		pages: 444,
		isbn: "978-85-00000-07-3",
		subjects: "Engenharia de software; Testes; Arquitetura",
		secondaryAuthors: ["Lima, Pedro"],
		availableCopies: 4,
		totalCopies: 7,
		location: "Estante B4, prateleira 1",
	},
	{
		id: "8",
		slug: "interfaces-humanas",
		title: "Interfaces Humanas",
		mainTitle: "Interfaces Humanas / Beatriz Rocha.",
		edition: "1. ed.",
		author: "Beatriz Rocha",
		description:
			"Experiência do usuário, acessibilidade e padrões visuais para interfaces digitais.",
		coverUrl: "/image/capa-livro.png",
		category: "UX Design",
		publisher: "OxyBooks",
		year: 2023,
		pages: 252,
		isbn: "978-85-00000-08-0",
		subjects: "UX; Acessibilidade; Interfaces",
		secondaryAuthors: ["Rocha, Beatriz"],
		availableCopies: 1,
		totalCopies: 2,
		location: "Estante C1, prateleira 3",
	},
	{
		id: "9",
		slug: "logica-para-computacao",
		title: "Lógica para Computação",
		mainTitle: "Lógica para Computação / Samuel Ferreira.",
		edition: "2. ed.",
		author: "Samuel Ferreira",
		description:
			"Raciocínio lógico, proposições e fundamentos matemáticos aplicados à computação.",
		coverUrl: "/image/capa-livro.png",
		category: "Computação",
		publisher: "CEUMA Press",
		year: 2022,
		pages: 318,
		isbn: "978-85-00000-09-7",
		subjects: "Lógica; Matemática discreta; Computação",
		secondaryAuthors: ["Ferreira, Samuel"],
		availableCopies: 6,
		totalCopies: 8,
		location: "Estante A4, prateleira 5",
	},
];

export function getBookById(id: string) {
	return books.find((book) => book.id === id);
}
