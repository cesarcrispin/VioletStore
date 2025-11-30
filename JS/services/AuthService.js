/* ==========================================
   Servicio para autenticación de usuarios
   Single Responsibility: Solo maneja autenticación
   ========================================== */

import { User } from '../models/User.js';
import { StorageService } from './StorageService.js';
import { EVENTS } from '../config/constants.js';

export class AuthService {
    constructor() {
        this.storageService = new StorageService();
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    /**
     * Carga el usuario desde el almacenamiento
     */
    loadUserFromStorage() {
        const userData = this.storageService.getUser();
        if (userData) {
            this.currentUser = User.fromJSON(userData);
        }
    }

    /**
     * Inicia sesión con email y contraseña
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<User>}
     */
    async login(email, password) {
        // Simulación de login (en producción sería una llamada al backend)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.validateEmail(email) && password.length >= 6) {
                    const user = new User({ email, name: 'Usuario' });
                    this.currentUser = user;
                    this.storageService.saveUser(user);
                    
                    // Emitir evento de login
                    this.emitEvent(EVENTS.USER_LOGGED_IN, user);
                    
                    resolve(user);
                } else {
                    reject(new Error('Credenciales inválidas'));
                }
            }, 500);
        });
    }

    /**
     * Registra un nuevo usuario
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<User>}
     */
    async register(name, email, password) {
        // Simulación de registro (en producción sería una llamada al backend)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!this.validateEmail(email)) {
                    reject(new Error('Email inválido'));
                    return;
                }

                if (password.length < 6) {
                    reject(new Error('La contraseña debe tener al menos 6 caracteres'));
                    return;
                }

                if (name.trim().length < 2) {
                    reject(new Error('El nombre debe tener al menos 2 caracteres'));
                    return;
                }

                const user = new User({ email, name });
                this.currentUser = user;
                this.storageService.saveUser(user);
                
                // Emitir evento de login
                this.emitEvent(EVENTS.USER_LOGGED_IN, user);
                
                resolve(user);
            }, 500);
        });
    }

    /**
     * Cierra la sesión del usuario
     */
    logout() {
        this.currentUser = null;
        this.storageService.removeUser();
        
        // Emitir evento de logout
        this.emitEvent(EVENTS.USER_LOGGED_OUT);
    }

    /**
     * Obtiene el usuario actual
     * @returns {User|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Actualiza la información del usuario
     * @param {Object} data 
     * @returns {Promise<User>}
     */
    async updateUser(data) {
        return new Promise((resolve, reject) => {
            if (!this.isAuthenticated()) {
                reject(new Error('Usuario no autenticado'));
                return;
            }

            setTimeout(() => {
                this.currentUser.update(data);
                this.storageService.saveUser(this.currentUser);
                resolve(this.currentUser);
            }, 300);
        });
    }

    /**
     * Valida un email
     * @param {string} email 
     * @returns {boolean}
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Emite un evento personalizado
     * @param {string} eventName 
     * @param {any} detail 
     */
    emitEvent(eventName, detail = null) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Solicita recuperación de contraseña
     * @param {string} email 
     * @returns {Promise<void>}
     */
    async requestPasswordReset(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.validateEmail(email)) {
                    resolve();
                } else {
                    reject(new Error('Email inválido'));
                }
            }, 500);
        });
    }
}