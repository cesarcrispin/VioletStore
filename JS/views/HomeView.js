/* ==========================================
   Vista principal con productos
   ========================================== */

import { BaseView } from './BaseView.js';

export class HomeView extends BaseView {
    constructor() {
        super('productsGrid');
        this.heroSection = document.getElementById('heroSection');
        this.searchSection = document.getElementById('searchSection');
    }

    /**
     * Muestra la vista home
     */
    show() {
        if (this.heroSection) this.heroSection.classList.remove('hidden');
        if (this.searchSection) this.searchSection.classList.remove('hidden');
        if (this.container) this.container.classList.remove('hidden');
    }

    /**
     * Oculta la vista home
     */
    hide() {
        if (this.heroSection) this.heroSection.classList.add('hidden');
        if (this.searchSection) this.searchSection.classList.add('hidden');
        if (this.container) this.container.classList.add('hidden');
    }

    /**
     * Renderiza los productos
     * @param {Array} products 
     */
    render(products) {
        if (!this.container) return;

        if (products.length === 0) {
            this.showEmpty('No se encontraron productos');
            return;
        }

        this.container.innerHTML = products.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-category">${product.category}</p>
                    <div class="product-certifications">
                        ${product.certifications.map(cert => `
                            <span class="certification-badge">${cert}</span>
                        `).join('')}
                    </div>
                    <p class="product-price">${product.getFormattedPrice()}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-detail" data-product-id="${product.id}">
                            Ver Detalle
                        </button>
                        <button class="btn btn-secondary btn-cart" data-product-id="${product.id}">
                            🛒
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Renderiza los filtros
     * @param {Array} filters 
     */
    renderFilters(filters) {
        const filterButtons = document.getElementById('filterButtons');
        if (!filterButtons) return;

        filterButtons.innerHTML = filters.map(filter => `
            <button class="filter-btn" data-filter="${filter}">${filter}</button>
        `).join('');
    }
}