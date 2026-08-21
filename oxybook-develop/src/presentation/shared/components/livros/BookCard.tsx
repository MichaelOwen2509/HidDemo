"use client"

import { Trash2 } from "lucide-react"
import { Book } from "@/types/book"

interface BookCardProps {
  book: Book
  onRemove: (id: string) => void
}

export function BookCard({ book, onRemove }: BookCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200">

      <img
        src={book.coverUrl}
        alt={book.title}
        className="w-16 h-24 object-cover rounded-md shrink-0"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-[#4E0000CC]">{book.title}</h3>
        <p className="text-sm text-[#4E0000CC] mt-1">{book.description}</p>
        <p className="text-xs text-[#4E0000CC] mt-2">Autor: {book.author}</p>
      </div>

      <button
        onClick={() => onRemove(book.id)}
        className="text-[#4E0000] hover:text-red-500 transition-colors"
      >
        <Trash2 size={16} />
      </button>

    </div>
  )
}