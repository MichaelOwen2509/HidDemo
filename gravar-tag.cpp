#include <iostream>
#include <string>
#include <unistd.h>
#include <limits>
#include <cctype>   // toupper
#include <cstdio>   // printf
#include <termios.h> // A mágica do Linux para manipular o buffer do terminal
#include "CFHidApi.h"

using namespace std;

// Retorna false se a string não for um hex válido (tamanho par e só 0-9/A-F/a-f)
bool hexStringToBytes(const string& hexRaw, unsigned char* bytes, size_t maxBytes) {
    if (hexRaw.length() % 2 != 0) return false;              // tamanho ímpar
    if (hexRaw.length() / 2 > maxBytes) return false;        // maior que o buffer

    for (size_t i = 0; i < hexRaw.length(); i += 2) {
        auto nibble = [](char c) -> int {
            c = toupper(c);
            if (c >= '0' && c <= '9') return c - '0';
            if (c >= 'A' && c <= 'F') return c - 'A' + 10;
            return -1; // caractere inválido
        };
        int v1 = nibble(hexRaw[i]);
        int v2 = nibble(hexRaw[i + 1]);
        if (v1 < 0 || v2 < 0) return false;                   // caractere não-hex
        bytes[i / 2] = (unsigned char)((v1 * 16) + v2);
    }
    return true;
}

int main() {
    cout << "\n--- Gravador e Leitor de Acervo (Modo Blindado) ---" << endl;
    if (CFHid_OpenDevice() == 0) {
        cout << "[ERRO] Leitor nao encontrado. Verifique conexao e permissoes." << endl;
        return 1;
    }

    // 1. ISOLAMENTO DO HARDWARE
    CFHid_StopRead(0xFF); // Manda o leitor calar a boca (parar modo teclado)
    usleep(300000);       // Dá 300ms para o hardware processar a parada

    // Destrói literalmente qualquer digitação fantasma ou Enter que o leitor 
    // tenha enfiado no terminal antes de chegarmos aqui.
    tcflush(STDIN_FILENO, TCIFLUSH); 

    // 2. LEITURA PRÉVIA AUTOMÁTICA (Sem precisar de Enter)
    cout << "\n>>> Lendo etiqueta... (Posicione o livro no leitor)" << endl;

    unsigned char arrBuffer[2048] = {0};
    unsigned short iTagLength = 0;
    unsigned short iTagNumber = 0;
    bool lido = false;

    // Faz a varredura ativamente por até 2 segundos (40 tentativas de 50ms)
    for (int i = 0; i < 40; i++) {
        if (CFHid_InventoryG2(0xFF, arrBuffer, &iTagLength, &iTagNumber) != 0 && iTagNumber > 0) {
            lido = true;
            break;
        }
        usleep(50000); // Pausa de 50ms entre tentativas
    }

    if (lido) {
        unsigned char bPackLength = arrBuffer[0];
        unsigned char *pID = (unsigned char *)&arrBuffer[1];
        cout << "----------------------------------------" << endl;
        cout << "VALOR ATUAL DA ETIQUETA: ";
        for (int i = 2; i < bPackLength - 1; i++) printf("%.2X", pID[i]);
        cout << endl << "----------------------------------------" << endl;
    } else {
        cout << "[AVISO] Nenhuma tag detectada. Continuando para a gravacao..." << endl;
    }

    // Limpa o buffer de novo só por precaução absoluta antes de você digitar
    tcflush(STDIN_FILENO, TCIFLUSH);

    // 3. ENTRADA DO NOVO DADO (Sua lógica que ficou excelente)
    unsigned char Writedata[12] = {0};
    string hexInput;
    bool epcValido = false;

    while (!epcValido) {
        cout << "\nDigite o EPC para o NOVO livro (ate 24 caracteres hexadecimais):" << endl;
        cout << "> ";
        cin >> hexInput;

        if (hexInput.length() > 24) {
            cout << "[ERRO] EPC maior que 24 caracteres. Tente novamente." << endl;
            continue;
        }
        if (hexInput.length() < 24) {
            hexInput = string(24 - hexInput.length(), '0') + hexInput;
            cout << "[INFO] EPC ajustado automaticamente para: " << hexInput << endl;
        }
        if (!hexStringToBytes(hexInput, Writedata, sizeof(Writedata))) {
            cout << "[ERRO] EPC contem caracteres invalidos (use apenas 0-9 e A-F)." << endl;
            continue;
        }
        epcValido = true;
    }

    unsigned char Password[4] = {0, 0, 0, 0};

    // Mais um flush de segurança para evitar que enter duplo quebre a confirmação
    tcflush(STDIN_FILENO, TCIFLUSH); 

    cout << "\n>>> Mantenha a tag no leitor e digite 'S' para gravar (outra tecla cancela): ";
    string confirma;
    cin >> confirma;

    // 4. GRAVAÇÃO
    if (confirma == "S" || confirma == "s") {
        if (CFHid_WriteCardG2(0xFF, Password, 1, 2, 6, Writedata) != 0) {
            cout << "[SUCESSO] O codigo do novo livro foi gravado com perfeicao!" << endl;
        } else {
            cout << "[FALHA] Nao foi possivel gravar. Verifique se a etiqueta esta bem posicionada." << endl;
        }
    } else {
        cout << "[CANCELADO] Gravacao abortada pelo usuario." << endl;
    }

    CFHid_CloseDevice();
    return 0;
}