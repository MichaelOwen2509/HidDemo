"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RulesAndPolices } from "@/presentation/modules/books/components/rules-and-policies/rules-and-polices";
import Header from "@/presentation/shared/components/header/header";
import { Footer } from "@/presentation/shared/components/layout/footer/footer";
import { SelectedBooksList } from "@/presentation/shared/components/livros/SelectedBooksList";
import { Book } from "@/types/book";

const mockBooksDatabase = [
	{
		epc: "B1B100000000008876543210",
		id: "1",
		title: "The Silver Crow",
		author: "Osvaldo Sousa",
		description:
			"Uma jornada envolvente sobre tecnologia, inovação e as escolhas que moldam o amanhã. Entre desafios, descobertas e grandes ideias, este livro mostra como o futuro começa com quem decide criar algo novo hoje.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "B1B1006020006094374909C1",
		id: "2",
		title: "Código Limpo",
		author: "Robert C. Martin",
		description:
			"Um guia para escrever código de qualidade, focado em boas práticas e princípios que tornam o software mais fácil de manter e evoluir ao longo do tempo.",
		coverUrl: "/image/capa-livro.png",
	},
	{
		epc: "B1B100000000000000003333",
		id: "3",
		title: "Cultura da convergência",
		author: "Henry Jenkins",
		description:
			"Dicas e filosofias para desenvolvedores que desejam aprimorar suas habilidades e se tornar profissionais mais completos e eficazes no mercado",
		coverUrl: "/image/capa-livro.png",
	},
];

export default function BookLoan() {
	const router = useRouter();

	const [livrosLidos, setLivrosLidos] = useState<Book[]>([]);
	const isScanning = useRef(false);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [livroAtualIndex, setLivroAtualIndex] = useState(0);
	const [gravando, setGravando] = useState(false);
	const [mensagemModal, setMensagemModal] = useState("");

	const [debugMsg, setDebugMsg] = useState("Procurando WebSocket...");

	const removerLivro = (id: string) => {
		setLivrosLidos((prev) => prev.filter((book) => book.id !== id));
	};

	useEffect(() => {
		const socket = new WebSocket("ws://192.168.82.16:5000/ws/totem");

		socket.onopen = () => {
			setDebugMsg("🟢 CONECTADO! WebSocket aberto.");
		};

		socket.onmessage = (evento) => {
			setDebugMsg(`📖 LEITURA: ${evento.data}`);
			const data = JSON.parse(evento.data);

			if (data.status === "sucesso" && data.epc) {
				const livroEncontrado = mockBooksDatabase.find(
					(b) => b.epc === data.epc,
				);

				setLivrosLidos((listaAnterior) => {
					const idParaVerificar = livroEncontrado
						? livroEncontrado.id
						: data.epc;
					const livroJaEstaNaLista = listaAnterior.some(
						(livro) => livro.id === idParaVerificar,
					);

					if (livroJaEstaNaLista) {
						return listaAnterior;
					}

					const novoLivro: Book = livroEncontrado
						? {
								id: livroEncontrado.id,
								title: livroEncontrado.title,
								author: livroEncontrado.author,
								description: livroEncontrado.description,
								coverUrl: livroEncontrado.coverUrl,
							}
						: {
								id: data.epc,
								title: "Livro Desconhecido",
								author: "Autor Desconhecido",
								coverUrl: "https://via.placeholder.com/150",
								description: `Tag ${data.epc} não cadastrada no sistema.`,
							};

					return [...listaAnterior, novoLivro];
				});
			}
		};

		socket.onerror = (erro) => {
			setDebugMsg(
				"🔴 ERRO: Conexão recusada. O Python está rodando no IP correto?",
			);
		};

		socket.onclose = () => {
			setDebugMsg("⚪ AVISO: Conexão WebSocket fechada.");
		};

		return () => {
			socket.close();
		};
	}, []);

	const iniciarFinalizacao = () => {
		setIsModalOpen(true);
		setLivroAtualIndex(0);
		setMensagemModal("");
	};

	const gravarLivroAtual = async () => {
		setGravando(true);
		setMensagemModal("Gravando... Não mova o livro!");

		const livro = livrosLidos[livroAtualIndex];

		let epcParaGravar = livro.id;
		const livroNoBanco = mockBooksDatabase.find((b) => b.id === livro.id);
		if (livroNoBanco) {
			epcParaGravar = livroNoBanco.epc;
		}

		const novoEpc = "0000" + epcParaGravar.substring(4);

		try {
			const response = await fetch(
				`http://192.168.82.16:5000/api/totem/gravar/${novoEpc}`,
				{
					method: "POST",
				},
			);
			const data = await response.json();

			if (data.status === "sucesso") {
				setMensagemModal("Sucesso! Livro liberado.");

				setTimeout(() => {
					if (livroAtualIndex + 1 < livrosLidos.length) {
						setLivroAtualIndex((prev) => prev + 1);
						setMensagemModal("");
					} else {
						// ÚLTIMO LIVRO GRAVADO COM SUCESSO - REDIRECIONA PARA A TELA FINAL
						setMensagemModal(
							"Todos os livros foram liberados! Redirecionando...",
						);
						setTimeout(() => {
							router.push("/emprestimo-confirmado");

							setLivrosLidos([]);
							setIsModalOpen(false);
						}, 1500);
					}
				}, 1500);
			} else {
				setMensagemModal("Erro ao gravar. Tente ajustar o livro no leitor.");
			}
		} catch (error) {
			setMensagemModal("Erro de conexão com o hardware.");
		}

		setGravando(false);
	};

	return (
		<div className="flex flex-col min-h-screen relative">
			<Header />

			<main className="flex-1 w-full max-w-6xl mx-auto px-6 py-8">
				<div className="mb-6">
					<h1 className="text-4xl text-[#4E0000CC] mb-3">
						Finalizar empréstimos
					</h1>
					<p className="text-lg text-[#67463599]">
						Revise seus livros e regras antes de confirmar
					</p>
				</div>

				<div className="flex gap-8 items-start">
					<section className="flex-[3] flex flex-col">
						<SelectedBooksList
							books={livrosLidos}
							onRemoveBook={removerLivro}
						/>
						{/* O BOTÃO VERDE FOI REMOVIDO DAQUI */}
					</section>

					<aside className="w-80 shrink-0 flex flex-col gap-4">
						{/* O COMPONENTE AGORA RECEBE A FUNÇÃO E O STATUS DA LISTA */}
						<RulesAndPolices
							onFinalizar={iniciarFinalizacao}
							hasBooks={livrosLidos.length > 0}
						/>
					</aside>
				</div>
			</main>

			<Footer />

			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
						{livroAtualIndex < livrosLidos.length ? (
							<>
								<h2 className="text-2xl font-bold text-[#4E0000] mb-2">
									Liberação de Segurança
								</h2>
								<p className="text-gray-600 mb-6">
									Passo {livroAtualIndex + 1} de {livrosLidos.length}
								</p>

								<div className="bg-gray-100 p-4 rounded-lg mb-6">
									<p className="text-sm text-gray-500">
										Coloque este livro no leitor:
									</p>
									<p className="text-xl font-semibold text-[#4E0000]">
										{livrosLidos[livroAtualIndex].title}
									</p>
								</div>

								<p className="text-blue-600 font-medium h-6 mb-6">
									{mensagemModal}
								</p>

								<div className="flex gap-4 justify-center">
									<button
										onClick={() => setIsModalOpen(false)}
										disabled={gravando}
										className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
									>
										Cancelar
									</button>
									<button
										onClick={gravarLivroAtual}
										disabled={gravando}
										className="px-6 py-2 bg-[#4E0000] hover:bg-[#3a0000] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
									>
										{gravando ? "Aguarde..." : "Gravar e Liberar"}
									</button>
								</div>
							</>
						) : (
							<>
								<div className="text-green-500 mb-4">
									<svg
										className="w-20 h-20 mx-auto"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										></path>
									</svg>
								</div>
								<h2 className="text-2xl font-bold text-gray-800 mb-2">
									{mensagemModal}
								</h2>
								<p className="text-gray-500">Aguarde...</p>
							</>
						)}
					</div>
				</div>
			)}

			<div className="fixed bottom-0 left-0 w-full bg-gray-900 text-green-400 p-2 text-xs font-mono z-[9999]">
				DEBUG: {debugMsg}
			</div>
		</div>
	);
}
