/* ==========================================
   Controlador de autenticación
   ========================================== */

import { AuthService } from '../services/AuthService.js';
import { NotificationService } from '../services/NotificationService.js';
import { EVENTS } from '../config/constants.js';

export class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.notificationService = new NotificationService();
        this.isLoginMode = true;
    }

    /**
     * Procesa el login
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<User>}
     */
    async login(email, password) {
        try {
            const user = await this.authService.login(email, password);
            this.notificationService.success(`¡Bienvenido ${user.getShortName()}!`);
            this.emitAuthChange();
            return user;
        } catch (error) {
            this.notificationService.error(error.message);
            throw error;
        }
    }

    /**
     * Procesa el registro
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<User>}
     */
    async register(name, email, password) {
        try {
            const user = await this.authService.register(name, email, password);
            this.notificationService.success('¡Cuenta creada con éxito!');
            this.emitAuthChange();
            return user;
        } catch (error) {
            this.notificationService.error(error.message);
            throw error;
        }
    }

    /**
     * Procesa el logout
     */
    logout() {
        this.authService.logout();
        this.notificationService.info('Sesión cerrada');
        this.emitAuthChange();
    }

    /**
     * Obtiene el usuario actual
     * @returns {User|null}
     */
    getCurrentUser() {
        return this.authService.getCurrentUser();
    }

    /**
     * Verifica si hay un usuario autenticado
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    /**
     * Actualiza la información del usuario
     * @param {Object} data 
     * @returns {Promise<User>}
     */
    async updateUser(data) {
        try {
            const user = await this.authService.updateUser(data);
            this.notificationService.success('Perfil actualizado');
            this.emitAuthChange();
            return user;
        } catch (error) {
            this.notificationService.error(error.message);
            throw error;
        }
    }

    /**
     * Solicita recuperación de contraseña
     * @param {string} email 
     * @returns {Promise<void>}
     */
    async requestPasswordReset(email) {
        try {
            await this.authService.requestPasswordReset(email);
            this.notificationService.success(
                'Se ha enviado un correo para restablecer tu contraseña'
            );
        } catch (error) {
            this.notificationService.error(error.message);
            throw error;
        }
    }

    /**
     * Alterna entre modo login y registro
     */
    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        return this.isLoginMode;
    }

    /**
     * Obtiene el modo actual
     * @returns {boolean}
     */
    getMode() {
        return this.isLoginMode;
    }

    /**
     * Establece el modo
     * @param {boolean} isLogin 
     */
    setMode(isLogin) {
        this.isLoginMode = isLogin;
    }

    /**
     * Valida los datos de login
     * @param {string} email 
     * @param {string} password 
     * @returns {Object}
     */
    validateLogin(email, password) {
        const errors = [];

        if (!email || email.trim() === '') {
            errors.push('El email es requerido');
        } else if (!this.authService.validateEmail(email)) {
            errors.push('Email inválido');
        }

        if (!password || password.trim() === '') {
            errors.push('La contraseña es requerida');
        } else if (password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Valida los datos de registro
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns {Object}
     */
    validateRegister(name, email, password) {
        const errors = [];

        if (!name || name.trim() === '') {
            errors.push('El nombre es requerido');
        } else if (name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }

        if (!email || email.trim() === '') {
            errors.push('El email es requerido');
        } else if (!this.authService.validateEmail(email)) {
            errors.push('Email inválido');
        }

        if (!password || password.trim() === '') {
            errors.push('La contraseña es requerida');
        } else if (password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Emite evento de cambio de autenticación
     */
    emitAuthChange() {
        const event = new CustomEvent(EVENTS.USER_LOGGED_IN, {
            detail: {
                user: this.getCurrentUser(),
                isAuthenticated: this.isAuthenticated()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Requiere autenticación
     * @returns {boolean}
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            this.notificationService.warning('Debes iniciar sesión para continuar');
            return false;
        }
        return true;
    }
}