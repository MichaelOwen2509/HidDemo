#include <iostream>
#include <unistd.h>
#include <cstdio>
#include <termios.h>
#include "CFHidApi.h"

#define FALSE 0
#define TRUE 1

using namespace std;

int main() {
    cout << "\n--- Leitor Completo: TID e Conteudo Gravado ---" << endl;
    
    if (CFHid_OpenDevice() == FALSE) {
        cout << "\n[ERRO] Leitor nao encontrado. Lembre-se de rodar o comando de permissao USB!" << endl;
        return 1;
    }

    // 1. Muta o leitor para ele não agir como teclado e atrapalhar o terminal
    CFHid_StopRead(0xFF);
    usleep(200000); 
    tcflush(STDIN_FILENO, TCIFLUSH); 

    cout << "\n>>> Aproxime a etiqueta para o raio-X completo..." << endl;

    unsigned char Password[4] = {0,0,0,0};
    
    // Variáveis para o TID (Fábrica)
    unsigned char TIDData[12] = {0};
    bool tidLido = false;

    // Variáveis para o EPC (Conteúdo Gravado)
    unsigned char EPCData[12] = {0};
    bool epcLido = false;

    // 2. Lê a Identidade de Fábrica (Banco 2, Endereço 0)
    while (!tidLido) {
        if (CFHid_ReadCardG2(0xFF, Password, 2, 0, 6, TIDData) == TRUE) {
            tidLido = true;
        } else {
            usleep(100000); // Espera 100ms e tenta de novo
        }
    }

    // 3. Lê o Conteúdo Gravado (Banco 1, Endereço 2 - pula blocos de controle)
    // Como a tag já está no leitor (o TID acabou de ser lido), ele deve ler isso de primeira.
    while (!epcLido) {
        if (CFHid_ReadCardG2(0xFF, Password, 1, 2, 6, EPCData) == TRUE) {
            epcLido = true;
        } else {
            usleep(100000);
        }
    }

    // 4. Imprime os dois resultados de forma limpa na tela
    cout << "\n========================================" << endl;
    
    cout << "TID (Identidade de Fabrica) : ";
    for (int i = 0; i < 12; i++) {
        printf("%02X", TIDData[i]);
    }
    cout << endl;
    
    cout << "EPC (Conteudo Gravado)      : ";
    for (int i = 0; i < 12; i++) {
        printf("%02X", EPCData[i]);
    }
    
    cout << "\n========================================" << endl;

    // 5. O truque de mestre: Devolve o leitor ao modo teclado automático!
    // Assim, você não precisa desconectar o cabo depois de rodar o programa.
    CFHid_StartRead(0xFF);
    
    CFHid_CloseDevice();
    return 0;
}