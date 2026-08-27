from fastapi import FastAPI, HTTPException, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DIRETORIO_ATUAL = os.path.dirname(os.path.abspath(__file__))
CAMINHO_RF_TOOL = os.path.join(DIRETORIO_ATUAL, "..", "Hardware", "src", "rf_tool")


# ==========================================
# 1. WEBSOCKET E ESCUTA CONTÍNUA (NOVO)
# ==========================================

clientes_conectados = set()

async def escutar_hardware_continuamente():
    # Usa o seu caminho dinâmico para abrir o executável no modo "--escutar"
    processo = await asyncio.create_subprocess_exec(
        CAMINHO_RF_TOOL, '--escutar',
        stdout=asyncio.subprocess.PIPE
    )
    
    while True:
        linha = await processo.stdout.readline()
        if not linha:
            break
            
        texto_saida = linha.decode('utf-8').strip()
        
        # Procura o começo do JSON para garantir que não vai mandar lixo pro React
        inicio_json = texto_saida.find('{')
        if inicio_json != -1:
            texto_limpo = texto_saida[inicio_json:]
            print(f"[Leitura Instantânea] {texto_limpo}")
            
            # Envia a leitura imediatamente para todos os totens (navegadores) conectados
            for cliente in list(clientes_conectados):
                try:
                    await cliente.send_text(texto_limpo)
                except Exception:
                    clientes_conectados.remove(cliente)

# Liga o vigia de hardware no exato momento em que o servidor Python ligar
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(escutar_hardware_continuamente())

# Rota onde o React vai se conectar via WebSocket
@app.websocket("/ws/totem")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clientes_conectados.add(websocket)
    try:
        while True:
            # Mantém a conexão viva aguardando mensagens (se houver)
            await websocket.receive_text()
    except WebSocketDisconnect:
        clientes_conectados.remove(websocket)


# ==========================================
# 2. ROTAS ORIGINAIS DE REQUISIÇÃO MANUAL
# ==========================================

@app.get("/api/totem/ler")
def ler_livro_totem():
    try:
        comando = [CAMINHO_RF_TOOL, "--ler"]
        resultado = subprocess.run(comando, capture_output=True, text=True)
        
        texto_saida = resultado.stdout.strip()
        inicio_json = texto_saida.find('{')
        
        if inicio_json != -1:
            texto_limpo = texto_saida[inicio_json:]
            dados = json.loads(texto_limpo)
            return dados
        else:
            return {"status": "erro", "mensagem": "Leitor ocupado ou sem leitura."}
            
    except Exception as e:
        return {"status": "erro", "mensagem": f"Erro interno do servidor: {str(e)}"}

@app.post("/api/totem/gravar/{novo_epc}")
@app.get("/api/totem/gravar/{novo_epc}") # Adicionei o GET para você testar no navegador!
def gravar_livro_totem(novo_epc: str):
    try:
        comando = [CAMINHO_RF_TOOL, "--gravar", novo_epc]
        resultado = subprocess.run(comando, capture_output=True, text=True)
        
        texto_saida = resultado.stdout.strip()
        
        inicio_json = texto_saida.find('{')
        
        if inicio_json != -1:
            texto_limpo = texto_saida[inicio_json:]
            dados = json.loads(texto_limpo)
            
            if dados.get("status") == "erro":
                raise HTTPException(status_code=400, detail=dados.get("mensagem"))
            return dados
        else:
            raise HTTPException(status_code=500, detail="Hardware não retornou um JSON válido.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


# ==========================================
# 3. ROTA MONITORAMENTO CATRACA
# ==========================================

@app.post("/porta_saida")
async def receber_leitura_porta(request: Request):
    # 1. Corpo da requisição antena enviou
    corpo_cru = await request.body()
    
    print("\n" + "="*40)
    print(" DADOS BRUTOS RECEBIDOS DA ANTENA")
    print("="*40)
    print(f"Formato (Content-Type): {request.headers.get('content-type')}")
    print(f"Corpo da Mensagem:\n{corpo_cru.decode('utf-8', errors='ignore')}")
    print("="*40 + "\n")

    # 2. Le JSON
    try:
        dados = await request.json()
        if dados:
            for leitura in dados:
                epc = leitura.get("reading_epc_hex")
                if epc:
                    print(f"[CATRACA] ALERTA: Livro IRREGULAR detectado na porta! EPC: {epc}")
                else:
                    print("[AVISO] O JSON é válido, mas a chave 'reading_epc_hex' não existe dentro dele.")
                
        return {"status": "recebido"}
    except Exception as e:
        print(f"[ERRO] Falha ao ler como JSON: {e}")
        return {"status": "erro", "msg": "Formato desconhecido recebido"}