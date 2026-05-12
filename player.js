// player.js — Gerencia o jogador e suas funções de movimento

import { tileSize, ctx, canvas } from './map.js';
import { Inventory } from './inventory.js';

export const player = {
  x: 1, // coluna (começa em um tile navegável)
  y: 1, // linha
  width: tileSize,
  height: tileSize,
  color: "#FF0000",
  inventory: new Inventory(25)  // vermelho
};

player.inventory.addItem(
    1,
    "Milho",
    25
);

// Função para desenhar o jogador
export function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.x,
    player.y,
    player.width,
    player.height
  );
  
  // Borda do jogador para melhor visualização
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(
    player.x,
    player.y,
    player.width,
    player.height
  );
}

// Função para mover o jogador respeitando os limites externos do mapa
export function movePlayer(dx, dy) {
  let newX = player.x + dx;
  let newY = player.y + dy;
  
  // Limites máximos do mapa em pixels
  const maxX = canvas.width - player.width;
  const maxY = canvas.height - player.height;

  // 1. Eixo X: Impede de sair pela esquerda (0) e pela direita (maxX)
  if (newX < 0) {
    newX = 0;
  } else if (newX > maxX) {
    newX = maxX;
  }

  // 2. Eixo Y: Impede de sair por cima (0) e por baixo (maxY)
  if (newY < 0) {
    newY = 0;
  } else if (newY > maxY) {
    newY = maxY;
  }

  // Aplica a nova posição validada
  player.x = newX;
  player.y = newY;
}

// Sistema de controles com WASD
export const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Função para processar movimento a cada frame
export function handleInput() {
  if (keys['w']) movePlayer(0, -2); // Cima
  if (keys['s']) movePlayer(0, 2);  // Baixo
  if (keys['a']) movePlayer(-2, 0); // Esquerda
  if (keys['d']) movePlayer(2, 0);  // Direita
}
