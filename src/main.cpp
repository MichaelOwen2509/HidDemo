#include <iostream>
#include <string>
#include <unistd.h>
#include <cstdio>
#include <termios.h>
#include <limits>
#include <cctype>
#include <cstdlib>
#include "../CFHidApi.h"

using namespace std;

// CONSTANTES GLOBAIS
const int TAMANHO_MAX_EPC = 24;
const int TAMANHO_ARRAY_DADOS = 12;
const int TAMANHO_BLOCO_LEITURA = 6;
const int MAX_TENTATIVAS = 20;

// Centraliza a senha. Caso seja implementada segurança futura, muda só aqui.
unsigned char SENHA_TAG[4] = {0, 0, 0, 0}; 

// FUNÇÕES AUXILIARES DE UX E VALIDAÇÃO
bool hexStringToBytes(const string& hexRaw, unsigned char* bytes, size_t maxBytes) {
    if (hexRaw.length() % 2 != 0) return false;
    if (hexRaw.length() / 2 > maxBytes) return false;

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

void imprimirResultado(const string& rotulo, unsigned char* dados) {
    cout << rotulo;
    for (int i = 0; i < TAMANHO_ARRAY_DADOS; i++) {
        printf("%02X", dados[i]);
    }
    cout << endl;
}

// Congela a tela para o usuário conseguir ler antes de o loop apagar tudo
void pausarParaContinuar() {
    cout << "\n[Pressione ENTER para continuar...]";
    string dummy;
    getline(cin, dummy);
}


// COMUNICAÇÃO COM O HARDWARE
bool prepararLeitor() {
    if (CFHid_OpenDevice() == 0) {
        cout << "\n[ERRO] Leitor nao encontrado. (sudo chmod 666 /dev/bus/usb/*/*)" << endl;
        return false;
    }
    CFHid_StopRead(0xFF);            // Trava o sensor
    usleep(200000);                  
    tcflush(STDIN_FILENO, TCIFLUSH); // Limpa o terminal
    return true;
}

void lerMemoriaDaTag(unsigned char banco, unsigned char endereco, unsigned char* bufferSaida) {
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
    if (!lido) {
        cout << " [!] Nao foi possivel ler o banco " << (int)banco << ". Verifique a posicao da etiqueta." << endl;
    }
}

// OPERAÇÃO DO SISTEMA
void executarLeitura() {
    cout << "\n[MODO DE LEITURA]" << endl;
    cout << "Fazendo a varredura da etiqueta..." << endl;
    tcflush(STDIN_FILENO, TCIFLUSH);

    unsigned char TIDData[TAMANHO_ARRAY_DADOS] = {0};
    unsigned char EPCData[TAMANHO_ARRAY_DADOS] = {0};

    lerMemoriaDaTag(2, 0, TIDData);
    lerMemoriaDaTag(1, 2, EPCData);

    system("clear");

    cout << "\n========================================" << endl;
    imprimirResultado("TID (Fabrica) : ", TIDData);
    imprimirResultado("EPC (Gravado) : ", EPCData);
    cout << "========================================" << endl;
    
    pausarParaContinuar();
}

void executarGravacao() {
    cout << "\n[MODO DE GRAVACAO]" << endl;
    string hexInput;
    bool epcValido = false;
    unsigned char Writedata[TAMANHO_ARRAY_DADOS] = {0};

    while (!epcValido) {
        cout << "Digite o EPC do livro (ate " << TAMANHO_MAX_EPC << " caracteres hexadecimais):" << endl;
        cout << "> ";
        cin >> hexInput;

        if (hexInput.length() > TAMANHO_MAX_EPC) {
            cout << "[ERRO] Maximo de " << TAMANHO_MAX_EPC << " caracteres excedido. Tente de novo.\n" << endl;
            continue;
        }
        if (hexInput.length() < TAMANHO_MAX_EPC) {
            hexInput = string(TAMANHO_MAX_EPC - hexInput.length(), '0') + hexInput;
            cout << "[INFO] EPC ajustado para: " << hexInput << endl;
        }
        if (!hexStringToBytes(hexInput, Writedata, sizeof(Writedata))) {
            cout << "[ERRO] Caracteres invalidos (use apenas 0-9 e A-F).\n" << endl;
            continue;
        }
        epcValido = true;
    }

    // Limpa o buffer de digitação para garantir uma leitura limpa da confirmação
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    tcflush(STDIN_FILENO, TCIFLUSH);

    cout << "\nPosicione a etiqueta no leitor e digite 'S' para gravar: ";
    string confirma;
    getline(cin, confirma); // Pega a linha toda, inclusive enter acidental

    system("clear");

    if (confirma == "S" || confirma == "s") {
        if (CFHid_WriteCardG2(0xFF, SENHA_TAG, 1, 2, TAMANHO_BLOCO_LEITURA, Writedata) != 0) {
            cout << "\n[SUCESSO] O codigo foi gravado na etiqueta com exito!" << endl;
        } else {
            cout << "\n[FALHA] Nao foi possivel gravar. A etiqueta estava posicionada corretamente?" << endl;
        }
    } else {
        cout << "\n[CANCELADO] Operacao abortada. Nenhuma gravacao foi feita." << endl;
    }
    
    pausarParaContinuar();
}


int main() {
    if (!prepararLeitor()) return 1;

    int opcao = 0;

    while (opcao != 3) {
        system("clear");

        cout << "=========================================" << endl;
        cout << "              SISTEMA RFID               " << endl;
        cout << "=========================================" << endl;
        cout << "1. Ler Etiqueta" << endl;
        cout << "2. Gravar Novo EPC" << endl;
        cout << "3. Encerrar Sistema" << endl;
        cout << "-----------------------------------------" << endl;
        cout << "Escolha uma opcao: ";
        
        if (!(cin >> opcao)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "\n[ERRO] Digite um numero valido!" << endl;
            pausarParaContinuar();
            continue;
        }

        // Limpa o Enter deixado pelo cin antes de chamar os módulos
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); 

        switch (opcao) {
            case 1:
                executarLeitura();
                break;
            case 2:
                executarGravacao();
                break;
            case 3:
                system("clear");
                cout << "\nDesconectando do leitor...\n" << endl;
                break;
            default:
                cout << "\n[ERRO] Opcao invalida. Escolha 1, 2 ou 3." << endl;
                pausarParaContinuar();
                break;
        }
    }
    
    CFHid_CloseDevice();
    return 0;
}