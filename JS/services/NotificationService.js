/* ==========================================
   Servicio para mostrar notificaciones
   Single Responsibility: Solo maneja notificaciones
   ========================================== */

import { CONFIG, NOTIFICATION_TYPES } from '../config/constants.js';

export class NotificationService {
    constructor() {
        this.duration = CONFIG.NOTIFICATION_DURATION;
        this.container = null;
        this.initContainer();
    }

    /**
     * Inicializa el contenedor de notificaciones
     */
    initContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    }

    /**
     * Muestra una notificación
     * @param {string} message 
     * @param {string} type 
     */
    show(message, type = NOTIFICATION_TYPES.INFO) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);

        // Animación de entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);

        // Auto-remover después del tiempo configurado
        setTimeout(() => {
            this.remove(notification);
        }, this.duration);
    }

    /**
     * Crea el elemento de notificación
     * @param {string} message 
     * @param {string} type 
     * @returns {HTMLElement}
     */
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const colors = {
            success: '#10b981',
            error: '#dc2626',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.cssText = `
            padding: 1rem 2rem;
            background-color: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            min-width: 250px;
            max-width: 400px;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s ease-out;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // Icono según el tipo
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const icon = document.createElement('span');
        icon.textContent = icons[type] || icons.info;
        icon.style.cssText = `
            font-size: 1.5rem;
            font-weight: bold;
        `;

        const text = document.createElement('span');
        text.textContent = message;

        notification.appendChild(icon);
        notification.appendChild(text);

        // Click para cerrar
        notification.addEventListener('click', () => {
            this.remove(notification);
        });

        return notification;
    }

    /**
     * Remueve una notificación
     * @param {HTMLElement} notification 
     */
    remove(notification) {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * Muestra una notificación de éxito
     * @param {string} message 
     */
    success(message) {
        this.show(message, NOTIFICATION_TYPES.SUCCESS);
    }

    /**
     * Muestra una notificación de error
     * @param {string} message 
     */
    error(message) {
        this.show(message, NOTIFICATION_TYPES.ERROR);
    }

    /**
     * Muestra una notificación de advertencia
     * @param {string} message 
     */
    warning(message) {
        this.show(message, NOTIFICATION_TYPES.WARNING);
    }

    /**
     * Muestra una notificación de información
     * @param {string} message 
     */
    info(message) {
        this.show(message, NOTIFICATION_TYPES.INFO);
    }

    /**
     * Limpia todas las notificaciones
     */
    clearAll() {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
    }
}