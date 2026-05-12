import { tileSize, ctx, canvas, mapData } from './map.js';
import { Inventory } from './inventory.js';

export const ITEM_TYPES = [

    {
        id: 1,
        nome: "Milho"
    },

    {
        id: 2,
        nome: "Feijão"
    },

    {
        id: 3,
        nome: "Abóbora"
    }
];

export const npcs = [
    {
        id: 0,
        nome: "Guarda",
        x: 5,
        y: 3,
        color: "#223399",
        width: tileSize,
        height: tileSize,
        emoji: "💂", // guarda
        dialogo: [
            "Bem-vindo à vila!",
            "Os monstros estão atacando ao leste.",
            "Sou vendedor de abóbora."
        ],
        jaConversou: false,
        inventory: new Inventory(30),
        prices: {
            1: 12.0, // milho
            2: 7.0, // feijão
            3: 4.5, // abóbora
        } 
    },
    {
        id: 1,
        nome: "Vilã",
        x: 8,
        y: 6,
        color: "#229933",
        width: tileSize,
        height: tileSize,
        emoji: "👩", // mulher
        dialogo: [
            "Olá vizinho!",
            "Preciso de ajuda para encontrar minha enxada.",
            "Sou vendendor de milho"
        ],
        jaConversou: false,
        inventory: new Inventory(30),
        prices: {
            1: 4.5, // milho
            2: 7.0, // feijão
            3: 12.0 // abóbora
        } 
    },
    {
        id: 2,
        nome: "Vendedor",
        x: 3,
        y: 8,
        color: "#992233",
        width: tileSize,
        height: tileSize,
        emoji: "🧔", // cara com bigode
        dialogo: [
            "Venha comprar meus itens!",
            "Volte quando tiver algo.",
            "Vendo feijão"
        ],
        jaConversou: false,
        inventory: new Inventory(30),
        prices: {
            1: 7.0, // milho
            2: 4.5, // feijão
            3: 12.0 // abóbora
        } 
    }
];

const WALKABLE_VALUES = [0];

function randomizeNPCInventory(npc) {

    // deixa pelo menos 15kg livres
    const maxWeightToFill =
        npc.inventory.maxWeight - 15;

    let currentWeight = 0;

    while (currentWeight < maxWeightToFill) {

        // item aleatório
        const randomItem =
            ITEM_TYPES[
                Math.floor(
                    Math.random() *
                    ITEM_TYPES.length
                )
            ];

        // quantidade aleatória
        const quantidadeKg =
            Math.floor(
                Math.random() * 5
            ) + 1;

        // impedir ultrapassar limite
        if (
            currentWeight + quantidadeKg >
            maxWeightToFill
        ) {

            break;
        }

        npc.inventory.addItem(
            randomItem.id,
            randomItem.nome,
            quantidadeKg
        );

        currentWeight += quantidadeKg;
    }
}

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

                randomizeNPCInventory(npc);

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
    const fontSize = Math.floor(tileSize * 0.75);
    ctx.font = `${fontSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    npcs.forEach(npc => {
        ctx.fillText(
            npc.emoji,
            npc.x + npc.width / 2,
            npc.y + npc.height / 2
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
    // console.log(distancia);

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