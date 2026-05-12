import { tileSize, ctx, canvas, mapData } from './map.js';
import { Inventory } from './inventory.js';

export const npcs = [
    {
        id: 0,
        nome: "Guarda",
        x: 5,
        y: 3,
        color: "#223399",
        width: tileSize,
        height: tileSize,
        dialogo: [
            "Bem-vindo à vila!",
            "Os monstros estão atacando ao leste.",
            "Sou vendedor de abóbora."
        ],
        jaConversou: false,
        inventory: new Inventory(4) 
    },
    {
        id: 1,
        nome: "Vilã",
        x: 8,
        y: 6,
        color: "#229933",
        width: tileSize,
        height: tileSize,
        dialogo: [
            "Olá vizinho!",
            "Preciso de ajuda para encontrar minha enxada.",
            "Sou vendendor de enxadas"
        ],
        jaConversou: false,
        inventory: new Inventory(4)
    },
    {
        id: 2,
        nome: "Vendedor",
        x: 3,
        y: 8,
        color: "#992233",
        width: tileSize,
        height: tileSize,
        dialogo: [
            "Venha comprar meus itens!",
            "Volte quando tiver algo.",
            "Vendo feijão"
        ],
        jaConversou: false,
        inventory: new Inventory(4)
    }
];

const WALKABLE_VALUES = [0];

function randomizeNPCPositions(npcsList, mapData, walkableValues, maxAttempts = 1000) {
    const mapHeight = mapData.length;
    const mapWidth = mapData[0].length;
    
    // Lista de células já ocupadas (inclui outros NPCs)
    const occupiedCells = new Set();
    
    for (let npc of npcsList) {
        let placed = false;
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Gera coordenadas aleatórias dentro dos limites do mapa
            const randX = Math.floor(Math.random() * mapWidth * 32);
            const randY = Math.floor(Math.random() * mapHeight * 32);
            const cellKey = `${randX},${randY}`;
            
            // Verifica se a célula é caminhável
            // const tileValue = mapData[randY][randX];
            // const isWalkable = walkableValues.includes(tileValue);
            
            // Verifica se não está ocupada por outro NPC
            const isFree = !occupiedCells.has(cellKey);
            
            if (/*isWalkable &&*/isFree) {
                npc.x = randX;
                npc.y = randY;
                occupiedCells.add(cellKey);
                placed = true;
                break;
            }
        }
        
        if (!placed) {
            console.warn(`Não foi possível posicionar o NPC ${npc.nome} após ${maxAttempts} tentativas.`);
            return false;
        }
    }
    return true;
}

// Uso: gera posições aleatórias respeitando o mapa
randomizeNPCPositions(npcs, mapData, WALKABLE_VALUES);

// Agora npcs terão propriedades x e y preenchidas
console.log(npcs);

export function drawNPC(){
    npcs.forEach(npc => {
        ctx.fillStyle = npc.color;
        ctx.fillRect(
        npc.x,
        npc.y,
        npc.width,
        npc.height
        );
        
        // Borda do jogador para melhor visualização
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(
        npc.x,
        npc.y,
        npc.width,
        npc.height
        );
    })
}

// Função para encontrar NPC por posição
export function encontrarNPCporPosicao(x, y) {
    return npcs.find(npc => npc.x === x && npc.y === y);
}

// Função para verificar se jogador está ao lado do NPC (adjacente)
export function estaProximoDoNPC(playerX, playerY, npcX, npcY) {

    const dx = playerX - npcX;
    const dy = playerY - npcY;

    const distancia = Math.hypot(dx, dy);
    console.log(distancia);

    return distancia < 50;
}

// Função para obter NPCs próximos ao jogador
export function getNPCsProximos(playerX, playerY) {
    return npcs.filter(npc => estaProximoDoNPC(playerX, playerY, npc.x, npc.y));
}

// Função para iniciar diálogo
export function iniciarDialogo(npc) {
    if (!npc) return null;
    
    return {
        nome: npc.nome,
        falas: npc.dialogo,
        indiceAtual: 0
    };
}

// Função para avançar diálogo
export function avancarDialogo(dialogoAtual) {
    if (!dialogoAtual) return null;
    
    dialogoAtual.indiceAtual++;
    
    if (dialogoAtual.indiceAtual >= dialogoAtual.falas.length) {
        return null; // Diálogo acabou
    }
    
    return dialogoAtual;
}