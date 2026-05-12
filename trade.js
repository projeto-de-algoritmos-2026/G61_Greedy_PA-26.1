import { ctx } from './map.js';
import { player } from './player.js';

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
    // preço do item no NPC
    // =========================================

    const precoNovo =
        npc.prices[item.id] || 0;

    // =========================================
    // valor atual da mochila do NPC
    // =========================================

    let valorAtual = 0;

    let pesoAtual = 0;

    npc.inventory.items.forEach(invItem => {

        const preco =
            npc.prices[invItem.id] || 0;

        valorAtual +=
            preco * invItem.quantidadeKg;

        pesoAtual +=
            invItem.quantidadeKg;
    });

    // =========================================
    // densidade econômica atual
    // valor por kg
    // =========================================

    const eficienciaAtual =
        pesoAtual > 0
            ? valorAtual / pesoAtual
            : 0;

    // =========================================
    // simula adicionar item
    // =========================================

    const novoPeso =
        pesoAtual + item.quantidadeKg;

    // mochila cheia
    if (novoPeso > npc.inventory.maxWeight) {

        tradeState.mensagem =
            `${npc.nome} está sem espaço`;

        return;
    }

    const novoValor =
        valorAtual +
        (precoNovo * item.quantidadeKg);

    const novaEficiencia =
        novoValor / novoPeso;

    // =========================================
    // decisão knapsack
    // =========================================

    const aceita =
        novaEficiencia >= eficienciaAtual;

    if (aceita) {

        player.inventory.transferTo(
            npc.inventory,
            item.id,
            item.quantidadeKg
        );

        tradeState.mensagem =
            `${npc.nome} aceitou ${item.nome}`;

    } else {

        tradeState.mensagem =
            `${npc.nome} rejeitou ${item.nome}`;
    }
}