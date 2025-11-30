/* ==========================================
   Vista del carrito de compras
   ========================================== */

import { BaseView } from './BaseView.js';

export class CartView extends BaseView {
    constructor() {
        super('cartView');
        this.cartItems = document.getElementById('cartItems');
        this.cartSummary = document.getElementById('cartSummary');
    }

    /**
     * Renderiza el carrito
     * @param {Object} data 
     */
    render(data) {
        const { items, subtotal, discount, total, isEmpty } = data;

        if (isEmpty) {
            this.renderEmpty();
            return;
        }

        this.renderItems(items);
        this.renderSummary(subtotal, discount, total);
    }

    /**
     * Renderiza el carrito vacío
     */
    renderEmpty() {
        if (this.cartItems) {
            this.cartItems.innerHTML = `
                <div class="cart-empty">
                    <p class="text-center text-secondary">Tu carrito está vacío</p>
                </div>
            `;
        }
        if (this.cartSummary) {
            this.cartSummary.innerHTML = '';
        }
    }

    /**
     * Renderiza los items del carrito
     * @param {Array} items 
     */
    renderItems(items) {
        if (!this.cartItems) return;

        this.cartItems.innerHTML = items.map(item => `
            <div class="cart-item">
                <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.product.name}</h3>
                    <p class="cart-item-price">${item.product.getFormattedPrice()}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-action="decrement" data-product-id="${item.product.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-action="increment" data-product-id="${item.product.id}">+</button>
                </div>
                <button class="remove-btn" data-product-id="${item.product.id}">×</button>
            </div>
        `).join('');
    }

    /**
     * Renderiza el resumen del carrito
     * @param {number} subtotal 
     * @param {number} discount 
     * @param {number} total 
     */
    renderSummary(subtotal, discount, total) {
        if (!this.cartSummary) return;

        this.cartSummary.innerHTML = `
            <div class="discount-section">
                <input type="text" id="discountCode" placeholder="Código de descuento">
                <button class="btn btn-primary" id="applyDiscountBtn">Aplicar</button>
            </div>
            ${discount > 0 ? `
                <div class="cart-discount" style="text-align: right; color: #10b981; margin-bottom: 0.5rem;">
                    Descuento: -$${discount.toLocaleString()}
                </div>
            ` : ''}
            <div class="cart-total">
                Total: $${total.toLocaleString()}
            </div>
            <button class="checkout-btn" id="checkoutBtn">Proceder al Pago</button>
        `;
    }
}