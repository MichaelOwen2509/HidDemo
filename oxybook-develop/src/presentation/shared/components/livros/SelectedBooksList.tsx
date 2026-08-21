"use client"

import { BookCard } from "./BookCard"
import { Book } from "@/types/book"

interface SelectedBooksListProps {
  books: Book[];
  onRemoveBook: (id: string) => void;
}

export function SelectedBooksList({ books, onRemoveBook }: SelectedBooksListProps) {
  return (
    <div className="flex flex-col h-full">

      <h2 className="text-2xl font-medium text-[#4E0000CC] mb-5">Livros selecionados ({books.length})</h2>

      <div
        className={`
          flex flex-col gap-3 
          ${books.length > 5 ? "overflow-y-auto max-h-[520px] pr-1 " : ""}
        `}
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} onRemove={onRemoveBook} />
        ))}
      </div>

    </div>
  )
}