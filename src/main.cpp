#include <iostream>
#include <string>
#include <unistd.h>
#include <cstdio>
#include <termios.h>
#include <limits>
#include <cctype>
#include "../CFHidApi.h"
#include <cstdlib>

using namespace std;

// =====================================================================
// FUNÇÕES AUXILIARES DE CONVERSÃO E VALIDAÇÃO
// =====================================================================

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
    for (int i = 0; i < 12; i++) {
        printf("%02X", dados[i]);
    }
    cout << endl;
}

// =====================================================================
// FUNÇÕES DE COMUNICAÇÃO COM O HARDWARE
// =====================================================================

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
    unsigned char Password[4] = {0,0,0,0};
    unsigned char tamanho = 6; 
    bool lido = false;
    int tentativas = 0;

    // Tenta ler por no máximo 2 segundos (20 * 100ms)
    while (!lido && tentativas < 20) {
        if (CFHid_ReadCardG2(0xFF, Password, banco, endereco, tamanho, bufferSaida) == 1) {
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

// =====================================================================
// CORPO PRINCIPAL: MENU INTERATIVO
// =====================================================================

int main() {
    cout << "\n=========================================" << endl;
    cout << "      SISTEMA DE GERENCIAMENTO RFID      " << endl;
    cout << "=========================================" << endl;

    if (!prepararLeitor()) return 1;

    int opcao = 0;

    // Loop do Menu Principal
    while (opcao != 3) {

        cout << "\n---------------- MENU ----------------" << endl;
        cout << "1. Ler Etiqueta (Raio-X Completo)" << endl;
        cout << "2. Gravar Novo EPC" << endl;
        cout << "3. Encerrar Sistema" << endl;
        cout << "--------------------------------------" << endl;
        cout << "Escolha uma opcao: ";
        
        // Proteção caso digitem letras no menu
        if (!(cin >> opcao)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "[ERRO] Digite um numero valido!" << endl;
            continue;
        }

        // Limpa o "Enter" que ficou no buffer do cin
        cin.ignore(numeric_limits<streamsize>::max(), '\n'); 

        switch (opcao) {
            
            // ---------------------------------------------------------
            // OPÇÃO 1: MODO DE LEITURA
            // ---------------------------------------------------------
            case 1: {
                cout << "\n[MODO DE LEITURA]" << endl;
                tcflush(STDIN_FILENO, TCIFLUSH);

                unsigned char TIDData[12] = {0};
                unsigned char EPCData[12] = {0};

                cout << "Lendo..." << endl;
                lerMemoriaDaTag(2, 0, TIDData);
                lerMemoriaDaTag(1, 2, EPCData);

                system("clear");

                cout << "\n========================================" << endl;
                imprimirResultado("TID (Fabrica) : ", TIDData);
                imprimirResultado("EPC (Gravado) : ", EPCData);
                cout << "========================================" << endl;
                break;
            }

            // ---------------------------------------------------------
            // OPÇÃO 2: MODO DE GRAVAÇÃO
            // ---------------------------------------------------------
            case 2: {
                cout << "\n[MODO DE GRAVACAO]" << endl;
                string hexInput;
                bool epcValido = false;
                unsigned char Writedata[12] = {0};

                while (!epcValido) {
                    cout << "Digite o EPC do livro (ate 24 caracteres hexadecimais):" << endl;
                    cout << "> ";
                    cin >> hexInput;

                    if (hexInput.length() > 24) {
                        cout << "[ERRO] Maximo de 24 caracteres excedido. Tente de novo.\n" << endl;
                        continue;
                    }
                    if (hexInput.length() < 24) {
                        hexInput = string(24 - hexInput.length(), '0') + hexInput;
                        cout << "[INFO] EPC ajustado para: " << hexInput << endl;
                    }
                    if (!hexStringToBytes(hexInput, Writedata, sizeof(Writedata))) {
                        cout << "[ERRO] Caracteres invalidos (use apenas 0-9 e A-F).\n" << endl;
                        continue;
                    }
                    epcValido = true;
                }

                // Limpa o buffer de novo
                cin.ignore(numeric_limits<streamsize>::max(), '\n');
                tcflush(STDIN_FILENO, TCIFLUSH);

                cout << "\nPosicione a etiqueta no leitor e digite 'S' para gravar: ";
                string confirma;
                cin >> confirma;

                system("clear");

                if (confirma == "S" || confirma == "s") {
                    unsigned char Password[4] = {0,0,0,0};
                    if (CFHid_WriteCardG2(0xFF, Password, 1, 2, 6, Writedata) != 0) {
                        cout << "[SUCESSO] O codigo foi gravado na etiqueta!" << endl;
                    } else {
                        cout << "[FALHA] Nao foi possivel gravar. A etiqueta estava posicionada corretamente?" << endl;
                    }
                } else {
                    cout << "[CANCELADO] Voltando ao menu principal." << endl;
                }
                break;
            }

            case 3:
                cout << "\nEncerrando sistema" << endl;
                break;

            default:
                cout << "[ERRO] Opcao invalida. Escolha 1, 2 ou 3." << endl;
                break;
        }
    }
    
    CFHid_CloseDevice();
    return 0;
}