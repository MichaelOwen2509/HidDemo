import Image from "next/image";

export function Footer() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 pb-8">
    <footer className="bg-[#4E0000] text-white rounded-2xl">
      <div className="px-8 py-10 flex md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-6 shrink-0">
          <div className="mb-12">
            <Image
              src="/icons/logo-ceuma.svg"
              alt="logo da universidade ceuma"
              width={204}
              height={48}
              className="absolute object-cover"
            />
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Social</p>
            <div className="flex gap-3 text-white/80">
              <a href="#" aria-label="Twitter/X">
                <Image src={'/icons/icon-x.svg'}
                  width={22}
                  height={22}
                  alt="logo do X"
                />
              </a>
              <a href="#" aria-label="Instagram">
                <Image src={'/icons/icon-insta.svg'}
                  width={22}
                  height={22}
                  alt="logo do Instagram"
                />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Image src={'/icons/icon-linkedin.svg'}
                  width={22}
                  height={22}
                  alt="logo do Linkedin"
                />
              </a>
              <a href="#" aria-label="WhatsApp">
                <Image src={'/icons/icon-wpp.svg'}
                  width={22}
                  height={22}
                  alt="logo do WhatsApp"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-bold mb-5">Navegação</h3>
            <nav className="flex flex-col gap-5 text-white/60">
              <a href="#">Inicio</a>
              <a href="#">Pesquisar livros</a>
              <a href="#">Meu empréstimos</a>
              <a href="#">Renovações</a>
              <a href="#">Histórico</a>
              <a href="#">Dúvidas frequentes</a>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-5">Serviços da Biblioteca</h3>
            <nav className="flex flex-col gap-5 text-white/60">
              <a href="#">Consulta ao acervo</a>
              <a href="#">Empréstimo de livros</a>
              <a href="#">Renovação online</a>
              <a href="#">Reserva de livros</a>
              <a href="#">Suporte ao usuário</a>
            </nav>
          </div>

          <div>
            <h3 className="font-bold mb-5">Biblioteca CEUMA</h3>
            <nav className="flex flex-col gap-5 text-white/60">
              <a href="#">Campus Renascença</a>
              <a href="#">Campus Cohama</a>
              <a href="#">Regulamento da biblioteca</a>
              <a href="#">Políticas de empréstimo</a>
              <a href="#">Acesso do aluno</a>
            </nav>
          </div>
        </div>
      </div>

      <hr className="mx-8 border-white/30" />

      <div className="px-8 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
        <p className="text-xs">
          Copyright © 2026 Biblioteca CEUMA. Todos os direitos reservados
        </p>
        <span className="mt-2 md:mt-0 bg-white rounded-lg text-[#4E0000] w-47 h-9 flex justify-center items-center text-xs gap-1">
          Voltar ao topo ↑
        </span>
      </div>
    </footer>
    </div>
  );
}
