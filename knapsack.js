// ============================================================
//  knapsack.js — Algoritmo da Mochila Fracionada (Greedy)
// ============================================================

/**
 * Resolve o problema da mochila fracionada.
 * @param {Array}  items    - Array de { id, weight, value } com o valor
 *                            percebido por quem está avaliando
 * @param {number} capacity - Capacidade máxima da mochila
 * @returns {{ selected: Array, totalValue: number, totalWeight: number }}
 */
export function fractionalKnapsack(items, capacity) {
  // Ordena por razão valor/peso decrescente
  const sorted = [...items].map(item => ({
    ...item,
    ratio: item.value / item.weight,
  })).sort((a, b) => b.ratio - a.ratio);

  let remainingCapacity = capacity;
  let totalValue = 0;
  const selected = [];

  for (const item of sorted) {
    if (remainingCapacity <= 0) break;

    const fraction = Math.min(1, remainingCapacity / item.weight);
    totalValue += item.value * fraction;
    remainingCapacity -= item.weight * fraction;

    selected.push({ ...item, fraction });
  }

  return {
    selected,
    totalValue: Math.round(totalValue * 100) / 100,
    totalWeight: capacity - remainingCapacity,
  };
}

/**
 * Avalia se um NPC deve aceitar uma troca proposta pelo jogador.
 * O NPC aceita se o item recebido melhorar o valor total da mochila dele.
 *
 * @param {object} npcKnapsack  - { items: [], capacity: number }
 * @param {object} itemOffered  - item que o jogador oferece (com value percebido pelo NPC)
 * @param {object} itemWanted   - item que o jogador quer do NPC
 * @returns {{ accept: boolean, reason: string }}
 */
export function evaluateTrade(npcKnapsack, itemOffered, itemWanted) {
  const { items, capacity } = npcKnapsack;

  // Valor atual sem o item que seria trocado
  const itemsWithout = items.filter(i => i.id !== itemWanted.id);
  const { totalValue: valueBefore } = fractionalKnapsack(itemsWithout, capacity);

  // Valor após receber o item do jogador
  const itemsAfter = [...itemsWithout, itemOffered];
  const { totalValue: valueAfter } = fractionalKnapsack(itemsAfter, capacity);

  const accept = valueAfter >= valueBefore;
  const reason = accept
    ? `Vantajoso! ${valueAfter.toFixed(1)} ≥ ${valueBefore.toFixed(1)}`
    : `Não vale a pena. ${valueAfter.toFixed(1)} < ${valueBefore.toFixed(1)}`;

  return { accept, reason, valueBefore, valueAfter };
}