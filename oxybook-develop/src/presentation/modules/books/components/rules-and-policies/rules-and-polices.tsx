import { Ban, Clock, DollarSign, Lock, TriangleAlert } from "lucide-react";
import { RuleItem } from "./rule-item";

export function RulesAndPolices() {
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
          <span className="font-semibold text-[#4E0000]">Dica OxyBooks:</span> Devolva no prazo e ajude a manter nosso acervo disponível para todos!
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
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
          <span className="font-semibold">Aviso de responsabilidade:</span> Ao confirmar, você se compromete a cuidar dos livros e devolvê-los no prazo estabelecido.
        </p>
      </div>

      <button
        type="button"
        className="w-full rounded-xl bg-[#4E0000] text-white font-semibold py-4 text-base hover:bg-[#3a0000] transition-colors"
      >
        Finalizar
      </button>
    </div>
  );
}
