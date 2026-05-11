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

// Função para validar se uma posição é navegável (colisão)
function isWalkable(x, y) {
  // Verifica se está dentro dos limites do mapa
  if (y < 0 || y >= mapData.length || x < 0 || x >= mapData[y].length) {
    return false;
  }
  // Verifica se o tile é navegável (1 = navegável, 0 = parede/obstáculo)
  return mapData[y][x] === 1;
}

// Função para mover o jogador
function movePlayer(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  
  // Valida a nova posição antes de mover
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