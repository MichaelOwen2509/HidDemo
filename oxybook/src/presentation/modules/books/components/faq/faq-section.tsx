"use client";

import { FaqItem } from "./faq-item";
import { ChevronDown } from "lucide-react";

interface FaqItem {
	id: string;
	question: string;
	answer: string;
}

interface FaqSectionProps {
	items?: FaqItem[];
	campusOptions?: string[];
	onContactClick?: () => void;
}

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
	{
		id: "1",
		question: "Posso mudar meu plano depois?",
		answer:
			"Sim, pode mudar a qualquer momento nas configurações da sua conta.",
	},
	{
		id: "2",
		question: "Como funciona o empréstimo de livros?",
		answer: "Escolha o livro, selecione o campus e retire no prazo indicado.",
	},
	{
		id: "3",
		question: "Qual o prazo máximo de empréstimo?",
		answer:
			"O prazo padrão é de 14 dias, com possibilidade de renovação por mais 7 dias.",
	},
	{
		id: "4",
		question: "Como renovo minha matrícula?",
		answer:
			"Acesse o portal do aluno, vá em Serviços e clique em Renovação de Matrícula.",
	},
	{
		id: "5",
		question: "Posso devolver em outro campus?",
		answer:
			"Sim, a devolução pode ser feita em qualquer unidade da instituição.",
	},
	{
		id: "6",
		question: "O que acontece se eu atrasar?",
		answer:
			"Atrasos geram multas por dia. Regularize antes de realizar novos empréstimos.",
	},
];

export function FaqSection({
	items = DEFAULT_FAQ_ITEMS,
	campusOptions = [],
	onContactClick,
}: FaqSectionProps) {
	return (
		<section aria-labelledby="faq-title" className="w-full bg-stone-100 py-8">
			<div className="max-w-6xl mx-auto px-6">
				<header className="flex flex-wrap items-start justify-between gap-4 mb-8">
					<div>
						<h2
							id="faq-title"
							className="text-2xl font-manrope font-medium text-[#4E0000CC] leading-tight"
						>
							Tá com dúvida?
						</h2>
						<p className="text-2xl font-manrope font-regular text-[#67463599]">
							A gente responde!
						</p>
					</div>

					<div className="flex items-center gap-3">
						<select
							aria-label="Selecione um campus"
							className="px-3 py-2 text-sm font-manrope font-medium border border-[#6746354D] rounded-lg text-[#6746354D] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4E0000]"
						>
							<option value="">Selecione um campus</option>
							{campusOptions.map((campus) => (
								<option key={campus} value={campus}>
									{campus}
								</option>
							))}
						</select>

						<button
							type="button"
							onClick={onContactClick}
							className="px-4 py-[9px] text-sm font-medium font-manrope text-white bg-[#4E0000] rounded-lg hover:bg-red-900 transition-colors focus:outline-none"
						>
							Entrar em contato
						</button>
					</div>
				</header>

				<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none">
					{items.map((item) => (
						<li key={item.id}>
							<FaqItem question={item.question} answer={item.answer} />
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
