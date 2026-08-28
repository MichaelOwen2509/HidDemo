import { SearchPage } from "@/presentation/modules/books/components/search/search-page";
import { Footer } from "@/presentation/shared/components/layout/footer/footer";
import Header from "@/presentation/shared/components/header/header";

interface BuscaPageProps {
	searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function BuscaPage({ searchParams }: BuscaPageProps) {
	const { q, categoria } = await searchParams;

	return (
		<div className="flex min-h-screen flex-col bg-[#F8F6F3]">
			<Header />

			<main className="mx-auto w-full max-w-6xl flex-1 px-6 pt-8 pb-15">
				<SearchPage query={q} category={categoria} />
			</main>

			<Footer />
		</div>
	);
}
