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
    const rectX = 50, rectY = 50, rectW = 420, rectH = 400;

    // Salva o contexto e aplica clipping
    ctx.save();
    ctx.beginPath();
    ctx.rect(rectX, rectY, rectW, rectH);
    ctx.clip();

    // Fundo preto
    ctx.fillStyle = "black";
    ctx.fillRect(rectX, rectY, rectW, rectH);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";

    // =========================================
    // TÍTULO
    // =========================================
    ctx.fillText(`Troca com ${npc.nome}`, rectX + 20, rectY + 30);

    // =========================================
    // PESO INVENTÁRIO PLAYER
    // =========================================
    ctx.fillText(
        `Carga: ${player.inventory.getCurrentWeight()}kg / ${player.inventory.maxWeight}kg`,
        rectX + 20,
        rectY + 60
    );

    // =========================================
    // VALOR TOTAL
    // =========================================
    let valorTotal = 0;
    player.inventory.items.forEach(item => {
        const precoKg = npc.prices[item.id] || 0;
        valorTotal += precoKg * item.quantidadeKg;
    });
    ctx.fillText(
        `Valor total: R$ ${valorTotal.toFixed(2)}`,
        rectX + 20,
        rectY + 90
    );

    // =========================================
    // CABEÇALHO DA LISTA
    // =========================================
    ctx.fillStyle = "#CCCCCC";
    ctx.fillText("Item", rectX + 20, rectY + 130);
    ctx.fillText("Peso", rectX + 180, rectY + 130);
    ctx.fillText("Valor", rectX + 280, rectY + 130);
    ctx.fillStyle = "white";

    // =========================================
    // LISTA DE ITENS (com limite de altura)
    // =========================================
    const lineHeight = 25;
    const startY = rectY + 160;
    const maxY = rectY + rectH - 70; // espaço reservado para mensagem e controles
    let currentY = startY;

    // Número máximo de itens que cabem
    const maxItems = Math.floor((maxY - startY) / lineHeight);
    const itemsToShow = player.inventory.items.slice(0, maxItems);

    itemsToShow.forEach((item, idx) => {
        const selecionado = (idx === tradeState.itemSelecionado) ? ">" : " ";
        let nomeItem = item.nome;
        // Trunca nome se muito longo (aprox. 15 caracteres)
        if (ctx.measureText) {
            const maxWidth = 150;
            let width = ctx.measureText(nomeItem).width;
            while (width > maxWidth && nomeItem.length > 3) {
                nomeItem = nomeItem.slice(0, -1);
                width = ctx.measureText(nomeItem + "...").width;
            }
            if (nomeItem !== item.nome) nomeItem += "...";
        }
        const precoKg = npc.prices[item.id] || 0;
        const valorItem = precoKg * item.quantidadeKg;

        ctx.fillStyle = (idx === tradeState.itemSelecionado) ? "#FFFF00" : "white";
        ctx.fillText(`${selecionado} ${nomeItem}`, rectX + 20, currentY);
        ctx.fillText(`${item.quantidadeKg}kg`, rectX + 180, currentY);
        ctx.fillText(`R$ ${valorItem.toFixed(2)}`, rectX + 280, currentY);

        currentY += lineHeight;
    });

    // Se houver mais itens do que cabem, exibe indicação
    if (player.inventory.items.length > maxItems) {
        ctx.fillStyle = "#AAAAAA";
        ctx.fillText("... mais itens não exibidos ...", rectX + 20, currentY);
        currentY += lineHeight;
    }

    // =========================================
    // MENSAGEM
    // =========================================
    ctx.fillStyle = "#00FF88";
    ctx.fillText(tradeState.mensagem, rectX + 20, rectY + rectH - 50);

    // =========================================
    // CONTROLES
    // =========================================
    ctx.fillStyle = "white";
    ctx.fillText("↑ ↓ selecionar | ENTER trocar | ESC sair", rectX + 20, rectY + rectH - 20);

    // Restaura o contexto (remove clipping)
    ctx.restore();
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