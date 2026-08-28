"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { AboutBook } from "./about-book";

const newBooks = [
	{
		id: "1",
		title: "The Silver Crow",
		author: "Osvaldo Sousa",
		description:
			"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam uma mente criativa. Entre descobertas, coragem e afeto, um futuro começa quando decide agir agora mesmo.",
		coverUrl: "/image/capa.png",
		backgroundColor: "#640000",
	},
	{
		id: "2",
		title: "The Silver Crow",
		author: "Osvaldo Sousa",
		description:
			"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam uma mente criativa. Entre descobertas, coragem e afeto, um futuro começa quando decide agir agora mesmo.",
		coverUrl: "/image/capa.png",
		backgroundColor: "#102840",
	},
	{
		id: "3",
		title: "The Silver Crow",
		author: "Osvaldo Sousa",
		description:
			"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam uma mente criativa. Entre descobertas, coragem e afeto, um futuro começa quando decide agir agora mesmo.",
		coverUrl: "/image/capa.png",
		backgroundColor: "#1B120C",
	},
	{
		id: "4",
		title: "The Silver Crow",
		author: "Osvaldo Sousa",
		description:
			"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam uma mente criativa. Entre descobertas, coragem e afeto, um futuro começa quando decide agir agora mesmo.",
		coverUrl: "/image/capa.png",
		backgroundColor: "#640000",
	},
];

export function NewAcquisitions() {
	const carouselRef = useRef<HTMLDivElement>(null);

	const scrollCarousel = (direction: "previous" | "next") => {
		const carousel = carouselRef.current;
		const firstCard = carousel?.firstElementChild;

		if (!(carousel && firstCard instanceof HTMLElement)) {
			return;
		}

		const gap = 4;
		const scrollAmount = firstCard.offsetWidth + gap;
		const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;

		if (direction === "next" && carousel.scrollLeft >= maxScrollLeft - 1) {
			carousel.scrollTo({ left: 0, behavior: "smooth" });
			return;
		}

		if (direction === "previous" && carousel.scrollLeft <= 1) {
			carousel.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
			return;
		}

		carousel.scrollBy({
			left: direction === "next" ? scrollAmount : -scrollAmount,
			behavior: "smooth",
		});
	};

	return (
		<section className="mx-auto flex w-full max-w-6xl px-6 py-4">
			<div className="w-full">
				<div className="mb-8 flex items-center justify-between gap-4">
					<h1 className="text-3xl font-normal text-[#4E0000CC] md:text-4xl">
						Novas aquisições
					</h1>

					<div className="flex items-center gap-2.5">
						<button
							type="button"
							aria-label="Livro anterior"
							onClick={() => scrollCarousel("previous")}
							className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4E0000] shadow-sm transition-colors hover:bg-[#F7EFEA]"
						>
							<ChevronLeft size={18} />
						</button>
						<button
							type="button"
							aria-label="Próximo livro"
							onClick={() => scrollCarousel("next")}
							className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4E0000] shadow-sm transition-colors hover:bg-[#F7EFEA]"
						>
							<ChevronRight size={18} />
						</button>
					</div>
				</div>

				<div
					ref={carouselRef}
					className="flex snap-x snap-mandatory gap-1 overflow-x-auto pb-16 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					{newBooks.map((book) => (
						<div key={book.id} className="min-w-0 flex-[0_0_480px] snap-start">
							<AboutBook
								id={book.id}
								title={book.title}
								author={book.author}
								description={book.description}
								coverUrl={book.coverUrl}
								backgroundColor={book.backgroundColor}
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
