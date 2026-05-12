// map.js — Gerencia o mapa e sua renderização

export const tileSize = 32;

export const mapData = [
  [0,0,0,0,0,0,0,0],
  [0,1,1,1,0,0,0,0],
  [0,1,0,1,0,1,1,0],
  [0,1,0,1,0,1,0,0],
  [0,1,1,1,0,1,0,0],
  [0,0,0,0,0,1,0,0],
];

export const colors = {
  0: "#4CAF50", // verde
  1: "#8B5A2B"  // marrom
};

// Canvas e contexto
export const canvas = document.getElementById("map");
export const ctx = canvas.getContext("2d");

// Inicializa o canvas com as dimensões do mapa
export function initializeCanvas() {
  canvas.width = mapData[0].length * tileSize;
  canvas.height = mapData.length * tileSize;
}

// Função para desenhar o mapa
export function drawMap() {
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
