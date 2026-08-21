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

# ROTAS TOTEM

@app.get("/api/totem/ler")
def ler_livro_totem():
    try:
        comando = [CAMINHO_RF_TOOL, "--ler"]
        resultado = subprocess.run(comando, capture_output=True, text=True)
        
        texto_saida = resultado.stdout.strip()
        
        # Pulo do Gato: Procura onde o JSON começa de verdade
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

@app.post("/api/totem/gravar/{novo_epc}")
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

# ROTA MONITORAMENTO CATRACA
@app.post("/porta_saida")
async def receber_leitura_porta(request: Request):
    try:
        dados = await request.json()
        if dados:
            for leitura in dados:
                epc = leitura.get("reading_epc_hex")
                print(f"\n[CATRACA] ALERTA: Livro IRREGULAR detectado na porta! EPC: {epc}")
                
        return {"status": "recebido"}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Formato JSON inválido")

if __name__ == '__main__':
    import uvicorn
    print("="*50)
    print(" INICIANDO API DO TOTEM E MONITORAMENTO DA CATRACA ")
    print("="*50)
    uvicorn.run(app, host='0.0.0.0', port=5000)