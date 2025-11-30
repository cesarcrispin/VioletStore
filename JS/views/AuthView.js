/* ==========================================
   Vista de autenticación (login/registro)
   ========================================== */

import { BaseView } from './BaseView.js';

export class AuthView extends BaseView {
    constructor() {
        super('authView');
        this.title = document.getElementById('authTitle');
        this.nameGroup = document.getElementById('nameGroup');
        this.toggleBtn = document.getElementById('toggleAuthMode');
        this.submitBtn = document.querySelector('#authForm button[type="submit"]');
    }

    /**
     * Renderiza el modo de autenticación
     * @param {boolean} isLoginMode 
     */
    render(isLoginMode) {
        this.updateMode(isLoginMode);
    }

    /**
     * Actualiza el modo (login/registro)
     * @param {boolean} isLoginMode 
     */
    updateMode(isLoginMode) {
        if (!this.title || !this.nameGroup || !this.toggleBtn || !this.submitBtn) return;

        if (isLoginMode) {
            this.title.textContent = 'Iniciar Sesión';
            this.nameGroup.classList.add('hidden');
            this.toggleBtn.textContent = '¿No tienes cuenta? Regístrate';
            this.submitBtn.textContent = 'Ingresar';
        } else {
            this.title.textContent = 'Registrarse';
            this.nameGroup.classList.remove('hidden');
            this.toggleBtn.textContent = '¿Ya tienes cuenta? Inicia sesión';
            this.submitBtn.textContent = 'Crear Cuenta';
        }
    }

    /**
     * Obtiene los valores del formulario
     * @returns {Object}
     */
    getFormValues() {
        return {
            email: document.getElementById('emailInput')?.value || '',
            password: document.getElementById('passwordInput')?.value || '',
            name: document.getElementById('nameInput')?.value || ''
        };
    }

    /**
     * Limpia el formulario
     */
    clearForm() {
        const emailInput = document.getElementById('emailInput');
        const passwordInput = document.getElementById('passwordInput');
        const nameInput = document.getElementById('nameInput');

        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (nameInput) nameInput.value = '';
    }
}