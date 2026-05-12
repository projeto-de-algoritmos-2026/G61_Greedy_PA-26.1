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

    ctx.fillStyle = "black";

    ctx.fillRect(50, 50, 300, 250);

    ctx.fillStyle = "white";

    ctx.font = "16px Arial";

    ctx.fillText(
        `Troca com ${tradeState.npcAtual.nome}`,
        70,
        80
    );

    player.inventory.items.forEach((item, index) => {

        const selecionado =
            index === tradeState.itemSelecionado
                ? ">"
                : "";

        ctx.fillText(
            `${selecionado} ${item.nome} x${item.quantidade}`,
            70,
            120 + index * 30
        );
    });

    ctx.fillText(
        tradeState.mensagem,
        70,
        220
    );

    ctx.fillText(
        "ENTER trocar | ESC sair",
        70,
        250
    );
}

export function trocarItem() {

    const npc = tradeState.npcAtual;

    const item =
        player.inventory.items[
            tradeState.itemSelecionado
        ];

    if (!item) return;

    // NPC aceita?
    const aceita =
        npc.wantedItems.includes(item.id);

    // chance opcional
    const sorte =
        Math.random() < 0.8;

    if (aceita && sorte) {

        player.inventory.transferTo(
            npc.inventory,
            item.id,
            1
        );

        tradeState.mensagem =
            `${npc.nome} aceitou ${item.nome}`;

    } else {

        tradeState.mensagem =
            `${npc.nome} rejeitou ${item.nome}`;
    }
}