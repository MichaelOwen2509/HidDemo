#include <iostream>
#include <string>
#include <unistd.h>
#include <cstdio>
#include <termios.h>
#include "CFHidApi.h"

using namespace std;

// =====================================================================
// FUNÇÕES AUXILIARES
// =====================================================================

bool prepararLeitor() {
    if (CFHid_OpenDevice() == 0) {
        cout << "\n[ERRO] Leitor nao encontrado. (sudo chmod 666 /dev/bus/usb/*/*)" << endl;
        return false;
    }

    CFHid_StopRead(0xFF);            // Trava o sensor imediatamente
    usleep(200000);                  
    tcflush(STDIN_FILENO, TCIFLUSH); // Limpa o terminal de qualquer lixo
    return true;
}

// Função de leitura com limite de tempo (para não travar para sempre se não tiver tag)
void lerMemoriaDaTag(unsigned char banco, unsigned char endereco, unsigned char* bufferSaida) {
    unsigned char Password[4] = {0,0,0,0};
    unsigned char tamanhoDaLeitura = 6; 
    bool lido = false;
    int tentativas = 0;

    // Tenta ler por no máximo 2 segundos (20 tentativas de 100ms)
    while (!lido && tentativas < 20) {
        if (CFHid_ReadCardG2(0xFF, Password, banco, endereco, tamanhoDaLeitura, bufferSaida) == 1) {
            lido = true;
        } else {
            usleep(100000); 
            tentativas++;
        }
    }
    
    if (!lido) {
        cout << " [!] Nao foi possivel ler o banco " << (int)banco << ". Tag fora de alcance?" << endl;
    }
}

void imprimirResultado(const string& rotulo, unsigned char* dados) {
    cout << rotulo;
    for (int i = 0; i < 12; i++) {
        printf("%02X", dados[i]);
    }
    cout << endl;
}

// =====================================================================
// CORPO PRINCIPAL DO PROGRAMA
// =====================================================================

int main() {
    cout << "\n--- Leitor sob Controle Manual Absoluto ---" << endl;
    
    // 1. Inicia e trava o sensor
    if (!prepararLeitor()) return 1; 

    // 2. Aguarda a sua autorização (ENTER)
    cout << "\n1) Posicione a etiqueta no leitor." << endl;
    cout << "2) Pressione [ENTER] para fazer a leitura..." << endl;
    
    string dummy;
    getline(cin, dummy); // Segura o programa até o Enter ser apertado

    cout << "\nLendo dados..." << endl;
    unsigned char TIDData[12] = {0};
    unsigned char EPCData[12] = {0};

    // 3. Executa a leitura
    lerMemoriaDaTag(2, 0, TIDData); // Lê a Identidade de Fábrica
    lerMemoriaDaTag(1, 2, EPCData); // Lê o Conteúdo Gravado

    // 4. Trava o sensor novamente por garantia
    CFHid_StopRead(0xFF);
    usleep(100000);

    // 5. Mostra os dados de forma limpa
    cout << "\n==================================================" << endl;
    imprimirResultado("TID (Identidade de Fabrica) : ", TIDData);
    imprimirResultado("EPC (Conteudo Gravado)      : ", EPCData);
    cout << "==================================================" << endl;

    // 6. Passo final de segurança para não quebrar o terminal
    cout << "\n>>> ATENCAO: Retire a etiqueta do leitor AGORA." << endl;
    cout << ">>> Apos retirar, pressione [ENTER] para encerrar." << endl;
    getline(cin, dummy); // Segura o programa até o último Enter

    // Limpa o terminal, devolve o leitor ao modo de teclado e fecha
    tcflush(STDIN_FILENO, TCIFLUSH); 
    CFHid_StartRead(0xFF);           
    CFHid_CloseDevice();             
    
    return 0;
}

