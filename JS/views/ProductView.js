/* ==========================================
   Vista de detalle de producto
   ========================================== */

import { BaseView } from './BaseView.js';

export class ProductView extends BaseView {
    constructor() {
        super('productDetail');
        this.modal = document.getElementById('productModal');
        this.closeBtn = document.getElementById('closeModal');
    }

    /**
     * Muestra el detalle del producto
     * @param {Product} product 
     */
    render(product) {
        if (!this.container || !product) return;

        this.container.innerHTML = `
            <div class="product-detail-grid">
                <div>
                    <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                </div>
                <div class="product-detail-info">
                    <h2>${product.name}</h2>
                    <p class="product-detail-description">${product.description}</p>
                    
                    <div class="detail-section">
                        <h3>Certificaciones:</h3>
                        <div class="product-certifications">
                            ${product.certifications.map(cert => `
                                <span class="certification-badge">${cert}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Ingredientes:</h3>
                        <p class="ingredients-list">${product.ingredients.join(', ')}</p>
                    </div>

                    <div class="detail-section">
                        <h3>Modo de uso:</h3>
                        <p class="ingredients-list">${product.usage}</p>
                    </div>

                    <p class="product-price">${product.getFormattedPrice()}</p>
                    <p class="stock-info ${product.isLowStock() ? 'low-stock' : ''}">
                        Stock disponible: ${product.stock}
                    </p>
                    
                    <button class="btn btn-primary" style="width: 100%;" id="addToCartModal" data-product-id="${product.id}">
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        `;

        this.showModal();
    }

    /**
     * Muestra el modal
     */
    showModal() {
        if (this.modal) {
            this.modal.classList.add('active');
        }
    }

    /**
     * Oculta el modal
     */
    hideModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    }
}