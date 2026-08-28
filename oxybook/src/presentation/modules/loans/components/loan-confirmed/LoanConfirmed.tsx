"use client";

import { ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/presentation/shared/components/header/header";

export function LoanConfirmed() {
	const router = useRouter();

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8 flex flex-col items-center justify-center gap-6">
				<Image
					src="/icons/icon-confirmed.svg"
					width={230}
					height={230}
					alt=""
				/>

				<div className="flex flex-col items-center text-center gap-5 max-w-[750px]">
					<h1 className="text-5xl font-semibold text-[#4E0000CC]">
						Empréstimo confirmado!
					</h1>
					<p className="text-2xl font-medium text-[#67463599]">
						Seus livros já estão reservados. Fique atento ao prazo de devolução
						para evitar multas.
					</p>
				</div>

				<div className="flex items-center gap-4 mt-2">
					<button
						type="button"
						onClick={() => router.push("/perfil")}
						className="flex items-center gap-2 rounded-xl bg-[#4E0000] text-white font-semibold py-4 px-8 text-base hover:bg-[#3a0000] transition-colors"
					>
						<ArrowLeft size={18} />
						Voltar para a biblioteca
					</button>

					<button
						type="button"
						className="flex items-center gap-2 rounded-xl border border-[#E8D5C4] bg-white text-[#4E0000] font-semibold py-4 px-8 text-base hover:bg-[#faf5f0] transition-colors"
					>
						<Upload size={18} />
						Baixar comprovante
					</button>
				</div>
			</main>
		</div>
	);
}
