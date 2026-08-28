import Image from "next/image";
import { TipCard } from "./tip-card";

const tips = [
	{
		id: 1,
		title: "Use palavras-chave diretas",
		description: "Evite artigos, pronomes e palavras desnecessárias na busca.",
	},
	{
		id: 2,
		title: "Verifique a escrita",
		description:
			"Confira se os termos foram digitados corretamente para garantir melhores resultados.",
	},
	{
		id: 3,
		title: "Tente novas combinações",
		description: "Busque por autor, título, sinônimos ou termos relacionados.",
	},
];

export function Tips() {
	return (
		<section
			aria-labelledby="search-tips-heading"
			className="max-w-6xl mx-auto px-6 flex flex-col gap-6 rounded-2xl p-6 md:flex-row md:items-center md:items-stretch"
		>
			<div className="relative min-h-[280px] flex-1 rounded-xl bg-[#4E0000] p-8 text-white overflow-visible">
				<div className="absolute right-0 bottom-0 -top-8 w-[45%]">
					<Image
						src="/image/student-ceuma.png"
						alt="Estudante Ceuma"
						fill
						className="object-cover object-[85%_5%]"
						priority
					/>
				</div>

				<div className="relative z-10 max-w-[55%]">
					<h2
						id="search-tips-heading"
						className="text-3xl font-manrope leading-tight tracking-tight"
					>
						Dicas <br /> para pesquisar
					</h2>
					<p className="mt-3 text-sm leading-relaxed text-[#F8F6F3CC] font-manrope">
						Faça nosso teste gratuito e descubra quais carreiras combinam com
						você.
					</p>
					<a
						href="#"
						className="mt-7 inline-block rounded-lg bg-white px-5 py-2 font-manrope text-center font-medium text-[#6B1212] transition-colors hover:bg-red-50 w-40 focus:outline-none "
					>
						Explore mais!
					</a>
				</div>
			</div>

			<ul className="flex flex-1 flex-col gap-3 justify-center" role="list">
				{tips.map((tip) => (
					<li key={tip.id}>
						<TipCard tip={tip} />
					</li>
				))}
			</ul>
		</section>
	);
}
