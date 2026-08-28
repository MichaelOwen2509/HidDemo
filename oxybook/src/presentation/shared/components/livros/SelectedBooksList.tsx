"use client";

// 1. REMOVIDO: Removemos a importação do 'useState', pois este componente não vai mais
// guardar sua própria lista internamente. A lista agora vem 100% pronta da tela principal.
import { BookCard } from "./BookCard";
import { Book } from "@/types/book";

// 2. ALTERADO: Atualizamos a interface para receber exatamente o que a tela principal
// está tentando enviar. Trocamos 'initialBooks' por 'books' e adicionamos a função 'onRemoveBook'.
interface SelectedBooksListProps {
	books: Book[];
	onRemoveBook: (id: string) => void;
}

// 3. ALTERADO: O componente agora recebe as novas propriedades diretamente.
export function SelectedBooksList({
	books,
	onRemoveBook,
}: SelectedBooksListProps) {
	// 4. APAGADO: Removemos o "const [books, setBooks] = useState..." e a função "handleRemove".
	// Se a gente mantivesse um estado isolado aqui dentro, quando você clicasse na lixeira,
	// o livro sumiria visualmente, mas a tela principal ainda acharia que ele estava lá
	// e tentaria enviar para a catraca!

	return (
		<div className="flex flex-col h-full">
			<h2 className="text-2xl font-medium text-[#4E0000CC] mb-5">
				{/* O tamanho da lista agora é baseado na propriedade que vem do pai */}
				Livros selecionados ({books.length})
			</h2>

			<div
				className={`
          flex flex-col gap-3 
          ${books.length > 5 ? "overflow-y-auto max-h-[520px] pr-1 " : ""}
        `}
			>
				{/* 5. ALTERADO: Usamos o array 'books' que vem da tela principal */}
				{books.map((book) => (
					<BookCard
						key={book.id}
						book={book}
						// 6. ALTERADO: Repassamos a função de remover direto para o BookCard.
						// Quando a lixeira for clicada lá no BookCard, essa função dispara e vai
						// lá na tela BookLoan atualizar o estado oficial do sistema.
						onRemove={onRemoveBook}
					/>
				))}
			</div>
		</div>
	);
}
