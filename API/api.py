from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import json
import os

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

# ROTAS
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
def gravar_livro_totem(novo_epc: str):
    try:
        #comando = ["box64", CAMINHO_RF_TOOL, "--gravar", novo_epc]
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

# ROTA MONITORAMENTO CATRACA
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