"use client";

import { useState, useEffect, useRef } from "react";
import { RulesAndPolices } from "@/presentation/modules/books/components/rules-and-policies/rules-and-polices";
import Header from "@/presentation/shared/components/header/header";
import { Footer } from "@/presentation/shared/components/layout/footer/footer";
import { SelectedBooksList } from "@/presentation/shared/components/livros/SelectedBooksList";
import { Book } from "@/types/book";

const mockBancoDeLivros: Record<string, string> = {
  "B1B100000000009876543210": "O Senhor dos Anéis",
  "B1B100000000000000000011": "Introdução ao Linux",
  "E280116020006094374909C1": "Fundamentos de Redes",
  "B1B100000000000000000000": "Dom Quixote",
  "ABC000000000000000000001": "Programação em C++"
};

export default function BookLoan() {
  const [livrosLidos, setLivrosLidos] = useState<Book[]>([]);
  const isScanning = useRef(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [livroAtualIndex, setLivroAtualIndex] = useState(0);
  const [gravando, setGravando] = useState(false);
  const [mensagemModal, setMensagemModal] = useState("");

  const removerLivro = (id: string) => {
    setLivrosLidos((prev) => prev.filter((book) => book.id !== id));
  };

  useEffect(() => {
    const verificarSensor = async () => {
      // Se o modal de gravação estiver aberto, pausa a leitura automática
      if (isScanning.current || isModalOpen) return;
      isScanning.current = true;

      try {
        const response = await fetch("http://localhost:5000/api/totem/ler");
        const data = await response.json();

        if (data.status === "sucesso" && data.epc) {
          const epcLido = data.epc;

          setLivrosLidos((listaAtual) => {
            if (listaAtual.find((b) => b.id === epcLido)) return listaAtual;

            const nomeDoLivro = mockBancoDeLivros[epcLido] || "Livro Desconhecido";

            const novoLivro: Book = {
              id: epcLido,
              title: nomeDoLivro,
              author: "Autor de Teste",
              description: `EPC: ${epcLido}`,
              coverUrl: "/image/capa-livro.png",
            };

            return [...listaAtual, novoLivro];
          });
        }
      } catch (error) {
        
      } finally {
        isScanning.current = false;
      }
    };

    const interval = setInterval(verificarSensor, 3000);
    return () => clearInterval(interval);
  }, [isModalOpen]); 

  // LÓGICA DE GRAVAÇÃO (MODAL)
  const iniciarFinalizacao = () => {
    if (livrosLidos.length === 0) {
      alert("Adicione pelo menos um livro à lista primeiro!");
      return;
    }
    setIsModalOpen(true);
    setLivroAtualIndex(0);
    setMensagemModal("");
  };

  const gravarLivroAtual = async () => {
    setGravando(true);
    setMensagemModal("Gravando... Não mova o livro!");

    const livro = livrosLidos[livroAtualIndex];
    
    // Troca 4 primeiros caracteres para "0000" liberar na catraca
    // "B1B100000000000000000000" -> "000000000000000000000000"
    const novoEpc = "0000" + livro.id.substring(4);

    try {
      const response = await fetch(`http://localhost:5000/api/totem/gravar/${novoEpc}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.status === "sucesso") {
        setMensagemModal("Sucesso! Livro liberado.");
        
        // Aguarda 1.5s e pula para o próximo livro ou finaliza
        setTimeout(() => {
          if (livroAtualIndex + 1 < livrosLidos.length) {
            setLivroAtualIndex((prev) => prev + 1);
            setMensagemModal("");
          } else {
            setMensagemModal("Todos os livros foram liberados! Pode passar pela catraca.");
            //Limpar lista após 3 segundos e fechar modal
            setTimeout(() => {
              setLivrosLidos([]);
              setIsModalOpen(false);
            }, 3000);
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
          <h1 className="text-4xl text-[#4E0000CC] mb-3">Finalizar empréstimos</h1>
          <p className="text-lg text-[#67463599]">Aproxime o livro do sensor para adicionar à lista</p>
        </div>

        <div className="flex gap-8 items-start">
          <section className="flex-[3] flex flex-col">
            <SelectedBooksList books={livrosLidos} onRemoveBook={removerLivro} />
            
            {/* BOTÃO DE FINALIZAR APARECE SE TIVER LIVROS */}
            {livrosLidos.length > 0 && (
              <button 
                onClick={iniciarFinalizacao}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full md:w-auto self-end"
              >
                Finalizar Empréstimo
              </button>
            )}
          </section>
          
          <aside className="w-80 shrink-0 flex flex-col gap-4">
            <RulesAndPolices />
          </aside>
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
            
            {livroAtualIndex < livrosLidos.length ? (
              <>
                <h2 className="text-2xl font-bold text-[#4E0000] mb-2">Liberação de Segurança</h2>
                <p className="text-gray-600 mb-6">
                  Passo {livroAtualIndex + 1} de {livrosLidos.length}
                </p>
                
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-500">Coloque este livro no leitor:</p>
                  <p className="text-xl font-semibold text-[#4E0000]">
                    {livrosLidos[livroAtualIndex].title}
                  </p>
                </div>

                <p className="text-blue-600 font-medium h-6 mb-6">{mensagemModal}</p>

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
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{mensagemModal}</h2>
                <p className="text-gray-500">Fechando automaticamente...</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}