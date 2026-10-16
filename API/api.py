from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import os
import subprocess
import asyncio
from evdev import InputDevice, categorize, ecodes, list_devices
from leitor_codigo_barras import router as router_codigo_barras

app = FastAPI()

TECLAS = {
    **{getattr(ecodes, f"KEY_{n}"): str(n) for n in range(10)},
    **{getattr(ecodes, f"KEY_{c}"): c.lower() for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"},
}



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router_codigo_barras)

DIRETORIO_ATUAL = os.path.dirname(os.path.abspath(__file__))
CAMINHO_RF_TOOL = os.path.join(
    DIRETORIO_ATUAL, "..", "Hardware", "src", "rf_tool"
)

clientes_conectados = set()


# ==========================================
# 1. WEBSOCKET E ESCUTA CONTÍNUA DO HARDWARE
# ==========================================

async def escutar_hardware_continuamente():
    try:
        processo = await asyncio.create_subprocess_exec(
            CAMINHO_RF_TOOL,
            "--escutar",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )

        while True:
            linha = await processo.stdout.readline()
            if not linha:
                break

            texto_saida = linha.decode("utf-8", errors="replace").strip()
            inicio_json = texto_saida.find("{")

            if inicio_json == -1:
                continue

            texto_limpo = texto_saida[inicio_json:]
            print(f"[Leitura Instantânea] {texto_limpo}")

            desconectados = set()
            for cliente in list(clientes_conectados):
                try:
                    await cliente.send_text(texto_limpo)
                except Exception:
                    desconectados.add(cliente)

            clientes_conectados.difference_update(desconectados)

    except Exception as erro:
        print(f"[ERRO] Falha ao escutar o hardware continuamente: {erro}")


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(escutar_hardware_continuamente())


@app.websocket("/ws/totem")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clientes_conectados.add(websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        pass
    finally:
        clientes_conectados.discard(websocket)


# ==========================================
# 2. ROTAS DE REQUISIÇÃO MANUAL DO TOTEM
# ==========================================

@app.get("/api/totem/ler")
def ler_livro_totem():
    try:
        resultado = subprocess.run(
            [CAMINHO_RF_TOOL, "--ler"],
            capture_output=True,
            text=True,
            check=False,
        )

        texto_saida = resultado.stdout.strip()
        inicio_json = texto_saida.find("{")

        if inicio_json == -1:
            return {
                "status": "erro",
                "mensagem": "Leitor ocupado ou sem leitura.",
            }

        return json.loads(texto_saida[inicio_json:])

    except json.JSONDecodeError:
        return {
            "status": "erro",
            "mensagem": "O hardware retornou um JSON inválido.",
        }
    except Exception as erro:
        return {
            "status": "erro",
            "mensagem": f"Erro interno do servidor: {erro}",
        }


@app.post("/api/totem/gravar/{novo_epc}")
@app.get("/api/totem/gravar/{novo_epc}")
def gravar_livro_totem(novo_epc: str):
    try:
        resultado = subprocess.run(
            [CAMINHO_RF_TOOL, "--gravar", novo_epc],
            capture_output=True,
            text=True,
            check=False,
        )

        texto_saida = resultado.stdout.strip()
        inicio_json = texto_saida.find("{")

        if inicio_json == -1:
            raise HTTPException(
                status_code=500,
                detail="Hardware não retornou um JSON válido.",
            )

        dados = json.loads(texto_saida[inicio_json:])

        if dados.get("status") == "erro":
            raise HTTPException(
                status_code=400,
                detail=dados.get("mensagem", "Erro ao gravar EPC."),
            )

        return dados

    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Hardware retornou um JSON inválido.",
        )
    except Exception as erro:
        raise HTTPException(
            status_code=500,
            detail=f"Erro interno: {erro}",
        )



# =============================================
# 3. ROTA DE LEITURA CODIGO DE BARRAS DO TOTEM
# =============================================
# @app.get("/api/totem/ler_codigo_barras/")
# def ler_codigo_barras_totem():



# ==========================================
# 4. ROTA DE MONITORAMENTO DA CATRACA
# ==========================================

# @app.post("/porta_saida")
# async def receber_leitura_porta(request: Request):
#     corpo_cru = await request.body()

#     print("\n" + "=" * 40)
#     print(" DADOS BRUTOS RECEBIDOS DA ANTENA")
#     print("=" * 40)
#     print(f"Formato (Content-Type): {request.headers.get('content-type')}")
#     print(
#         "Corpo da Mensagem:\n"
#         + corpo_cru.decode("utf-8", errors="ignore")
#     )
#     print("=" * 40 + "\n")

#     try:
#         dados = await request.json()

#         if isinstance(dados, dict):
#             dados = [dados]

#         if isinstance(dados, list):
#             for leitura in dados:
#                 if not isinstance(leitura, dict):
#                     continue

#                 epc = leitura.get("reading_epc_hex")
#                 if epc:
#                     print(
#                         "[CATRACA] ALERTA: Livro IRREGULAR detectado "
#                         f"na porta! EPC: {epc}"
#                     )
#                 else:
#                     print(
#                         "[AVISO] JSON válido, mas a chave "
#                         "'reading_epc_hex' não foi encontrada."
#                     )

#         return {"status": "recebido"}

#     except Exception as erro:
#         print(f"[ERRO] Falha ao ler como JSON: {erro}")
#         return {
#             "status": "erro",
#             "msg": "Formato desconhecido recebido",
#         }