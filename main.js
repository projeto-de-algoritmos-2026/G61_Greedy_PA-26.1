// main.js — ponto de entrada do JavaScript

import { inputState, initInputButtons } from './gamepad.js';

document.addEventListener("DOMContentLoaded", initInputButtons);

document.addEventListener('DOMContentLoaded', () => {
  console.log('Projeto iniciado!');
});

const tileSize = 32;

const mapData = [
  [0,0,0,0,0,0,0,0],
  [0,1,1,1,0,0,0,0],
  [0,1,0,1,0,1,1,0],
  [0,1,0,1,0,1,0,0],
  [0,1,1,1,0,1,0,0],
  [0,0,0,0,0,1,0,0],
];

const colors = {
  0: "#4CAF50", // verde
  1: "#8B5A2B"  // marrom
};

// Objeto do jogador
const player = {
  x: 1, // coluna (começa em um tile navegável)
  y: 1, // linha
  width: tileSize,
  height: tileSize,
  color: "#FF0000" // vermelho
};

const canvas = document.getElementById("map");
const ctx = canvas.getContext("2d");

canvas.width = mapData[0].length * tileSize;
canvas.height = mapData.length * tileSize;

function drawMap() {
  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {

      const tile = mapData[y][x];

      ctx.fillStyle = colors[tile];
      ctx.fillRect(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );

      // grade opcional
      ctx.strokeStyle = "#00000022";
      ctx.strokeRect(
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
  }
}

// Função para desenhar o jogador
function drawPlayer() {
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



// Função para mover o jogador
// Função para mover o jogador respeitando apenas os limites externos do mapa
function movePlayer(dx, dy) {
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
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Função para processar movimento a cada frame
function handleInput() {
  if (keys['w']) movePlayer(0, -1); // Cima
  if (keys['s']) movePlayer(0, 1);  // Baixo
  if (keys['a']) movePlayer(-1, 0); // Esquerda
  if (keys['d']) movePlayer(1, 0);  // Direita
}


// Loop do jogo
function gameLoop() {
  // Limpa o canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Desenha o mapa e o jogador
  drawMap();
  drawPlayer();
  
  // Processa entrada do jogador
  handleInput();
  
  // Continua o loop
  requestAnimationFrame(gameLoop);
}

// Inicia o loop do jogo quando o documento está pronto
gameLoop();