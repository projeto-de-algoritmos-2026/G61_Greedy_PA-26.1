// inventory.js
export class Inventory {
    constructor(capacity = 10) {
        this.items = [];      // array de objetos { id, nome, quantidade }
        this.capacity = capacity;
    }

    // Adicionar item (ou aumentar quantidade se já existir)
    addItem(itemId, nome, quantidade = 1) {
        const existing = this.items.find(i => i.id === itemId);
        if (existing) {
            existing.quantidade += quantidade;
        } else {
            if (this.items.length >= this.capacity) {
                console.warn("Inventário cheio!");
                return false;
            }
            this.items.push({ id: itemId, nome, quantidade });
        }
        return true;
    }

    // Remover quantidade específica de um item
    removeItem(itemId, quantidade = 1) {
        const index = this.items.findIndex(i => i.id === itemId);
        if (index === -1) return false;
        
        const item = this.items[index];
        if (item.quantidade > quantidade) {
            item.quantidade -= quantidade;
        } else if (item.quantidade === quantidade) {
            this.items.splice(index, 1);
        } else {
            return false; // não tem quantidade suficiente
        }
        return true;
    }

    // Verificar se possui pelo menos X de um item
    hasItem(itemId, quantidade = 1) {
        const item = this.items.find(i => i.id === itemId);
        return item ? item.quantidade >= quantidade : false;
    }

    // Obter quantidade atual de um item
    getQuantidade(itemId) {
        const item = this.items.find(i => i.id === itemId);
        return item ? item.quantidade : 0;
    }

    // Listar todos os itens (para exibir no UI)
    listItems() {
        return this.items.map(i => `${i.nome} x${i.quantidade}`);
    }

    // Transferir item de um inventário para outro
    transferTo(otherInventory, itemId, quantidade = 1) {
        if (!this.hasItem(itemId, quantidade)) return false;
        const item = this.items.find(i => i.id === itemId);
        if (otherInventory.addItem(itemId, item.nome, quantidade)) {
            this.removeItem(itemId, quantidade);
            return true;
        }
        return false;
    }

    // Limpar inventário
    clear() {
        this.items = [];
    }
}