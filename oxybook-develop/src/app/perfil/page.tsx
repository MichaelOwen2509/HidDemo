import { ProfileAside } from "@/presentation/modules/perfil/components/profile-aside";
import { UserProfileHeader } from "@/presentation/modules/perfil/components/user-profile-header";
import Header from "@/presentation/shared/components/header/header";
import { Footer } from "@/presentation/shared/components/layout/footer/footer";

export default function PerfilPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <UserProfileHeader
            name="Osvaldo Sousa Miranda"
            email="osousa.m19@gmail.com"
            memberSince="Janeiro 2024"
            totalLoans={42}
            returnedBooks={39}
            activeLoans={3}
          />
        </div>

        <div className="flex gap-8 items-start">
          <section className="flex-3">
          </section>

          <ProfileAside
            overdueCount={1}
            fines={[{ bookTitle: "Deep Work", daysOverdue: 3, amount: 6.0 }]}
            accountStatus="com_pendencia"
            bookLimit={5}
            available={2}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
