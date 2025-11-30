/* ==========================================
   Funciones auxiliares reutilizables
   ========================================== */

/**
 * Debounce - Retrasa la ejecución de una función
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - Limita la frecuencia de ejecución
 * @param {Function} func 
 * @param {number} limit 
 * @returns {Function}
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Clona un objeto profundamente
 * @param {Object} obj 
 * @returns {Object}
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Mezcla dos objetos
 * @param {Object} target 
 * @param {Object} source 
 * @returns {Object}
 */
export function merge(target, source) {
    return { ...target, ...source };
}

/**
 * Obtiene un valor anidado de un objeto
 * @param {Object} obj 
 * @param {string} path 
 * @param {any} defaultValue 
 * @returns {any}
 */
export function getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        } else {
            return defaultValue;
        }
    }
    
    return result;
}

/**
 * Agrupa elementos de un array por una propiedad
 * @param {Array} array 
 * @param {string} key 
 * @returns {Object}
 */
export function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} array 
 * @param {string} key 
 * @param {string} order 
 * @returns {Array}
 */
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Filtra valores únicos de un array
 * @param {Array} array 
 * @returns {Array}
 */
export function unique(array) {
    return [...new Set(array)];
}

/**
 * Genera un ID único
 * @returns {string}
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Genera un número aleatorio entre min y max
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Mezcla un array aleatoriamente
 * @param {Array} array 
 * @returns {Array}
 */
export function shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Divide un array en chunks
 * @param {Array} array 
 * @param {number} size 
 * @returns {Array}
 */
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Remueve valores falsy de un array
 * @param {Array} array 
 * @returns {Array}
 */
export function compact(array) {
    return array.filter(Boolean);
}

/**
 * Espera un tiempo determinado
 * @param {number} ms 
 * @returns {Promise}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Ejecuta una función de forma asíncrona con retry
 * @param {Function} func 
 * @param {number} maxRetries 
 * @param {number} delay 
 * @returns {Promise}
 */
export async function retry(func, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await func();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(delay * (i + 1));
        }
    }
}

/**
 * Verifica si un elemento está en el viewport
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Copia texto al portapapeles
 * @param {string} text 
 * @returns {Promise}
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        // Fallback para navegadores antiguos
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        return success;
    }
}

/**
 * Detecta el tipo de dispositivo
 * @returns {string}
 */
export function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
    }
    return 'desktop';
}

/**
 * Detecta si es modo oscuro
 * @returns {boolean}
 */
export function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Parsea query params de la URL
 * @returns {Object}
 */
export function parseQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

/**
 * Crea query string desde un objeto
 * @param {Object} params 
 * @returns {string}
 */
export function createQueryString(params) {
    return new URLSearchParams(params).toString();
}