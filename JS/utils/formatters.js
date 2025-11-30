/* ==========================================
   Funciones de formato reutilizables
   ========================================== */

/**
 * Formatea un número como moneda
 * @param {number} amount 
 * @param {string} currency 
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'COP') {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Formatea un número con separadores de miles
 * @param {number} number 
 * @returns {string}
 */
export function formatNumber(number) {
    return new Intl.NumberFormat('es-CO').format(number);
}

/**
 * Formatea una fecha
 * @param {Date|string} date 
 * @param {string} format 
 * @returns {string}
 */
export function formatDate(date, format = 'long') {
    const d = date instanceof Date ? date : new Date(date);
    
    const options = {
        short: { year: 'numeric', month: '2-digit', day: '2-digit' },
        medium: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    };
    
    return new Intl.DateTimeFormat('es-ES', options[format] || options.long).format(d);
}

/**
 * Formatea una fecha relativa (hace X tiempo)
 * @param {Date|string} date 
 * @returns {string}
 */
export function formatRelativeTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now - d;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (seconds < 60) return 'hace un momento';
    if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (days < 7) return `hace ${days} día${days > 1 ? 's' : ''}`;
    if (weeks < 4) return `hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    if (months < 12) return `hace ${months} mes${months > 1 ? 'es' : ''}`;
    return `hace ${years} año${years > 1 ? 's' : ''}`;
}

/**
 * Formatea un porcentaje
 * @param {number} value 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatPercentage(value, decimals = 0) {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea un nombre propio (primera letra mayúscula)
 * @param {string} name 
 * @returns {string}
 */
export function formatName(name) {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Formatea un email (oculta parte del usuario)
 * @param {string} email 
 * @returns {string}
 */
export function formatEmail(email) {
    const [username, domain] = email.split('@');
    const visibleChars = Math.min(3, Math.floor(username.length / 2));
    const hiddenPart = '*'.repeat(username.length - visibleChars);
    return `${username.substring(0, visibleChars)}${hiddenPart}@${domain}`;
}

/**
 * Formatea un número de teléfono
 * @param {string} phone 
 * @returns {string}
 */
export function formatPhone(phone) {
    // Remover caracteres no numéricos
    const cleaned = phone.replace(/\D/g, '');
    
    // Formatear según la longitud
    if (cleaned.length === 10) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }
    
    return phone;
}

/**
 * Formatea un número de tarjeta de crédito (oculta dígitos)
 * @param {string} cardNumber 
 * @returns {string}
 */
export function formatCreditCard(cardNumber) {
    const cleaned = cardNumber.replace(/\s/g, '');
    const lastFour = cleaned.slice(-4);
    const masked = '*'.repeat(cleaned.length - 4);
    return `${masked}${lastFour}`.match(/.{1,4}/g).join(' ');
}

/**
 * Trunca un texto con puntos suspensivos
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string}
 */
export function truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formatea un tamaño de archivo
 * @param {number} bytes 
 * @returns {string}
 */
export function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Formatea una duración en segundos
 * @param {number} seconds 
 * @returns {string}
 */
export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
    
    return parts.join(' ');
}

/**
 * Formatea un slug (URL-friendly)
 * @param {string} text 
 * @returns {string}
 */
export function formatSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales
        .replace(/^-+|-+$/g, ''); // Remover guiones al inicio/final
}

/**
 * Capitaliza la primera letra
 * @param {string} text 
 * @returns {string}
 */
export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convierte a título (primera letra de cada palabra)
 * @param {string} text 
 * @returns {string}
 */
export function toTitleCase(text) {
    return text
        .toLowerCase()
        .split(' ')
        .map(word => capitalize(word))
        .join(' ');
}