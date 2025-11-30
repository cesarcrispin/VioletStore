/* ==========================================
   Controlador de navegación entre vistas
   ========================================== */

import { VIEWS, EVENTS } from '../config/constants.js';

export class NavigationController {
    constructor() {
        this.currentView = VIEWS.HOME;
        this.viewElements = this.getViewElements();
        this.history = [VIEWS.HOME];
    }

    /**
     * Obtiene todos los elementos de vista
     * @returns {Object}
     */
    getViewElements() {
        return {
            [VIEWS.HOME]: {
                hero: document.getElementById('heroSection'),
                search: document.getElementById('searchSection'),
                products: document.getElementById('productsGrid')
            },
            [VIEWS.CART]: document.getElementById('cartView'),
            [VIEWS.LOGIN]: document.getElementById('authView'),
            [VIEWS.PROFILE]: document.getElementById('profileView'),
            [VIEWS.BLOG]: document.getElementById('blogView'),
            [VIEWS.ADVISOR]: document.getElementById('advisorView')
        };
    }

    /**
     * Navega a una vista específica
     * @param {string} viewName 
     * @param {Object} data 
     */
    navigateTo(viewName, data = null) {
        if (!this.isValidView(viewName)) {
            console.warn(`Vista inválida: ${viewName}`);
            return;
        }

        // Ocultar vista actual
        this.hideCurrentView();

        // Actualizar vista actual
        this.currentView = viewName;

        // Mostrar nueva vista
        this.showView(viewName);

        // Agregar al historial
        this.addToHistory(viewName);

        // Scroll al inicio
        this.scrollToTop();

        // Cerrar menú móvil si está abierto
        this.closeMenuMobile();

        // Emitir evento de cambio de vista
        this.emitViewChange(viewName, data);
    }

    /**
     * Oculta la vista actual
     */
    hideCurrentView() {
        Object.values(this.viewElements).forEach(element => {
            if (element) {
                if (typeof element === 'object' && !element.classList) {
                    // Es un objeto con múltiples elementos (HOME)
                    Object.values(element).forEach(el => {
                        if (el) el.classList.add('hidden');
                    });
                } else if (element.classList) {
                    element.classList.add('hidden');
                }
            }
        });
    }

    /**
     * Muestra una vista específica
     * @param {string} viewName 
     */
    showView(viewName) {
        const element = this.viewElements[viewName];

        if (!element) return;

        if (typeof element === 'object' && !element.classList) {
            // Es un objeto con múltiples elementos (HOME)
            Object.values(element).forEach(el => {
                if (el) el.classList.remove('hidden');
            });
        } else if (element.classList) {
            element.classList.remove('hidden');
        }
    }

    /**
     * Verifica si una vista es válida
     * @param {string} viewName 
     * @returns {boolean}
     */
    isValidView(viewName) {
        return Object.values(VIEWS).includes(viewName);
    }

    /**
     * Obtiene la vista actual
     * @returns {string}
     */
    getCurrentView() {
        return this.currentView;
    }

    /**
     * Verifica si está en una vista específica
     * @param {string} viewName 
     * @returns {boolean}
     */
    isCurrentView(viewName) {
        return this.currentView === viewName;
    }

    /**
     * Vuelve a la vista anterior
     */
    goBack() {
        if (this.history.length > 1) {
            this.history.pop(); // Quitar vista actual
            const previousView = this.history.pop(); // Obtener anterior
            this.navigateTo(previousView);
        } else {
            this.navigateTo(VIEWS.HOME);
        }
    }

    /**
     * Agrega al historial
     * @param {string} viewName 
     */
    addToHistory(viewName) {
        // Evitar duplicados consecutivos
        if (this.history[this.history.length - 1] !== viewName) {
            this.history.push(viewName);
        }

        // Limitar historial a 10 vistas
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    /**
     * Limpia el historial
     */
    clearHistory() {
        this.history = [this.currentView];
    }

    /**
     * Scroll al inicio de la página
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Cierra el menú móvil
     */
    closeMenuMobile() {
        const nav = document.getElementById('mainNav');
        if (nav) {
            nav.classList.remove('active');
        }
    }

    /**
     * Emite evento de cambio de vista
     * @param {string} viewName 
     * @param {Object} data 
     */
    emitViewChange(viewName, data) {
        const event = new CustomEvent(EVENTS.VIEW_CHANGED, {
            detail: {
                view: viewName,
                data: data,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * Configura la navegación automática desde links
     */
    setupNavLinks() {
        // Links con data-view
        document.querySelectorAll('[data-view]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                this.navigateTo(view);
            });
        });

        // Botón de logo
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => {
                this.navigateTo(VIEWS.HOME);
            });
        }
    }

    /**
     * Obtiene el historial de navegación
     * @returns {Array<string>}
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Puede volver atrás
     * @returns {boolean}
     */
    canGoBack() {
        return this.history.length > 1;
    }
}