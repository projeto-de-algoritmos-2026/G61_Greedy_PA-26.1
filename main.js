// main.js — ponto de entrada do JavaScript

import { inputState, initInputButtons } from './gamepad.js';
import { initializeCanvas, drawMap, ctx, canvas } from './map.js';
import { drawPlayer, handleInput } from './player.js';
import { drawNPC } from './npc.js';

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
  
  // Desenha o mapa e o jogador
  drawMap();
  drawPlayer();
  drawNPC();
  
  // Processa entrada do jogador
  handleInput();
  
  // Continua o loop
  requestAnimationFrame(gameLoop);
}