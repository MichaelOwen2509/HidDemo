import { SectionHero } from "@/presentation/modules/books/components/book-hero";
import { NewAcquisitions } from "@/presentation/modules/books/components/new-acquisitions/new-acquisitions";
import { BooksAvailable } from "@/presentation/modules/books/components/books-available/books-available";
import Header from "@/presentation/shared/components/header/header";
import { Footer } from "@/presentation/shared/components/layout/footer/footer";
import { Tips } from "@/presentation/modules/books/components/tips";
import { FaqSection } from "@/presentation/modules/books/components/faq";
export default function Home() {
	return (
		<div className="min-h-screen bg-[#F8F6F3]">
			<Header />
			<SectionHero />
			<NewAcquisitions />
			<BooksAvailable />
			<Tips />
			<FaqSection />
			<Footer />
		</div>
	);
}
