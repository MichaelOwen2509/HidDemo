import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AvailableBookCardProps {
	id: string;
	title: string;
	description: string;
	author: string;
	coverUrl: string;
}

export function AvailableBookCard({
	id,
	title,
	description,
	author,
	coverUrl,
}: AvailableBookCardProps) {
	return (
		<article className="flex h-70 w-full gap-2 rounded-xl border border-[#D8C8BE] bg-white px-4 py-5">
			<div className="relative h-60 w-38.75 shrink-0">
				<Image
					src={coverUrl}
					alt={`Capa do livro ${title}`}
					fill
					sizes="155px"
					className="object-cover"
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col justify-center">
				<h3 className="text-lg font-semibold leading-tight text-[#4E0000CC]">
					{title}
				</h3>
				<p className="mt-4 line-clamp-6 text-[0.62rem] leading-relaxed text-[#8E5656]">
					{description}
				</p>
				<p className="mt-2 text-[0.68rem] leading-relaxed text-[#8E5656]/70">
					Autor: {author}
				</p>

				<Link
					href={`/livros/${id}`}
					className="mt-5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-[#D8C8BE] bg-white px-3 text-[0.72rem] font-medium text-[#4E0000] transition-colors hover:bg-[#F7EFEA]"
				>
					<span className="whitespace-nowrap leading-none font-medium text-[12px]">
						Veja o livro
					</span>
					<ArrowRight size={13} className="shrink-0" />
				</Link>
			</div>
		</article>
	);
}
