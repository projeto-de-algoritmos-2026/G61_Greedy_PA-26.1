// main.js — ponto de entrada do JavaScript

import { inputState, initInputButtons } from './gamepad.js';
import { initializeCanvas, drawMap, ctx, canvas } from './map.js';
import { drawPlayer, handleInput, player, keys } from './player.js';
import { drawNPC, getNPCsProximos } from './npc.js';
import {
    tradeState,
    abrirTrade,
    fecharTrade,
    trocarItem,
    drawTradeUI
} from './trade.js';

document.addEventListener("DOMContentLoaded", initInputButtons);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Projeto iniciado!');
  initializeCanvas();
  gameLoop();
});

// Loop do jogo
function gameLoop() {
  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const proximos =
    getNPCsProximos(
        player.x,
        player.y
    );
  // console.log("proximos:", proximos)

  if (
      proximos.length > 0 &&
      keys["x"] &&
      !tradeState.ativo
  ) {

      abrirTrade(proximos[0]);

      keys["x"] = false;
  }
  
  // Desenha o mapa e o jogador
  drawMap();
  drawPlayer();
  drawNPC();
  drawTradeUI();
  
  // Processa entrada do jogador
  handleInput();

  if (tradeState.ativo) {

    if (keys["arrowup"]) {

        tradeState.itemSelecionado--;

        if (tradeState.itemSelecionado < 0) {

            tradeState.itemSelecionado =
                player.inventory.items.length - 1;
        }

        keys["arrowup"] = false;
    }

    if (keys["arrowdown"]) {

        tradeState.itemSelecionado++;

        if (
            tradeState.itemSelecionado >=
            player.inventory.items.length
        ) {

            tradeState.itemSelecionado = 0;
        }

        keys["arrowdown"] = false;
    }

    if (keys["enter"]) {

        trocarItem();

        keys["enter"] = false;
    }

    if (keys["escape"]) {

        fecharTrade();

        keys["escape"] = false;
    }
  }
  
  // Continua o loop
  requestAnimationFrame(gameLoop);
}