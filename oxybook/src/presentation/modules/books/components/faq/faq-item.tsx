"use client";

import { useState } from "react";

interface FaqItemProps {
	question: string;
	answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<article
			className="bg-white border border-[#6746354D] rounded-xl px-5 py-4 cursor-pointer hover:shadow-sm transition-shadow"
			aria-expanded={isOpen}
		>
			<header className="flex items-center justify-between gap-3">
				<h3 className="text-sm font-medium text-[#674635CC] font-inter font-regular">
					{question}
				</h3>

				<button
					type="button"
					onClick={() => setIsOpen((prev) => !prev)}
					aria-label={isOpen ? "Fechar resposta" : "Abrir resposta"}
					className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-xl leading-none"
				>
					{isOpen ? "×" : "+"}
				</button>
			</header>

			{isOpen && (
				<p className="mt-3 pt-3 border-t border-stone-100 text-sm text-[#4E000099] leading-relaxed">
					{answer}
				</p>
			)}
		</article>
	);
}
