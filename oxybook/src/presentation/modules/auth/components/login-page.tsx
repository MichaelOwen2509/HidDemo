"use client";

import { authenticateMockUser } from "@/business/domains/auth/mock-user";
import {
	loginSchema,
	type LoginFormData,
} from "@/business/domains/auth/schemas";
import { formatCpf } from "@/presentation/shared/format-cpf";
import { cn } from "@/presentation/shared/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function LoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const { onChange: onCpfChange, ...cpfField } = register("cpf");

	function handleCpfChange(event: React.ChangeEvent<HTMLInputElement>) {
		event.target.value = formatCpf(event.target.value);
		onCpfChange(event);
	}

	function onSubmit(data: LoginFormData) {
		if (authenticateMockUser(data.cpf, data.password)) {
			router.push("/emprestimo-livro");
			return;
		}

		setError("cpf", { message: "CPF ou senha inválidos" });
		setError("password", { message: "CPF ou senha inválidos" });
	}

	return (
		/*
		 * min-h-screen: a página nunca é menor que a viewport,
		 * mas pode crescer além dela se o conteúdo precisar — sem clips.
		 */
		<div className="min-h-screen bg-[#f2f0eb] flex flex-col">
			{/* ── Header — py-8 = 32 px, alinhado ao grid max-w-6xl do site ── */}
			<header className="shrink-0 py-8">
				<div className="max-w-6xl mx-auto px-6 flex items-center gap-3">
					<Image
						src="/image/icons/logo-ceuma.svg"
						alt="CEUMA Universidade"
						width={0}
						height={0}
						sizes="100vw"
						className="h-9 w-auto"
					/>
					<span className="w-px h-6 bg-gray-300" aria-hidden="true" />
					<Image
						src="/image/icons/logo-oxygeni.svg"
						alt="OXYGENI"
						width={0}
						height={0}
						sizes="100vw"
						className="h-6 w-auto"
					/>
				</div>
			</header>

			{/*
			 * ── Main ─────────────────────────────────────────────────────────
			 * flex-1:        cresce para preencher o espaço restante da tela.
			 * items-center:  centraliza o conteúdo verticalmente no espaço livre.
			 * py-8:          garante respiro vertical quando há espaço; e serve
			 *                como padding mínimo quando o conteúdo está próximo
			 *                do header/footer em telas curtas.
			 */}
			<main className="flex flex-1 items-center justify-center py-8">
				<div className="max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16">
					{/*
					 * Formulário
					 * Mobile/tablet : centralizado, max-w-sm (384 px)
					 * Desktop (lg)  : 620 px fixo, alinhado à esquerda
					 */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						noValidate
						className="flex flex-col gap-6 w-full max-w-sm mx-auto lg:max-w-none lg:w-155 lg:mx-0 shrink-0"
					>
						{/* Ícone — outer 120 px · inner 80 px · icon 40 px */}
						<div className="flex flex-col items-center gap-4 text-center">
							<div className="w-30 h-30 rounded-full bg-[#F0F5FF] shadow-sm flex items-center justify-center">
								<div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center border-[3px] border-[#F8FBFF]">
									<Image
										src="/image/icons/vector.svg"
										alt=""
										width={40}
										height={40}
									/>
								</div>
							</div>

							<div>
								<h1 className="text-2xl font-semibold text-[#1D140DCC] leading-tight tracking-tight">
									Realize o login com seu CPF
								</h1>
								<p className="mt-1 text-sm text-muted-foreground">
									Bem-vindo ao OxyBook, sua biblioteca digital.
								</p>
							</div>
						</div>

						{/* Campos — h-11 = 44 px · px-3 = 12 px */}
						<div className="space-y-4">
							<div className="space-y-1.5">
								<label
									htmlFor="cpf"
									className="text-sm text-[#1D140DCC] font-medium"
								>
									CPF
								</label>
								<input
									id="cpf"
									type="text"
									placeholder="Digite seu CPF"
									autoComplete="username"
									inputMode="numeric"
									maxLength={14}
									{...cpfField}
									onChange={handleCpfChange}
									className={cn(
										"w-full h-11 border border-border bg-white px-3 rounded-md text-sm",
										"placeholder:text-muted-foreground",
										"focus:outline-none focus:ring-1 focus:ring-[#8B1A2E]",
										errors.cpf && "border-red-500 focus:ring-red-500",
									)}
								/>
								{errors.cpf && (
									<p className="text-xs text-red-500">{errors.cpf.message}</p>
								)}
							</div>

							<div className="space-y-1.5">
								<label
									htmlFor="password"
									className="text-sm text-[#1D140DCC] font-medium"
								>
									Senha
								</label>
								<div className="relative">
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										placeholder="Digite sua senha"
										autoComplete="current-password"
										{...register("password")}
										className={cn(
											"w-full h-11 border border-border bg-white px-3 pr-10 rounded-md text-sm",
											"placeholder:text-muted-foreground",
											"focus:outline-none focus:ring-1 focus:ring-[#8B1A2E]",
											errors.password && "border-red-500 focus:ring-red-500",
										)}
									/>
									<button
										type="button"
										onClick={() => setShowPassword((v) => !v)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
										aria-label={
											showPassword ? "Ocultar senha" : "Mostrar senha"
										}
									>
										{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
									</button>
								</div>
								{errors.password && (
									<p className="text-xs text-red-500">
										{errors.password.message}
									</p>
								)}
							</div>

							{/* Botão — h-11 = 44 px · bg #4E0000 */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full h-11 mt-2 rounded-md font-semibold text-sm bg-[#4E0000] hover:bg-[#7a1728] text-white transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
							>
								{isSubmitting ? "Entrando..." : "Fazer login"}
							</button>
						</div>

						{/* Links */}
						<div className="space-y-4">
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
									className="font-semibold text-[#4E0000] underline underline-offset-2 hover:opacity-80 transition-opacity"
								>
									LGPD
								</Link>
								, seus dados serão utilizados apenas para fins de gerenciamento
								da biblioteca e controle de empréstimos, com total sigilo.
							</p>
						</div>
					</form>

					{/*
					 * Imagem lateral — oculta abaixo de lg
					 *
					 * A altura usa clamp() para ser responsiva à viewport:
					 *   mínimo  400 px  → sempre visível em telas curtas
					 *   ideal   75 vh   → proporcional à tela disponível
					 *   máximo  896 px  → limite do design (max-h-224)
					 *
					 * Assim, a imagem NUNCA força overflow — ela encolhe
					 * junto com a viewport em vez de transbordar.
					 */}
					<div className="hidden lg:flex flex-1 justify-center items-center">
						<div className="relative overflow-hidden bg-[#e8e4dd] w-full max-w-169.5 aspect-3/4 rounded-3xl">
							{/* Foto — inset 20 px · border-radius 12 px */}
							<div className="absolute inset-5 overflow-hidden rounded-xl">
								<Image
									src="/image/student-photo.png"
									alt="Estudante sorrindo com livro"
									fill
									className="object-cover object-top"
									sizes="(min-width: 1024px) 50vw, 0px"
								/>
							</div>

							{/* Logo branca — h-10 = 40 px · bottom-12 = 48 px */}
							<div className="absolute bottom-12 inset-x-0 flex justify-center">
								<Image
									src="/image/icons/logo-ceuma-branco.svg"
									alt="CEUMA Universidade"
									width={0}
									height={0}
									sizes="100vw"
									className="h-10 w-auto"
								/>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* ── Footer — py-8 = 32 px ── */}
			<footer className="shrink-0 py-8">
				<div className="max-w-6xl mx-auto px-6">
					<p className="text-xs text-muted-foreground text-center">
						© 2026 OXYGENI
					</p>
				</div>
			</footer>
		</div>
	);
}
