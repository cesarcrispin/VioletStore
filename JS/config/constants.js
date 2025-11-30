/* ==========================================
   Constantes de configuración de la aplicación
   ========================================== */

export const CONFIG = {
    DATA_URL: 'assets/data/data.json',
    STORAGE_PREFIX: 'violetstore_',
    NOTIFICATION_DURATION: 3000,
    ANIMATION_DURATION: 300
};

export const STORAGE_KEYS = {
    USER: 'user',
    CART: 'cart',
    ORDER_HISTORY: 'order_history'
};

export const VIEWS = {
    HOME: 'home',
    CART: 'cart',
    LOGIN: 'login',
    PROFILE: 'profile',
    BLOG: 'blog',
    ADVISOR: 'advisor'
};

export const ORDER_STATUS = {
    PROCESSING: 'Procesando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado'
};

export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

export const EVENTS = {
    PRODUCT_ADDED: 'product:added',
    CART_UPDATED: 'cart:updated',
    USER_LOGGED_IN: 'user:loggedIn',
    USER_LOGGED_OUT: 'user:loggedOut',
    VIEW_CHANGED: 'view:changed',
    ORDER_CREATED: 'order:created'
};