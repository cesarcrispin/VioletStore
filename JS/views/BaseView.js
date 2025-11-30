/* ==========================================
   Clase base para todas las vistas
   ========================================== */

export class BaseView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn(`Container ${containerId} no encontrado`);
        }
    }

    /**
     * Muestra la vista
     */
    show() {
        if (this.container) {
            this.container.classList.remove('hidden');
        }
    }

    /**
     * Oculta la vista
     */
    hide() {
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }

    /**
     * Renderiza la vista (debe ser implementado por las clases hijas)
     * @param {Object} data 
     */
    render(data) {
        throw new Error('El método render debe ser implementado por la clase hija');
    }

    /**
     * Limpia el contenido de la vista
     */
    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * Crea un elemento HTML desde string
     * @param {string} html 
     * @returns {HTMLElement}
     */
    createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    }

    /**
     * Agrega un event listener a un elemento
     * @param {string} selector 
     * @param {string} event 
     * @param {Function} handler 
     * @param {HTMLElement} parent 
     */
    on(selector, event, handler, parent = this.container) {
        if (!parent) return;
        
        const element = typeof selector === 'string' 
            ? parent.querySelector(selector) 
            : selector;
            
        if (element) {
            element.addEventListener(event, handler);
        }
    }

    /**
     * Agrega event listeners a múltiples elementos
     * @param {string} selector 
     * @param {string} event 
     * @param {Function} handler 
     * @param {HTMLElement} parent 
     */
    onAll(selector, event, handler, parent = this.container) {
        if (!parent) return;
        
        const elements = parent.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener(event, handler);
        });
    }

    /**
     * Actualiza el contenido de un elemento
     * @param {string} selector 
     * @param {string} content 
     */
    updateContent(selector, content) {
        if (!this.container) return;
        
        const element = this.container.querySelector(selector);
        if (element) {
            element.innerHTML = content;
        }
    }

    /**
     * Muestra un mensaje vacío
     * @param {string} message 
     */
    showEmpty(message = 'No hay datos disponibles') {
        if (this.container) {
            this.container.innerHTML = `
                <div class="empty-state">
                    <p class="text-secondary">${message}</p>
                </div>
            `;
        }
    }

    /**
     * Muestra un estado de carga
     */
    showLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="loading-state">
                    <p class="text-secondary">Cargando...</p>
                </div>
            `;
        }
    }

    /**
     * Verifica si la vista está visible
     * @returns {boolean}
     */
    isVisible() {
        return this.container && !this.container.classList.contains('hidden');
    }

    /**
     * Emite un evento personalizado
     * @param {string} eventName 
     * @param {any} detail 
     */
    emit(eventName, detail = null) {
        const event = new CustomEvent(eventName, { 
            detail,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Escucha un evento personalizado
     * @param {string} eventName 
     * @param {Function} handler 
     */
    listen(eventName, handler) {
        document.addEventListener(eventName, handler);
    }

    /**
     * Remueve un listener de evento
     * @param {string} eventName 
     * @param {Function} handler 
     */
    unlisten(eventName, handler) {
        document.removeEventListener(eventName, handler);
    }
}