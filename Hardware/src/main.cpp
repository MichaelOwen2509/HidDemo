#include <iostream>
#include <string>
#include <unistd.h>
#include <cstdio>
#include <termios.h>
#include <cstring>
#include <cctype>
#include "../CFHidApi.h"

using namespace std;

const int TAMANHO_MAX_EPC = 24;
const int TAMANHO_ARRAY_DADOS = 12;
const int TAMANHO_BLOCO_LEITURA = 6;
const int MAX_TENTATIVAS = 20;

unsigned char SENHA_TAG[4] = {0, 0, 0, 0}; 

bool hexStringToBytes(const string& hexRaw, unsigned char* bytes, size_t maxBytes) {
    if (hexRaw.length() % 2 != 0 || hexRaw.length() / 2 > maxBytes) return false;
    for (size_t i = 0; i < hexRaw.length(); i += 2) {
        auto nibble = [](char c) -> int {
            c = toupper(c);
            if (c >= '0' && c <= '9') return c - '0';
            if (c >= 'A' && c <= 'F') return c - 'A' + 10;
            return -1; 
        };
        int v1 = nibble(hexRaw[i]);
        int v2 = nibble(hexRaw[i + 1]);
        if (v1 < 0 || v2 < 0) return false;
        bytes[i / 2] = (unsigned char)((v1 * 16) + v2);
    }
    return true;
}

// Bytes para JSON
string bytesToHexString(unsigned char* dados) {
    char buffer[3];
    string resultado = "";
    for (int i = 0; i < TAMANHO_ARRAY_DADOS; i++) {
        sprintf(buffer, "%02X", dados[i]);
        resultado += buffer;
    }
    return resultado;
}

bool prepararLeitor() {
    if (CFHid_OpenDevice() == 0) return false;
    CFHid_StopRead(0xFF);            
    usleep(200000);                  
    tcflush(STDIN_FILENO, TCIFLUSH); 
    return true;
}

bool lerMemoriaDaTag(unsigned char banco, unsigned char endereco, unsigned char* bufferSaida) {
    bool lido = false;
    int tentativas = 0;
    while (!lido && tentativas < MAX_TENTATIVAS) {
        if (CFHid_ReadCardG2(0xFF, SENHA_TAG, banco, endereco, TAMANHO_BLOCO_LEITURA, bufferSaida) == 1) {
            lido = true;
        } else {
            usleep(100000); 
            tentativas++;
        }
    }
    return lido;
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        cout << "{\"status\": \"erro\", \"mensagem\": \"Nenhum comando fornecido. Use --ler ou --gravar\"}" << endl;
        return 1;
    }

    string comando = argv[1];

    // Tenta conectar com o leitor
    if (!prepararLeitor()) {
        cout << "{\"status\": \"erro\", \"mensagem\": \"Leitor nao encontrado ou sem permissao USB.\"}" << endl;
        return 1;
    }

    // COMANDO DE LEITURA
    if (comando == "--ler") {
        unsigned char TIDData[TAMANHO_ARRAY_DADOS] = {0};
        unsigned char EPCData[TAMANHO_ARRAY_DADOS] = {0};

        bool tidLido = lerMemoriaDaTag(2, 0, TIDData);
        bool epcLido = lerMemoriaDaTag(1, 2, EPCData);

        if (tidLido || epcLido) {
            string tidHex = bytesToHexString(TIDData);
            string epcHex = bytesToHexString(EPCData);
            
            // JSON sucesso
            cout << "{\"status\": \"sucesso\", \"tid\": \"" << tidHex << "\", \"epc\": \"" << epcHex << "\"}" << endl;
        } else {
            // JSON erro
            cout << "{\"status\": \"erro\", \"mensagem\": \"Nenhuma tag detectada no sensor.\"}" << endl;
        }
    } 
    
    // COMANDO DE GRAVAÇÃO
    else if (comando == "--gravar") {
        if (argc < 3) {
            cout << "{\"status\": \"erro\", \"mensagem\": \"Falta o codigo EPC para gravar.\"}" << endl;
            CFHid_CloseDevice();
            return 1;
        }
        
        string hexInput = argv[2];
        
        // Ajusta tamanho -  zeros a esquerda
        if (hexInput.length() < TAMANHO_MAX_EPC) {
            hexInput = string(TAMANHO_MAX_EPC - hexInput.length(), '0') + hexInput;
        } else if (hexInput.length() > TAMANHO_MAX_EPC) {
            cout << "{\"status\": \"erro\", \"mensagem\": \"Codigo EPC excede o limite de 24 caracteres.\"}" << endl;
            CFHid_CloseDevice();
            return 1;
        }

        unsigned char Writedata[TAMANHO_ARRAY_DADOS] = {0};
        if (!hexStringToBytes(hexInput, Writedata, sizeof(Writedata))) {
            cout << "{\"status\": \"erro\", \"mensagem\": \"Caracteres invalidos no EPC.\"}" << endl;
            CFHid_CloseDevice();
            return 1;
        }

        // Gravar na etiqueta
        if (CFHid_WriteCardG2(0xFF, SENHA_TAG, 1, 2, TAMANHO_BLOCO_LEITURA, Writedata) != 0) {
            cout << "{\"status\": \"sucesso\", \"mensagem\": \"Tag gravada com exito!\"}" << endl;
        } else {
            cout << "{\"status\": \"erro\", \"mensagem\": \"Falha ao gravar. A etiqueta estava posicionada corretamente?\"}" << endl;
        }
    } 

    else {
        cout << "{\"status\": \"erro\", \"mensagem\": \"Comando desconhecido. Use --ler ou --gravar\"}" << endl;
    }

    CFHid_CloseDevice();
    return 0;
}