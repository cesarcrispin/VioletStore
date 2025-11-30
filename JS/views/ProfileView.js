/* ==========================================
   Vista del perfil de usuario
   ========================================== */

import { BaseView } from './BaseView.js';

export class ProfileView extends BaseView {
    constructor() {
        super('profileView');
        this.profileInfo = document.getElementById('profileInfo');
        this.ordersList = document.getElementById('ordersList');
    }

    /**
     * Renderiza el perfil
     * @param {Object} data 
     */
    render(data) {
        const { user, orders } = data;

        if (!user) {
            this.showEmpty('Usuario no encontrado');
            return;
        }

        this.renderUserInfo(user);
        this.renderOrders(orders);
    }

    /**
     * Renderiza la información del usuario
     * @param {User} user 
     */
    renderUserInfo(user) {
        if (!this.profileInfo) return;

        this.profileInfo.innerHTML = `
            <p><strong>Nombre:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Código de Referido:</strong> ${user.referralCode}</p>
            <button class="btn logout-btn" id="logoutBtn">Cerrar Sesión</button>
        `;
    }

    /**
     * Renderiza el historial de pedidos
     * @param {Array} orders 
     */
    renderOrders(orders) {
        if (!this.ordersList) return;

        if (orders.length === 0) {
            this.ordersList.innerHTML = '<p class="text-secondary">No tienes pedidos aún</p>';
            return;
        }

        this.ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <p><strong>Pedido #${order.id}</strong></p>
                <p>Fecha: ${order.getShortDate()}</p>
                <p>Total: ${order.getFormattedTotal()}</p>
                <p>Estado: <span class="order-status ${order.status.toLowerCase()}">${order.status}</span></p>
            </div>
        `).join('');
    }
}