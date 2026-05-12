import { ctx } from './map.js';
import { player } from './player.js';
import { evaluateTrade } from "./knapsack.js";

export const tradeState = {

    ativo: false,

    npcAtual: null,

    itemSelecionado: 0,

    mensagem: ""
};

export function abrirTrade(npc) {

    tradeState.ativo = true;

    tradeState.npcAtual = npc;

    tradeState.itemSelecionado = 0;

    tradeState.mensagem = "";
}


export function fecharTrade() {

    tradeState.ativo = false;
}

export function drawTradeUI() {

    if (!tradeState.ativo) return;

    const npc = tradeState.npcAtual;

    ctx.fillStyle = "black";

    ctx.fillRect(50, 50, 420, 320);

    ctx.fillStyle = "white";

    ctx.font = "16px Arial";

    // =========================================
    // TÍTULO
    // =========================================

    ctx.fillText(
        `Troca com ${npc.nome}`,
        70,
        80
    );

    // =========================================
    // PESO INVENTÁRIO PLAYER
    // =========================================

    ctx.fillText(
        `Carga: ${player.inventory.getCurrentWeight()}kg / ${player.inventory.maxWeight}kg`,
        70,
        110
    );

    // =========================================
    // VALOR TOTAL
    // =========================================

    let valorTotal = 0;

    player.inventory.items.forEach(item => {

        const precoKg =
            npc.prices[item.id] || 0;

        valorTotal +=
            precoKg * item.quantidadeKg;
    });

    ctx.fillText(
        `Valor total: R$ ${valorTotal.toFixed(2)}`,
        70,
        140
    );

    // =========================================
    // ITENS
    // =========================================

    player.inventory.items.forEach((item, index) => {

        const selecionado =
            index === tradeState.itemSelecionado
                ? ">"
                : "";

        const precoKg =
            npc.prices[item.id] || 0;

        const valorItem =
            precoKg * item.quantidadeKg;

        ctx.fillText(
            `${selecionado} ${item.nome}`,
            70,
            190 + index * 30
        );

        ctx.fillText(
            `${item.quantidadeKg}kg`,
            220,
            190 + index * 30
        );

        ctx.fillText(
            `R$ ${valorItem.toFixed(2)}`,
            300,
            190 + index * 30
        );
    });

    // =========================================
    // MENSAGEM
    // =========================================

    ctx.fillStyle = "#00FF88";

    ctx.fillText(
        tradeState.mensagem,
        70,
        280
    );

    // =========================================
    // CONTROLES
    // =========================================

    ctx.fillStyle = "white";

    ctx.fillText(
        "↑ ↓ selecionar | ENTER trocar | ESC sair",
        70,
        310
    );
}

export function trocarItem() {

    const npc = tradeState.npcAtual;

    const item =
        player.inventory.items[
            tradeState.itemSelecionado
        ];

    if (!item) return;

    // =========================================
    // espaço disponível no NPC
    // =========================================

    const pesoAtual =
        npc.inventory.getCurrentWeight();

    const espacoLivre =
        npc.inventory.maxWeight -
        pesoAtual;

    // sem espaço
    if (espacoLivre <= 0) {

        tradeState.mensagem =
            `${npc.nome} está sem espaço`;

        return;
    }

    // =========================================
    // quantidade máxima que cabe
    // =========================================

    const quantidadeAceita =
        Math.min(
            item.quantidadeKg,
            espacoLivre
        );

    // =========================================
    // item oferecido
    // =========================================

    const itemOffered = {

        id: item.id,

        weight: quantidadeAceita,

        value:
            quantidadeAceita *
            (npc.prices[item.id] || 0)
    };

    // =========================================
    // item "removido"
    // usamos dummy
    // =========================================

    const itemWanted = {

        id: -1
    };

    // =========================================
    // itens atuais do NPC
    // =========================================

    const npcItems =
        npc.inventory.items.map(i => ({

            id: i.id,

            weight: i.quantidadeKg,

            value:
                i.quantidadeKg *
                (npc.prices[i.id] || 0)
        }));

    // =========================================
    // avaliar troca
    // =========================================

    const result =
        evaluateTrade(

            {
                items: npcItems,
                capacity:
                    npc.inventory.maxWeight
            },

            itemOffered,

            itemWanted
        );

// =========================================
// decisão
// =========================================

if (result.accept) {

    // =====================================
    // player -> npc
    // =====================================

    player.inventory.transferTo(

        npc.inventory,

        item.id,

        quantidadeAceita
    );

    // =====================================
    // npc -> player
    // pega item aleatório do npc
    // =====================================

    const npcItem =
        npc.inventory.items[
            Math.floor(
                Math.random() *
                npc.inventory.items.length
            )
        ];

    if (npcItem) {

        // quanto o player consegue carregar
        const playerPesoAtual =
            player.inventory.getCurrentWeight();

        const playerEspacoLivre =
            player.inventory.maxWeight -
            playerPesoAtual;

        // quantidade máxima possível
        const quantidadeRecebida =
            Math.min(
                npcItem.quantidadeKg,
                playerEspacoLivre
            );

        // transfere
        if (quantidadeRecebida > 0) {

            npc.inventory.transferTo(

                player.inventory,

                npcItem.id,

                quantidadeRecebida
            );
        }

        tradeState.mensagem =
            `${npc.nome} trocou ${quantidadeAceita}kg de ${item.nome} por ${quantidadeRecebida}kg de ${npcItem.nome}`;

    } else {

        tradeState.mensagem =
            `${npc.nome} aceitou ${item.nome}`;
    }

} else {

    tradeState.mensagem =
        `${npc.nome} rejeitou ${item.nome}`;
}

console.log(result.reason);
}