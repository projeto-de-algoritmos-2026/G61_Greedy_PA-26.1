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

drawMap();