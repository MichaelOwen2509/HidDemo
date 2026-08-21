"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2f0eb] flex">
      <div className="flex flex-col px-10 py-8 lg:px-16 w-[420px] md:w-[750px] shrink-0">

        <header className="flex items-center gap-3">
          <img
            src="/image/icons/logo-ceuma.svg"
            alt="CEUMA Universidade"
            className="h-9 w-auto"
          />
          <span className="w-px h-6 bg-gray-300" aria-hidden="true" />

          <img
            src="/image/icons/logo-oxygeni.svg"
            alt="OXYGENI"
            className="h-6 w-auto"
          />
        </header>

        <main className="flex flex-col justify-center flex-1 gap-7">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-30 h-30 rounded-full bg-[#F0F5FF] shadow-sm flex items-center justify-center mt-[-40px]">
              <div className="w-20 h-20 rounded-full bg-[#FFFFFF] shadow-sm flex items-center justify-center border-3 border-solid border-[#F8FBFF]">
                <img src="image/icons/vector.svg" alt="vector" />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold text-[#1D140DCC] leading-tight tracking-tight">
                Realize o login com sua matrícula
              </h1>
              <p className="mt-1 text-sm text-[#1D140DCC] text-muted-foreground">
                Bem-vindo ao OxyBook, sua biblioteca digital.
              </p>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label
                htmlFor="cpf"
                className="text-sm text-[#1D140DCC] font-medium text-foreground">
                CPF
              </label>
              <input
                id="cpf"
                type="text"
                placeholder="Digite seu CPF"
                autoComplete="username"
                className="w-full h-11 border border-border bg-white px-3 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#8B1A2E]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm text-[#1D140DCC] font-medium text-foreground">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  className="w-full h-11 border border-border bg-white px-3 pr-10 rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#8B1A2E]"/>

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}></button>
              </div>
            </div>

            <button
              type="button"
              className="w-full h-11 mt-2 rounded-md font-semibold text-sm bg-[#4E0000] hover:bg-[#7a1728] text-white transition-colors duration-200 cursor-pointer">
              Fazer login
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Problemas com acesso? Fale com o{" "}
            <Link
              href="/suporte"
              className="font-semibold text-[#4E0000] underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Suporte de TI
            </Link>
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Em conformidade com a{" "}
            <Link
              href="/lgpd"
              className="font-semibold text-[#4E0000] underline underline-offset-2 hover:opacity-80 transition-opacity">
              LGPD
            </Link>
            , seus dados serão utilizados apenas para fins de gerenciamento da
            biblioteca e controle de empréstimos, com total sigilo.
          </p>
        </main>

        <footer>
          <p className="text-xs text-muted-foreground text-center">
            © 2026 OXYGENI
          </p>
        </footer>
      </div>

      <div className="hidden lg:block flex-2 p-5">
        <div className="relative h-full rounded-2xl bg-[#f2f0eb]">
            <img src="/image/student-photo.png" alt="Estudante sorrindo com livro" className=" mx-auto mt-2 object-cover object-top border-20 border-[#FFFFFF] rounded-4xl shadow-xl/20" />
            <div className="absolute bottom-12 inset-x-0 flex justify-center">
              <img
                src="/image/icons/logo-ceuma-branco.svg"
                alt="CEUMA Universidade"
                className="h-10 w-auto"
              />
            </div>
        </div>
      </div>
    </div>
  )
}
