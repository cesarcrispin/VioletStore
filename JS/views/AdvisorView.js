/* ==========================================
   Vista de asesoría
   ========================================== */

import { BaseView } from './BaseView.js';

export class AdvisorView extends BaseView {
    constructor() {
        super('advisorView');
    }

    /**
     * Renderiza la vista de asesoría
     */
    render() {
        // La vista de asesoría es estática, no necesita renderizado dinámico
        // El HTML ya existe en el documento
    }

    /**
     * Obtiene el mensaje del formulario
     * @returns {string}
     */
    getMessage() {
        const messageInput = document.getElementById('advisorMessage');
        return messageInput ? messageInput.value : '';
    }

    /**
     * Limpia el formulario
     */
    clearForm() {
        const messageInput = document.getElementById('advisorMessage');
        if (messageInput) {
            messageInput.value = '';
        }
    }
}