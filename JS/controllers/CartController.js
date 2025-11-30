/* ==========================================
   Controlador del carrito de compras
   ========================================== */

import { Cart } from '../models/Cart.js';
import { StorageService } from '../services/StorageService.js';
import { NotificationService } from '../services/NotificationService.js';
import { EVENTS } from '../config/constants.js';

export class CartController {
    constructor() {
        this.cart = new Cart();
        this.storageService = new StorageService();
        this.notificationService = new NotificationService();
        this.loadCartFromStorage();
    }

    /**
     * Carga el carrito desde el almacenamiento
     */
    loadCartFromStorage() {
        const cartData = this.storageService.getCart();
        if (cartData) {
            this.cart.fromJSON(cartData);
        }
    }

    /**
     * Guarda el carrito en el almacenamiento
     */
    saveCart() {
        this.storageService.saveCart(this.cart);
        this.emitCartUpdated();
    }

    /**
     * Agrega un producto al carrito
     * @param {Product} product 
     * @param {number} quantity 
     */
    addProduct(product, quantity = 1) {
        if (!product.isInStock()) {
            this.notificationService.error('Producto sin stock');
            return;
        }

        this.cart.addItem(product, quantity);
        this.saveCart();
        this.notificationService.success('Producto agregado al carrito');
    }

    /**
     * Remueve un producto del carrito
     * @param {number} productId 
     */
    removeProduct(productId) {
        this.cart.removeItem(productId);
        this.saveCart();
        this.notificationService.info('Producto eliminado del carrito');
    }

    /**
     * Actualiza la cantidad de un producto
     * @param {number} productId 
     * @param {number} quantity 
     */
    updateQuantity(productId, quantity) {
        if (quantity < 0) return;

        if (quantity === 0) {
            this.removeProduct(productId);
            return;
        }

        this.cart.updateQuantity(productId, quantity);
        this.saveCart();
    }

    /**
     * Incrementa la cantidad de un producto
     * @param {number} productId 
     */
    incrementQuantity(productId) {
        const item = this.cart.findItem(productId);
        if (item) {
            this.updateQuantity(productId, item.quantity + 1);
        }
    }

    /**
     * Decrementa la cantidad de un producto
     * @param {number} productId 
     */
    decrementQuantity(productId) {
        const item = this.cart.findItem(productId);
        if (item) {
            this.updateQuantity(productId, item.quantity - 1);
        }
    }

    /**
     * Aplica un código de descuento
     * @param {string} code 
     * @param {Object} discountData 
     * @returns {boolean}
     */
    applyDiscountCode(code, discountData) {
        if (!discountData) {
            this.notificationService.error('Código de descuento inválido');
            return false;
        }

        this.cart.applyDiscount(code, discountData.discount);
        this.saveCart();
        
        const savings = this.cart.getDiscountAmount();
        this.notificationService.success(
            `¡Descuento aplicado! Ahorras $${savings.toLocaleString()}`
        );
        return true;
    }

    /**
     * Remueve el descuento aplicado
     */
    removeDiscount() {
        this.cart.removeDiscount();
        this.saveCart();
        this.notificationService.info('Descuento removido');
    }

    /**
     * Limpia el carrito
     */
    clearCart() {
        this.cart.clear();
        this.saveCart();
        this.notificationService.info('Carrito vaciado');
    }

    /**
     * Obtiene el carrito
     * @returns {Cart}
     */
    getCart() {
        return this.cart;
    }

    /**
     * Obtiene los items del carrito
     * @returns {Array}
     */
    getItems() {
        return this.cart.getItems();
    }

    /**
     * Obtiene el total
     * @returns {number}
     */
    getTotal() {
        return this.cart.getTotal();
    }

    /**
     * Obtiene el subtotal
     * @returns {number}
     */
    getSubtotal() {
        return this.cart.getSubtotal();
    }

    /**
     * Obtiene el monto del descuento
     * @returns {number}
     */
    getDiscountAmount() {
        return this.cart.getDiscountAmount();
    }

    /**
     * Obtiene el total de items
     * @returns {number}
     */
    getTotalItems() {
        return this.cart.getTotalItems();
    }

    /**
     * Verifica si el carrito está vacío
     * @returns {boolean}
     */
    isEmpty() {
        return this.cart.isEmpty();
    }

    /**
     * Verifica si un producto está en el carrito
     * @param {number} productId 
     * @returns {boolean}
     */
    hasProduct(productId) {
        return this.cart.findItem(productId) !== undefined;
    }

    /**
     * Obtiene la cantidad de un producto en el carrito
     * @param {number} productId 
     * @returns {number}
     */
    getProductQuantity(productId) {
        const item = this.cart.findItem(productId);
        return item ? item.quantity : 0;
    }

    /**
     * Emite evento de carrito actualizado
     */
    emitCartUpdated() {
        const event = new CustomEvent(EVENTS.CART_UPDATED, {
            detail: {
                cart: this.cart,
                totalItems: this.getTotalItems(),
                total: this.getTotal()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Valida el carrito antes del checkout
     * @returns {Object}
     */
    validateCheckout() {
        const errors = [];

        if (this.isEmpty()) {
            errors.push('El carrito está vacío');
        }

        // Validar stock de cada item
        this.getItems().forEach(item => {
            if (!item.product.isInStock()) {
                errors.push(`${item.product.name} está sin stock`);
            } else if (item.quantity > item.product.stock) {
                errors.push(`${item.product.name} tiene stock insuficiente`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}