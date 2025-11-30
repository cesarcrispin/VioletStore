/* ==========================================
   Servicio para manejo de almacenamiento local
   Single Responsibility: Solo maneja persistencia de datos
   ========================================== */

import { CONFIG, STORAGE_KEYS } from '../config/constants.js';

export class StorageService {
    constructor() {
        this.prefix = CONFIG.STORAGE_PREFIX;
    }

    /**
     * Genera la clave completa con prefijo
     * @param {string} key 
     * @returns {string}
     */
    getKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Guarda un valor en localStorage
     * @param {string} key 
     * @param {any} value 
     * @returns {boolean}
     */
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.getKey(key), serializedValue);
            return true;
        } catch (error) {
            console.error(`Error al guardar ${key}:`, error);
            return false;
        }
    }

    /**
     * Obtiene un valor de localStorage
     * @param {string} key 
     * @returns {any}
     */
    get(key) {
        try {
            const serializedValue = localStorage.getItem(this.getKey(key));
            return serializedValue ? JSON.parse(serializedValue) : null;
        } catch (error) {
            console.error(`Error al obtener ${key}:`, error);
            return null;
        }
    }

    /**
     * Elimina un valor de localStorage
     * @param {string} key 
     * @returns {boolean}
     */
    remove(key) {
        try {
            localStorage.removeItem(this.getKey(key));
            return true;
        } catch (error) {
            console.error(`Error al eliminar ${key}:`, error);
            return false;
        }
    }

    /**
     * Limpia todo el almacenamiento de la app
     */
    clear() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                this.remove(key);
            });
        } catch (error) {
            console.error('Error al limpiar almacenamiento:', error);
        }
    }

    /**
     * Verifica si existe una clave
     * @param {string} key 
     * @returns {boolean}
     */
    has(key) {
        return localStorage.getItem(this.getKey(key)) !== null;
    }

    /**
     * Guarda el usuario
     * @param {User} user 
     */
    saveUser(user) {
        return this.set(STORAGE_KEYS.USER, user.toJSON());
    }

    /**
     * Obtiene el usuario
     * @returns {Object|null}
     */
    getUser() {
        return this.get(STORAGE_KEYS.USER);
    }

    /**
     * Elimina el usuario
     */
    removeUser() {
        return this.remove(STORAGE_KEYS.USER);
    }

    /**
     * Guarda el carrito
     * @param {Cart} cart 
     */
    saveCart(cart) {
        return this.set(STORAGE_KEYS.CART, cart.toJSON());
    }

    /**
     * Obtiene el carrito
     * @returns {Object|null}
     */
    getCart() {
        return this.get(STORAGE_KEYS.CART);
    }

    /**
     * Elimina el carrito
     */
    removeCart() {
        return this.remove(STORAGE_KEYS.CART);
    }

    /**
     * Guarda el historial de pedidos
     * @param {Array<Order>} orders 
     */
    saveOrderHistory(orders) {
        const ordersData = orders.map(order => order.toJSON());
        return this.set(STORAGE_KEYS.ORDER_HISTORY, ordersData);
    }

    /**
     * Obtiene el historial de pedidos
     * @returns {Array}
     */
    getOrderHistory() {
        return this.get(STORAGE_KEYS.ORDER_HISTORY) || [];
    }

    /**
     * Agrega un pedido al historial
     * @param {Order} order 
     */
    addOrder(order) {
        const history = this.getOrderHistory();
        history.push(order.toJSON());
        return this.saveOrderHistory(history);
    }
}