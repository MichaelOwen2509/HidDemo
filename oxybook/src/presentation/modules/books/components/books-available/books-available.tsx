import { AvailableBookCard } from "./available-book-card";
import { SearchBar } from "./search-bar";

const availableBooks = Array.from({ length: 9 }, (_, index) => ({
	id: String(index + 1),
	title: "The Silver Crow",
	author: "Osvaldo Sousa",
	description:
		"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam o amanhã. Entre desafios, descobertas e grandes ideias, este livro mostra como o futuro começa com quem decide criar algo novo hoje.",
	coverUrl: "/image/capa-livro.png",
}));

export function BooksAvailable() {
	return (
		<section className="max-w-6xl mx-auto px-6 py-4">
			<div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
				<h1 className="text-4xl font-normal text-[#4E0000CC]">
					Livros Disponíveis
				</h1>

				<SearchBar />
			</div>

			<div className="grid justify-items-center gap-6 md:grid-cols-2 xl:grid-cols-3">
				{availableBooks.map((book) => (
					<AvailableBookCard
						key={book.id}
						id={book.id}
						title={book.title}
						author={book.author}
						description={book.description}
						coverUrl={book.coverUrl}
					/>
				))}
			</div>
		</section>
	);
}
