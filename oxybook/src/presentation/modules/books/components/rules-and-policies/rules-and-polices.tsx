"use client";

import { Ban, Clock, DollarSign, Lock, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { RuleItem } from "./rule-item";

// Definimos que este componente agora recebe a função de finalizar e se tem livros
interface RulesAndPolicesProps {
	onFinalizar: () => void;
	hasBooks: boolean;
}

export function RulesAndPolices({
	onFinalizar,
	hasBooks,
}: RulesAndPolicesProps) {
	const [aceito, setAceito] = useState(false);

	const handleFinalizar = () => {
		if (!hasBooks) {
			alert("Aproxime pelo menos um livro no leitor primeiro!");
			return;
		}
		if (!aceito) {
			alert(
				"Você precisa concordar com as regras de empréstimo antes de finalizar.",
			);
			return;
		}
		// Se tem livro e aceitou as regras, chama a lógica do modal lá na tela principal
		onFinalizar();
	};

	return (
		<div className="flex flex-col gap-4 relative">
			<div className="rounded-xl border border-[#E8D5C4] bg-white p-5 flex flex-col gap-5">
				<span className="flex items-center justify-center w-10 h-10 rounded-b-lg bg-[#4E0000] text-white absolute top-0">
					<Lock size={18} />
				</span>

				<h2 className="text-lg font-semibold text-[#4E0000] mt-8">
					Regras e Políticas da Biblioteca
				</h2>

				<ul className="flex flex-col gap-4">
					<RuleItem
						icon={<DollarSign size={18} />}
						title="Multa por atraso"
						description="R$ 2,00 por dia de atraso em cada livro"
					/>
					<RuleItem
						icon={<Clock size={18} />}
						title="Prazo máximo"
						description="O empréstimo pode ser renovado por mais 7 dias, se não houver reserva"
					/>
					<RuleItem
						icon={<Ban size={18} />}
						title="Bloqueio de conta"
						description="Atrasos recorrentes podem resultar em bloqueio temporário"
					/>
				</ul>

				<p className="text-sm text-[#4E0000]/60">
					<span className="font-semibold text-[#4E0000]">Dica OxyBooks:</span>{" "}
					Devolva no prazo e ajude a manter nosso acervo disponível para todos!
				</p>
			</div>

			<label className="flex items-center gap-3 cursor-pointer">
				<input
					type="checkbox"
					checked={aceito}
					onChange={(e) => setAceito(e.target.checked)}
					className="mt-0.5 w-4 h-4 shrink-0 accent-[#4E0000]"
				/>
				<span className="text-sm text-[#4E0000CC]">
					Li e concordo com as regras de empréstimo e políticas do{" "}
					<span className="font-semibold text-[#4E0000]">OxyBooks</span>
				</span>
			</label>

			<div className="flex items-center gap-3 rounded-lg bg-[#F59E0B1F] p-4">
				<TriangleAlert size={33} className="text-[#F59E0B] shrink-0 mt-0.5" />
				<p className="text-sm text-[#F59E0B]">
					<span className="font-semibold">Aviso de responsabilidade:</span> Ao
					confirmar, você se compromete a cuidar dos livros e devolvê-los no
					prazo estabelecido.
				</p>
			</div>

			<button
				type="button"
				onClick={handleFinalizar}
				// O botão fica visualmente desabilitado (cinza) se não tiver livros ou se não aceitar as regras
				className={`w-full rounded-xl text-white font-semibold py-4 text-base transition-colors ${
					hasBooks && aceito
						? "bg-[#4E0000] hover:bg-[#3a0000]"
						: "bg-gray-400 cursor-not-allowed"
				}`}
			>
				Finalizar
			</button>
		</div>
	);
}
