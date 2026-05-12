# Escambo

Número da Lista: 61<br>
Conteúdo da Disciplina: Greedy<br>

## Alunos
|Matrícula | Aluno |
| -- | -- |
| 231026311 |  Eduardo Valadares |
| 231027195  |  Caio Venâncio|

## Sobre 
Este projeto é um jogo 2D desenvolvido em JavaScript puro (Vanilla JS) e HTML5 Canvas. Nele, o jogador controla um personagem que explora um mapa aberto, coleta itens e interage com mercadores (NPCs) para realizar negociações e trocas comerciais. 

O núcleo do projeto para a disciplina é a aplicação do clássico **Problema da Mochila (Knapsack Problem)** utilizando a estratégia de **Algoritmos Ambiciosos (Greedy)**. No sistema de comércio (`trade.js` e `knapsack.js`), o algoritmo ajuda o jogador a otimizar o seu inventário de forma automática, calculando a melhor combinação de itens (custo-benefício) para maximizar o valor de venda ou coleta sem exceder a capacidade máxima de peso da mochila do personagem (`inventory.js`).

## Instalação 
**Linguagens**: HTML5, CSS3, JavaScript (Vanilla)<br>
**Bibliotecas/Frameworks**: Nenhuma dependência externa.<br>

Por ser um projeto web nativo, a instalação é muito simples e não requer gerenciadores de pacotes (como npm).

1. Clone o repositório para a sua máquina:
   ```bash
   git clone https://github.com/projeto-de-algoritmos-2026/G61_Greedy_PA-26.1.git

Como Jogar
Movimentação: Utilize as teclas W, A, S e D do teclado para navegar pelo mapa, ou utilize o gamepad virtual disponível na tela para jogar em dispositivos móveis.

Inventário: Pressione a tecla configurada (ou o botão na interface) para visualizar a capacidade da sua mochila e os itens guardados.

Sistema de Trocas (Trade): Ao encostar/interagir com um NPC pelo mapa, o menu de troca é aberto. Aqui o algoritmo Greedy entra em ação: ele avaliará a densidade de valor dos itens (Valor / Peso) e selecionará a combinação ideal para maximizar o lucro da sua transação.

 ## Vídeo da Apresentação
 **https://youtu.be/M0Wg68GR6tQ**
