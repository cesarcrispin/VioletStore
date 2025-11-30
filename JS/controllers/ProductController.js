/* ==========================================
   Controlador de productos
   ========================================== */

import { Product } from '../models/Product.js';

export class ProductController {
    constructor(products = []) {
        this.products = products;
        this.filteredProducts = [...products];
        this.searchTerm = '';
        this.selectedFilters = [];
    }

    /**
     * Obtiene todos los productos
     * @returns {Array<Product>}
     */
    getAllProducts() {
        return this.products;
    }

    /**
     * Obtiene los productos filtrados
     * @returns {Array<Product>}
     */
    getFilteredProducts() {
        return this.filteredProducts;
    }

    /**
     * Busca un producto por ID
     * @param {number} productId 
     * @returns {Product|null}
     */
    getProductById(productId) {
        return this.products.find(p => p.id === productId) || null;
    }

    /**
     * Establece el término de búsqueda
     * @param {string} term 
     */
    setSearchTerm(term) {
        this.searchTerm = term;
        this.applyFilters();
    }

    /**
     * Agrega un filtro
     * @param {string} filter 
     */
    addFilter(filter) {
        if (!this.selectedFilters.includes(filter)) {
            this.selectedFilters.push(filter);
            this.applyFilters();
        }
    }

    /**
     * Remueve un filtro
     * @param {string} filter 
     */
    removeFilter(filter) {
        this.selectedFilters = this.selectedFilters.filter(f => f !== filter);
        this.applyFilters();
    }

    /**
     * Alterna un filtro (agregar/remover)
     * @param {string} filter 
     */
    toggleFilter(filter) {
        if (this.selectedFilters.includes(filter)) {
            this.removeFilter(filter);
        } else {
            this.addFilter(filter);
        }
    }

    /**
     * Limpia todos los filtros
     */
    clearFilters() {
        this.selectedFilters = [];
        this.searchTerm = '';
        this.applyFilters();
    }

    /**
     * Aplica los filtros y búsqueda
     */
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Filtro de búsqueda
            const matchesSearch = this.searchTerm === '' || 
                                 product.matchesSearch(this.searchTerm);

            // Filtro de certificaciones
            const matchesFilters = product.matchesFilters(this.selectedFilters);

            return matchesSearch && matchesFilters;
        });
    }

    /**
     * Obtiene productos por categoría
     * @param {string} category 
     * @returns {Array<Product>}
     */
    getProductsByCategory(category) {
        return this.products.filter(p => p.category === category);
    }

    /**
     * Obtiene todas las categorías únicas
     * @returns {Array<string>}
     */
    getCategories() {
        const categories = this.products.map(p => p.category);
        return [...new Set(categories)];
    }

    /**
     * Obtiene todas las certificaciones únicas
     * @returns {Array<string>}
     */
    getCertifications() {
        const certifications = this.products.flatMap(p => p.certifications);
        return [...new Set(certifications)];
    }

    /**
     * Obtiene productos relacionados
     * @param {number} productId 
     * @param {number} limit 
     * @returns {Array<Product>}
     */
    getRelatedProducts(productId, limit = 4) {
        const product = this.getProductById(productId);
        if (!product) return [];

        return this.products
            .filter(p => p.id !== productId && p.category === product.category)
            .slice(0, limit);
    }

    /**
     * Obtiene productos destacados (mejor rating)
     * @param {number} limit 
     * @returns {Array<Product>}
     */
    getFeaturedProducts(limit = 4) {
        return [...this.products]
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, limit);
    }

    /**
     * Busca productos
     * @param {string} query 
     * @returns {Array<Product>}
     */
    search(query) {
        this.setSearchTerm(query);
        return this.getFilteredProducts();
    }

    /**
     * Obtiene el conteo de productos filtrados
     * @returns {number}
     */
    getFilteredCount() {
        return this.filteredProducts.length;
    }

    /**
     * Verifica si hay filtros activos
     * @returns {boolean}
     */
    hasActiveFilters() {
        return this.selectedFilters.length > 0 || this.searchTerm !== '';
    }
}