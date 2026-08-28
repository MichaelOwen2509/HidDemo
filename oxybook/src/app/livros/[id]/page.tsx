import { Heart, Share2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type React from "react";
import { books, getBookById } from "@/data/books";

type BookDetailsPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export function generateStaticParams() {
	return books.map((book) => ({
		id: book.id,
	}));
}

export async function generateMetadata({ params }: BookDetailsPageProps) {
	const { id } = await params;
	const book = getBookById(id);

	if (!book) {
		return {
			title: "Livro não encontrado",
		};
	}

	return {
		title: `${book.title} | OxyBooks`,
		description: book.description,
	};
}

export default async function BookDetailsPage({
	params,
}: BookDetailsPageProps) {
	const { id } = await params;
	const book = getBookById(id);

	if (!book) {
		notFound();
	}

	const publication = `Ijuí: ${book.publisher}, ${book.year}.`;

	return (
		<div className="min-h-screen bg-[#F8F6F3] text-[#4E0000CC]">
			<header className="mx-auto flex h-28 w-full max-w-[1468px] items-center justify-between px-6 md:px-16">
				<Link href="/" aria-label="Ir para o início">
					<Image
						src="/svg/logo-ceuma.svg"
						alt="Ceuma Universidade"
						width={203}
						height={44}
						priority
						className="h-11 w-auto"
					/>
				</Link>

				<div className="flex items-center gap-[18px]">
					<HeaderButton label="Carrinho">
						<ShoppingCart size={19} aria-hidden="true" />
					</HeaderButton>
					<HeaderButton label="Favoritos">
						<Heart size={21} aria-hidden="true" />
					</HeaderButton>
					<button
						type="button"
						className="flex h-[38px] w-[41px] items-center justify-center rounded-lg border border-[#6746354D] bg-white text-base font-medium text-[#4E0000]"
						aria-label="Perfil de Osvaldo Sousa"
					>
						OS
					</button>
				</div>
			</header>

			<main className="relative mx-auto min-h-[912px] w-full max-w-[1468px] px-6 pb-0 md:px-16">
				<section className="grid gap-10 pt-[60px] lg:grid-cols-[539px_1fr] lg:gap-[60px]">
					<div className="flex justify-center lg:justify-start lg:pl-[120px]">
						<div className="relative aspect-[359/556] w-full max-w-[359px] overflow-hidden rounded-sm ">
							<Image
								src={book.coverUrl}
								alt={book.title}
								fill
								sizes="359px"
								priority
								className="object-cover"
							/>
						</div>
					</div>

					<div className="z-10 flex w-full max-w-[538px] flex-col gap-5 lg:min-h-139 lg:pt-0">
						<h1 className="text-[44px] font-medium leading-none text-[#4E0000CC] md:text-[60px]">
							{book.title}
						</h1>

						<div className="flex items-center gap-2">
							<span className="text-xl font-medium leading-[22px] text-[#4E0000CC]">
								Autor:
							</span>
							<span className="text-base text-[#674635CC]">{book.author}</span>
						</div>

						<p className="text-base leading-relaxed text-[#67463599]">
							{book.description}
						</p>

						<span className="inline-flex w-fit items-center gap-2 rounded-[30px] border border-[#B9F8CF] bg-[#DCFCE7] px-2.5 py-1 text-xs font-medium leading-4 text-[#008236]">
							<span className="flex size-5 items-center justify-center rounded-full text-[#00A63E]">
								<svg
									viewBox="0 0 20 20"
									fill="none"
									className="size-5"
									aria-hidden="true"
								>
									<path
										d="M7.8 13.2 4.9 10.3 3.7 11.5l4.1 4.1 8.5-8.5-1.2-1.2-7.3 7.3Z"
										fill="currentColor"
									/>
								</svg>
							</span>
							Disponível
						</span>
					</div>
				</section>

				<section className="mt-[-242px] min-h-[538px] rounded-t-xl border border-b-0 border-[#6746354D] bg-white px-6 pt-[60px] md:px-14 lg:px-[56px]">
					<div className="mt-[38px] grid gap-12 lg:grid-cols-[359px_579px] lg:gap-[162px]">
						{book.secondaryAuthors.length > 0 && (
							<div className="flex flex-col gap-4 lg:pt-[122px]">
								<InfoTitle>Entradas Secundárias/Autor:</InfoTitle>
								<div className="flex flex-col gap-1 text-base text-[#67463599]">
									{book.secondaryAuthors.map((author) => (
										<p key={author}>
											<span className="underline">{author}</span>
											<span className="text-[#674635CC] ml-2">coautor</span>
										</p>
									))}
								</div>
							</div>
						)}

						<div className="flex flex-col gap-[30px]">
							<div className="flex max-w-[579px] items-center justify-between gap-6">
								<Link
									href={`/emprestimo-livro/${book.id}`}
									className="inline-flex h-[46px] w-[200px] items-center justify-center rounded-lg bg-[#4E0000] px-5 text-base font-medium text-white"
								>
									Adicionar ao carrinho
								</Link>

								<div className="flex items-center gap-[18px]">
									<HeaderButton label="Adicionar aos favoritos">
										<Heart size={21} aria-hidden="true" />
									</HeaderButton>
									<HeaderButton label="Compartilhar">
										<Share2 size={20} aria-hidden="true" />
									</HeaderButton>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<InfoTitle>Título Principal:</InfoTitle>
								<p className="text-base leading-relaxed text-[#67463599]">
									{book.mainTitle}
								</p>
							</div>

							<dl className="flex flex-col gap-[30px]">
								<InlineInfo label="Edição:" value={book.edition} />
								<InlineInfo label="Publicação:" value={publication} />
								<InlineInfo label="Assuntos:" value={book.subjects} />
								<InlineInfo label="ISBN:" value={book.isbn} />
							</dl>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}

function HeaderButton({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			className="flex h-[38px] w-[41px] items-center justify-center rounded-lg border border-[#6746354D] bg-white text-[#4E0000]"
			aria-label={label}
		>
			{children}
		</button>
	);
}

function InfoTitle({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="text-xl font-medium leading-[22px] text-[#4E0000CC]">
			{children}
		</h2>
	);
}

function InlineInfo({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center gap-2">
			<dt className="text-xl font-medium leading-[22px] text-[#4E0000CC]">
				{label}
			</dt>
			<dd className="text-base text-[#67463599]">{value}</dd>
		</div>
	);
}
