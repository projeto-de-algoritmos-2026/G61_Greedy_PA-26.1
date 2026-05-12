// map.js — Gerencia o mapa e sua renderização

export const tileSize = 48;

// Tipos de tile
export const TILE = {
  GRASS:   0,  // 🌿 grama
  PATH:    1,  // 🟫 caminho de terra
  HOUSE:   2,  // 🛖 casa
  TREE:    3,  // 🌲 árvore
  WELL:    4,  // 🕳️ poço
  MARKET:  5,  // 🧺 mercado
  FIRE:    6,  // 🔥 fogueira
  WALL:    7,  // 🪵 muro/cerca
  FLOWER:  8,  // 🌸 flor decorativa
  WATER:   9,  // 🌊 lago/rio
};

// Emojis por tile
export const tileEmoji = {
  [TILE.GRASS]:  "🌿",
  [TILE.PATH]:   "🟫",
  [TILE.HOUSE]:  "🛖",
  [TILE.TREE]:   "🌲",
  [TILE.WELL]:   "🕳️",
  [TILE.MARKET]: "🧺",
  [TILE.FIRE]:   "🔥",
  [TILE.WALL]:   "🪵",
  [TILE.FLOWER]: "🌸",
  [TILE.WATER]:  "🌊",
};

// Cor de fundo base por tile
export const tileBg = {
  [TILE.GRASS]:  "#5a8a3c",
  [TILE.PATH]:   "#c8a97a",
  [TILE.HOUSE]:  "#c8a97a",
  [TILE.TREE]:   "#3d6b2a",
  [TILE.WELL]:   "#c8a97a",
  [TILE.MARKET]: "#c8a97a",
  [TILE.FIRE]:   "#c8a97a",
  [TILE.WALL]:   "#8a7a6a",
  [TILE.FLOWER]: "#5a8a3c",
  [TILE.WATER]:  "#3a7abf",
};

// Tiles que o jogador pode pisar
export const walkable = new Set([TILE.PATH, TILE.GRASS, TILE.FLOWER]);

// Aliases para facilitar a leitura do mapa
const G  = TILE.GRASS;
const P  = TILE.PATH;
const H  = TILE.HOUSE;
const T  = TILE.TREE;
const W  = TILE.WELL;
const M  = TILE.MARKET;
const F  = TILE.FIRE;
const L  = TILE.WALL;
const FL = TILE.FLOWER;
const WA = TILE.WATER;

// Mapa da vila antiga (20 colunas × 18 linhas)
export const mapData = [
//  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19
  [ T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T], // 0
  [ T, G, G,FL, G, G, G, H, G, G, G, G, H, G, G,FL, G, G, G, T], // 1
  [ T, G, H, G, G,FL, G, G, G, T, T, G, G, G, H, G, G,FL, G, T], // 2
  [ T,FL, G, G, G, G, G, G, G, T, T, G, G, G, G, G, G, G,FL, T], // 3
  [ T, G, G, G, P, P, P, P, P, P, P, P, P, P, G, G, G, G, G, T], // 4
  [ T, G, G, G, P, G, G, G, G, W, G, G, G, P, G, G, G, H, G, T], // 5
  [ T, H, G, G, P, G, H, G, G, G, G, H, G, P, G, G, G, G, G, T], // 6
  [ T, G, G, G, P, G, G, G, G, G, G, G, G, P, G, G,FL, G, G, T], // 7
  [ T, G, G, G, P, P, P, P, F, P, P, P, P, P, G, G, G, G, G, T], // 8
  [ T, G, G, G, P, G, G, G, G, G, G, G, G, P, G, G, G, H, G, T], // 9
  [ T, G,FL, G, P, G, H, G, G, G, G, H, G, P, G,FL, G, G, G, T], // 10
  [ T, G, G, G, P, G, G, G, M, G, G, G, G, P, G, G, G, G, G, T], // 11
  [ T, H, G, G, P, P, P, P, P, P, P, P, P, P, G, G,FL, G, H, T], // 12
  [ T, G, G,FL, G, G, G, G, G, G, G, G, G, G, G, G, G, G, G, T], // 13
  [ T, G, G, G, G, H, G, G, G, G, G, G, H, G, G, G, G, G, G, T], // 14
  [ T,FL, G, G, G, G, G, G, G, T, T, G, G, G, G,FL, G, G, G, T], // 15
  [ T, G, G, G, G, G,FL, G, G, T, T, G, G, G, G, G, G, G,FL, T], // 16
  [ T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T, T], // 17
];

// Canvas e contexto
export const canvas = document.getElementById("map");
export const ctx = canvas.getContext("2d");

// Inicializa o canvas com as dimensões do mapa
export function initializeCanvas() {
  canvas.width  = mapData[0].length * tileSize;
  canvas.height = mapData.length    * tileSize;
}

// Verifica se uma posição (em tiles) é navegável
export function isWalkable(tileX, tileY) {
  if (tileY < 0 || tileY >= mapData.length) return false;
  if (tileX < 0 || tileX >= mapData[tileY].length) return false;
  return walkable.has(mapData[tileY][tileX]);
}

// Desenha o mapa com emojis
export function drawMap() {
  const fontSize = Math.floor(tileSize * 0.75);
  ctx.font = `${fontSize}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let y = 0; y < mapData.length; y++) {
    for (let x = 0; x < mapData[y].length; x++) {
      const tile = mapData[y][x];
      const px   = x * tileSize;
      const py   = y * tileSize;

      // Fundo colorido
      ctx.fillStyle = tileBg[tile];
      ctx.fillRect(px, py, tileSize, tileSize);

      // Emoji centralizado
      ctx.fillText(
        tileEmoji[tile],
        px + tileSize / 2,
        py + tileSize / 2
      );

      // Grade sutil
      ctx.strokeStyle = "#00000018";
      ctx.strokeRect(px, py, tileSize, tileSize);
    }
  }
}