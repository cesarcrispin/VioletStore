/* ==========================================
   Servicio para cargar datos desde el servidor
   Single Responsibility: Solo maneja carga de datos
   ========================================== */

import { CONFIG } from '../config/constants.js';
import { Product } from '../models/Product.js';

export class DataService {
    constructor() {
        this.dataUrl = CONFIG.DATA_URL;
        this.cache = {
            products: null,
            blogPosts: null,
            discountCodes: null
        };
    }

    /**
     * Carga todos los datos de la aplicación
     * @returns {Promise<Object>}
     */
    async loadData() {
        try {
            const response = await fetch(this.dataUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Cachear los datos
            this.cache.products = data.products.map(p => new Product(p));
            this.cache.blogPosts = data.blogPosts || [];
            this.cache.discountCodes = data.discountCodes || [];
            
            return {
                products: this.cache.products,
                blogPosts: this.cache.blogPosts,
                discountCodes: this.cache.discountCodes
            };
        } catch (error) {
            console.error('Error al cargar datos:', error);
            return this.getFallbackData();
        }
    }

    /**
     * Obtiene los productos (desde cache si está disponible)
     * @returns {Promise<Array<Product>>}
     */
    async getProducts() {
        if (this.cache.products) {
            return this.cache.products;
        }
        
        const data = await this.loadData();
        return data.products;
    }

    /**
     * Obtiene un producto por ID
     * @param {number} productId 
     * @returns {Promise<Product|null>}
     */
    async getProductById(productId) {
        const products = await this.getProducts();
        return products.find(p => p.id === productId) || null;
    }

    /**
     * Obtiene los posts del blog
     * @returns {Promise<Array>}
     */
    async getBlogPosts() {
        if (this.cache.blogPosts) {
            return this.cache.blogPosts;
        }
        
        const data = await this.loadData();
        return data.blogPosts;
    }

    /**
     * Obtiene los códigos de descuento
     * @returns {Promise<Array>}
     */
    async getDiscountCodes() {
        if (this.cache.discountCodes) {
            return this.cache.discountCodes;
        }
        
        const data = await this.loadData();
        return data.discountCodes;
    }

    /**
     * Valida un código de descuento
     * @param {string} code 
     * @returns {Promise<Object|null>}
     */
    async validateDiscountCode(code) {
        const discountCodes = await this.getDiscountCodes();
        return discountCodes.find(d => d.code === code.toUpperCase()) || null;
    }

    /**
     * Datos de respaldo si falla la carga
     * @returns {Object}
     */
    getFallbackData() {
        return {
            products: [],
            blogPosts: [],
            discountCodes: []
        };
    }

    /**
     * Limpia el cache
     */
    clearCache() {
        this.cache = {
            products: null,
            blogPosts: null,
            discountCodes: null
        };
    }

    /**
     * Recarga los datos
     * @returns {Promise<Object>}
     */
    async reload() {
        this.clearCache();
        return await this.loadData();
    }
}