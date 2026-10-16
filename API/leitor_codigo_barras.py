"""
Rota de leitura do número do livro (código de barras ou digitação).

Durante a espera (padrão 30 s) a API escuta, ao mesmo tempo:
  - o leitor de código de barras (Bematech BR-310, chip 040b:6543), e
  - o(s) teclado(s) do computador.

O primeiro que terminar com ENTER (e tiver ao menos um dígito) responde.
Só dígitos 0-9 são aceitos (linha superior ou teclado numérico); letras,
símbolos e teclas com Shift/Ctrl/Alt são ignorados. BACKSPACE apaga o
último dígito digitado.

Leitura nativa de /dev/input via struct + select: sem evdev e sem sudo em
runtime. Basta o usuário estar no grupo 'input':

    sudo usermod -aG input $USER   # depois, logout/login

Uso no script principal (depois de criar o app):

    from leitor_codigo_barras import router as router_codigo_barras
    app = FastAPI()
    app.include_router(router_codigo_barras)

Variáveis de ambiente (todas opcionais):
    SCANNER_VID         VID do leitor em hexadecimal        (padrão: 040b)
    SCANNER_PID         PID do leitor em hexadecimal        (padrão: 6543)
    SCANNER_TIMEOUT     timeout padrão em segundos          (padrão: 30)
    SCANNER_DEVICE      caminho forçado, ex: /dev/input/event5
    TECLADO_EXCLUSIVO   "1" captura o teclado com exclusividade durante a
                        espera (os dígitos não aparecem em outras janelas,
                        mas o teclado fica "preso" até o ENTER ou o fim do
                        tempo). Padrão: 0
    MOCK_SCANNER        "1" para responder sem hardware
    MOCK_CODIGO         código devolvido no modo mock
"""

import asyncio
import os
import select
import struct
import time

from fastapi import APIRouter

try:
    import fcntl

    FCNTL_DISPONIVEL = True
except ImportError:  # Windows, por exemplo
    fcntl = None
    FCNTL_DISPONIVEL = False

router = APIRouter()

# ==========================================
# CONFIGURAÇÃO
# ==========================================

SCANNER_VID = int(os.getenv("SCANNER_VID", "040b"), 16)
SCANNER_PID = int(os.getenv("SCANNER_PID", "6543"), 16)
SCANNER_TIMEOUT_PADRAO = float(os.getenv("SCANNER_TIMEOUT", "30"))
TECLADO_EXCLUSIVO = os.getenv("TECLADO_EXCLUSIVO", "0") == "1"

LEITOR_HID_DISPONIVEL = os.name == "posix" and os.path.isdir("/dev/input")

# Constantes do kernel (linux/input-event-codes.h e linux/input.h)
EV_KEY = 1
EV_REP_MASCARA = 1 << 20  # teclados de verdade reportam EV_REP
KEY_BACKSPACE = 14
KEY_ENTER = 28
KEY_KPENTER = 96
EVIOCGRAB = 0x40044590

# Shift, Ctrl, Alt e Meta (esquerdo e direito)
_MODIFICADORES = {42, 54, 29, 97, 56, 100, 125, 126}

# scancode -> dígito
_DIGITOS_LINHA_SUPERIOR = {
    2: "1", 3: "2", 4: "3", 5: "4", 6: "5",
    7: "6", 8: "7", 9: "8", 10: "9", 11: "0",
}
_DIGITOS_NUMERICO = {
    79: "1", 80: "2", 81: "3",
    75: "4", 76: "5", 77: "6",
    71: "7", 72: "8", 73: "9",
    82: "0",
}

# struct input_event: segundos, microssegundos, tipo, código, valor
_FORMATO_EVENTO = struct.Struct("llHHi")

_lock_codigo_barras = asyncio.Lock()

def _sucesso(codigo: str) -> dict:
    # "codigo_barras" (nome usado na rota antiga) e "codigo" (nome usado
    # em outras versões): assim qualquer front-end continua funcionando.
    return {"status": "sucesso", "codigo_barras": codigo, "codigo": codigo}


MSG_SEM_PERMISSAO = (
    "Sem permissão para ler o dispositivo. Adicione o usuário ao grupo "
    "'input' e configure a regra udev para 040b:6543."
)


# ==========================================
# DETECÇÃO DOS DISPOSITIVOS
# ==========================================

def _listar_dispositivos_entrada(conteudo=None):
    """Interpreta /proc/bus/input/devices e devolve lista de dicionários."""
    if conteudo is None:
        try:
            with open(
                "/proc/bus/input/devices",
                "r",
                encoding="utf-8",
                errors="replace",
            ) as arquivo:
                conteudo = arquivo.read()
        except Exception:
            return []

    dispositivos = []
    bloco = {}
    for linha in conteudo.splitlines() + [""]:
        linha = linha.strip()
        if not linha:
            if bloco.get("event"):
                dispositivos.append(bloco)
            bloco = {}
            continue

        if linha.startswith("I:"):
            partes = {}
            for token in linha[2:].strip().split():
                if "=" in token:
                    chave, valor = token.split("=", 1)
                    partes[chave] = valor
            try:
                bloco["vendor"] = int(partes.get("Vendor", "0"), 16)
            except (TypeError, ValueError):
                bloco["vendor"] = None
            try:
                bloco["product"] = int(partes.get("Product", "0"), 16)
            except (TypeError, ValueError):
                bloco["product"] = None
        elif linha.startswith("N: Name="):
            bloco["name"] = linha.split("Name=", 1)[1].strip().strip('"')
        elif linha.startswith("B: EV="):
            try:
                bloco["ev"] = int(linha.split("=", 1)[1].strip(), 16)
            except (TypeError, ValueError):
                bloco["ev"] = 0
        elif linha.startswith("H: Handlers="):
            handlers = linha.split("Handlers=", 1)[1].strip().split()
            bloco["handlers"] = handlers
            eventos = [h for h in handlers if h.startswith("event")]
            if eventos:
                bloco["event"] = eventos[0]
    return dispositivos


def _detectar_scanner_codigo_barras():
    """Devolve o caminho /dev/input/eventX do leitor, ou None."""
    forcado = os.getenv("SCANNER_DEVICE")
    if forcado and os.path.exists(forcado):
        return forcado

    if not LEITOR_HID_DISPONIVEL:
        return None

    dispositivos = _listar_dispositivos_entrada()

    # 1) Por VID/PID
    for disp in dispositivos:
        if (
            disp.get("vendor") == SCANNER_VID
            and disp.get("product") == SCANNER_PID
        ):
            caminho = f"/dev/input/{disp['event']}"
            if os.path.exists(caminho):
                return caminho

    # 2) Pelo nome
    for disp in dispositivos:
        nome_baixo = (disp.get("name") or "").lower()
        if any(
            chave in nome_baixo
            for chave in ("040b", "6543", "bematech", "br-310", "br310")
        ):
            caminho = f"/dev/input/{disp['event']}"
            if os.path.exists(caminho):
                return caminho

    # 3) Por /dev/input/by-id
    base = "/dev/input/by-id"
    try:
        for entrada in os.listdir(base):
            if "040b_6543" in entrada and "event-kbd" in entrada:
                return os.path.join(base, entrada)
    except Exception:
        pass

    return None


def _detectar_teclados():
    """Caminhos dos teclados (handler 'kbd' + EV_REP). Ignora botão de
    energia, tampa, etc., que também têm 'kbd' mas não repetem tecla."""
    caminhos = []
    for disp in _listar_dispositivos_entrada():
        if "kbd" not in disp.get("handlers", []):
            continue
        if not (disp.get("ev", 0) & EV_REP_MASCARA):
            continue
        caminho = f"/dev/input/{disp['event']}"
        if os.path.exists(caminho):
            caminhos.append(caminho)
    return caminhos


def _detectar_dispositivos_entrada():
    """Devolve {caminho: capturar_com_exclusividade} de tudo que será
    escutado: teclados e leitor de código de barras."""
    caminhos = {}
    for caminho in _detectar_teclados():
        caminhos[os.path.realpath(caminho)] = TECLADO_EXCLUSIVO
    scanner = _detectar_scanner_codigo_barras()
    if scanner:
        # O leitor é sempre exclusivo, para o código não "vazar" em janelas
        caminhos[os.path.realpath(scanner)] = True
    return caminhos


# ==========================================
# LEITURA BLOQUEANTE (roda em thread)
# ==========================================

def _liberar(fd: int, exclusivo: bool):
    if exclusivo and FCNTL_DISPONIVEL:
        try:
            fcntl.ioctl(fd, EVIOCGRAB, 0)
        except Exception:
            pass
    try:
        os.close(fd)
    except Exception:
        pass


def _ler_dispositivos_bloqueante(caminhos: dict, timeout: float):
    """Escuta todos os dispositivos ao mesmo tempo. Devolve os dígitos do
    primeiro que terminar com ENTER, ou None se o tempo acabar."""
    estados = {}
    erro_abertura = None
    try:
        for caminho, exclusivo in caminhos.items():
            try:
                fd = os.open(caminho, os.O_RDONLY | os.O_NONBLOCK)
            except OSError as erro:
                erro_abertura = erro
                continue

            estados[fd] = {
                "buffer": [],          # dígitos acumulados deste dispositivo
                "modificadores": set(),
                "resto": b"",
                "exclusivo": exclusivo,
            }
            if exclusivo and FCNTL_DISPONIVEL:
                try:
                    fcntl.ioctl(fd, EVIOCGRAB, 1)
                except Exception:
                    pass

        if not estados:
            raise erro_abertura or OSError(
                "Nenhum dispositivo de entrada disponível."
            )

        tamanho = _FORMATO_EVENTO.size
        fim = time.monotonic() + timeout

        while True:
            restante = fim - time.monotonic()
            if restante <= 0:
                return None

            prontos, _, _ = select.select(list(estados), [], [], restante)
            if not prontos:
                return None

            for fd in prontos:
                estado = estados[fd]
                try:
                    dados = os.read(fd, 4096)
                except BlockingIOError:
                    continue
                except OSError:
                    dados = b""  # dispositivo removido

                if not dados:
                    _liberar(fd, estado["exclusivo"])
                    del estados[fd]
                    if not estados:
                        raise OSError(
                            "Dispositivos de entrada desconectados."
                        )
                    continue

                estado["resto"] += dados
                while len(estado["resto"]) >= tamanho:
                    bloco = estado["resto"][:tamanho]
                    estado["resto"] = estado["resto"][tamanho:]
                    _, _, tipo, codigo, valor = _FORMATO_EVENTO.unpack(bloco)

                    if tipo != EV_KEY:
                        continue

                    mods = estado["modificadores"]
                    if codigo in _MODIFICADORES:
                        if valor == 1:
                            mods.add(codigo)
                        elif valor == 0:
                            mods.discard(codigo)
                        continue

                    if valor != 1:  # só interessa a tecla pressionada
                        continue

                    buffer = estado["buffer"]

                    if codigo in (KEY_ENTER, KEY_KPENTER):
                        if buffer:
                            return "".join(buffer)
                        continue

                    if codigo == KEY_BACKSPACE:
                        if buffer:
                            buffer.pop()
                        continue

                    if mods:  # Shift/Ctrl/Alt: não é dígito puro
                        continue

                    digito = _DIGITOS_LINHA_SUPERIOR.get(
                        codigo
                    ) or _DIGITOS_NUMERICO.get(codigo)
                    if digito:
                        buffer.append(digito)
    finally:
        for fd, estado in estados.items():
            _liberar(fd, estado["exclusivo"])


# ==========================================
# ROTA
# ==========================================

@router.get("/api/totem/ler_codigo_barras/")
async def ler_codigo_barras_totem(
    timeout: float = 30, mock: str | None = None
):
    # Modo mock via query string: /api/totem/ler_codigo_barras/?mock=123
    if mock is not None:
        codigo_mock = "".join(c for c in mock if c in "0123456789")
        if not codigo_mock:
            return {"status": "erro", "mensagem": "Nenhum código lido."}
        return _sucesso(codigo_mock)

    # Modo mock via variável de ambiente
    if os.getenv("MOCK_SCANNER", "0") == "1":
        await asyncio.sleep(0.5)
        return _sucesso(os.getenv("MOCK_CODIGO", "9788535902777"))

    try:
        timeout = float(timeout)
    except (TypeError, ValueError):
        timeout = SCANNER_TIMEOUT_PADRAO
    timeout = max(1.0, min(timeout, 60.0))

    if _lock_codigo_barras.locked():
        return {"status": "erro", "mensagem": "Leitura em andamento. Aguarde."}

    async with _lock_codigo_barras:
        if not LEITOR_HID_DISPONIVEL:
            return {
                "status": "erro",
                "mensagem": (
                    "Leitura de dispositivo HID não suportada neste servidor."
                ),
            }

        caminhos = _detectar_dispositivos_entrada()
        if not caminhos:
            return {
                "status": "erro",
                "mensagem": (
                    "Nenhum teclado ou leitor de código de barras "
                    "encontrado. Verifique a conexão USB (040b:6543)."
                ),
            }

        try:
            codigo = await asyncio.wait_for(
                asyncio.to_thread(
                    _ler_dispositivos_bloqueante, caminhos, timeout
                ),
                timeout + 5,
            )
        except asyncio.TimeoutError:
            return {
                "status": "erro",
                "mensagem": "Tempo esgotado ao ler código de barras.",
            }
        except PermissionError:
            return {"status": "erro", "mensagem": MSG_SEM_PERMISSAO}
        except OSError as erro:
            if getattr(erro, "errno", None) == 13:
                return {"status": "erro", "mensagem": MSG_SEM_PERMISSAO}
            return {
                "status": "erro",
                "mensagem": f"Falha ao acessar o dispositivo: {erro}",
            }
        except Exception as erro:
            return {
                "status": "erro",
                "mensagem": f"Erro interno do servidor: {erro}",
            }

        if not codigo:
            return {
                "status": "erro",
                "mensagem": "Tempo esgotado ao ler código de barras.",
            }

        return _sucesso(codigo)