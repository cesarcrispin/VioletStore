/* ==========================================
    pedidos
   Single Responsibility: Solo maneja lógica de pedidos
   ========================================== */

import { ORDER_STATUS } from '../config/constants.js';

export class Order {
    constructor(data) {
        this.id = data.id || this.generateOrderId();
        this.userId = data.userId;
        this.items = data.items || [];
        this.subtotal = data.subtotal || 0;
        this.discount = data.discount || 0;
        this.total = data.total || 0;
        this.status = data.status || ORDER_STATUS.PROCESSING;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        this.discountCode = data.discountCode || null;
    }

    /**
     * Genera un ID único para el pedido
     * @returns {number}
     */
    generateOrderId() {
        return Date.now();
    }

    /**
     * Obtiene la fecha formateada
     * @returns {string}
     */
    getFormattedDate() {
        return new Date(this.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Obtiene la fecha corta
     * @returns {string}
     */
    getShortDate() {
        return new Date(this.createdAt).toLocaleDateString('es-ES');
    }

    /**
     * Actualiza el estado del pedido
     * @param {string} newStatus 
     */
    updateStatus(newStatus) {
        this.status = newStatus;
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Verifica si el pedido puede ser cancelado
     * @returns {boolean}
     */
    canBeCancelled() {
        return this.status === ORDER_STATUS.PROCESSING;
    }

    /**
     * Verifica si el pedido está completado
     * @returns {boolean}
     */
    isCompleted() {
        return this.status === ORDER_STATUS.DELIVERED;
    }

    /**
     * Verifica si el pedido está cancelado
     * @returns {boolean}
     */
    isCancelled() {
        return this.status === ORDER_STATUS.CANCELLED;
    }

    /**
     * Obtiene el número total de items
     * @returns {number}
     */
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Obtiene el total formateado
     * @returns {string}
     */
    getFormattedTotal() {
        return `$${this.total.toLocaleString()}`;
    }

    /**
     * Calcula el ahorro si hay descuento
     * @returns {number}
     */
    getSavings() {
        return this.discount;
    }

    /**
     * Serializa el pedido a JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            subtotal: this.subtotal,
            discount: this.discount,
            total: this.total,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            discountCode: this.discountCode
        };
    }

    /**
     * Crea un pedido desde el carrito
     * @param {Cart} cart 
     * @param {string} userId 
     * @returns {Order}
     */
    static fromCart(cart, userId) {
        return new Order({
            userId: userId,
            items: cart.getItems().map(item => ({
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity
            })),
            subtotal: cart.getSubtotal(),
            discount: cart.getDiscountAmount(),
            total: cart.getTotal(),
            discountCode: cart.discountCode
        });
    }

    /**
     * Carga un pedido desde JSON
     * @param {Object} data 
     * @returns {Order}
     */
    static fromJSON(data) {
        return new Order(data);
    }
}