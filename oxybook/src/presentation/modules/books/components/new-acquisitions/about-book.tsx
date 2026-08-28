import Image from "next/image";
import Link from "next/link";

interface AboutBookProps {
	id: string;
	title: string;
	description: string;
	author: string;
	coverUrl: string;
	backgroundColor: string;
}

export function AboutBook({
	id,
	title,
	description,
	author,
	coverUrl,
	backgroundColor,
}: AboutBookProps) {
	return (
		<article
			className="relative flex h-[249px] w-full overflow-visible px-6 py-[18px] text-white"
			style={{ backgroundColor }}
		>
			<div className="relative mt-1 -mb-12 h-[283px] w-[182px] shrink-0 self-start">
				<Image
					src={coverUrl}
					alt={`Capa do livro ${title}`}
					fill
					sizes="182px"
					className="object-cover"
				/>
			</div>

			<div className="flex min-w-0 flex-1 flex-col justify-center pl-8">
				<h2 className="text-[1.45rem] font-medium leading-tight">{title}</h2>
				<p className="mt-5 max-w-[230px] text-[0.64rem] leading-relaxed text-white/80">
					{description}
				</p>
				<p className="mt-1 text-[0.64rem] leading-relaxed text-white/80">
					Autor: {author}
				</p>
				<Link
					href={`/livros/${id}`}
					className="flex items-center justify-center mt-5 h-8.5 w-full max-w-58 rounded-md bg-white px-4 text-sm font-medium text-[#4E0000] transition-colors hover:bg-white/90"
				>
					Veja o livro
				</Link>
			</div>
		</article>
	);
}
