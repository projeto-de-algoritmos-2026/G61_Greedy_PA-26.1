// inventory.js

export class Inventory {

    constructor(maxWeight = 50) {

        // capacidade máxima em kg
        this.maxWeight = maxWeight;

        // itens armazenados
        this.items = [];

        // estrutura:
        // {
        //   id,
        //   nome,
        //   quantidadeKg
        // }
    }

    // =========================================
    // peso atual
    // =========================================

    getCurrentWeight() {

        return this.items.reduce(
            (total, item) =>
                total + item.quantidadeKg,
            0
        );
    }

    // =========================================
    // espaço restante
    // =========================================

    getRemainingWeight() {

        return this.maxWeight -
               this.getCurrentWeight();
    }

    // =========================================
    // adicionar item
    // =========================================

    addItem(itemId, nome, quantidadeKg) {

        // verifica peso
        if (
            this.getCurrentWeight() +
            quantidadeKg >
            this.maxWeight
        ) {

            console.warn(
                "Peso máximo excedido!"
            );

            return false;
        }

        // procura item existente
        const existing =
            this.items.find(
                i => i.id === itemId
            );

        if (existing) {

            existing.quantidadeKg += quantidadeKg;

        } else {

            this.items.push({
                id: itemId,
                nome,
                quantidadeKg
            });
        }

        return true;
    }

    // =========================================
    // remover item
    // =========================================

    removeItem(itemId, quantidadeKg) {

        const item =
            this.items.find(
                i => i.id === itemId
            );

        if (!item) return false;

        if (
            item.quantidadeKg <
            quantidadeKg
        ) {

            return false;
        }

        item.quantidadeKg -= quantidadeKg;

        // remove item vazio
        if (item.quantidadeKg <= 0) {

            this.items =
                this.items.filter(
                    i => i.id !== itemId
                );
        }

        return true;
    }

    // =========================================
    // possui quantidade?
    // =========================================

    hasItem(itemId, quantidadeKg) {

        const item =
            this.items.find(
                i => i.id === itemId
            );

        return item &&
               item.quantidadeKg >= quantidadeKg;
    }

    // =========================================
    // transferir
    // =========================================

    transferTo(
        otherInventory,
        itemId,
        quantidadeKg
    ) {

        const item =
            this.items.find(
                i => i.id === itemId
            );

        if (!item) return false;

        // tenta adicionar
        const added =
            otherInventory.addItem(
                item.id,
                item.nome,
                quantidadeKg
            );

        if (!added) {

            return false;
        }

        // remove do atual
        this.removeItem(
            itemId,
            quantidadeKg
        );

        return true;
    }
}