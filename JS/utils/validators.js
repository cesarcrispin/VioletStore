/* ==========================================
   Funciones de validación reutilizables
   ========================================== */

/**
 * Valida un email
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida una contraseña
 * @param {string} password 
 * @param {number} minLength 
 * @returns {Object}
 */
export function validatePassword(password, minLength = 6) {
    const errors = [];
    
    if (!password || password.length < minLength) {
        errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valida un nombre
 * @param {string} name 
 * @param {number} minLength 
 * @returns {Object}
 */
export function validateName(name, minLength = 2) {
    const errors = [];
    
    if (!name || name.trim().length < minLength) {
        errors.push(`El nombre debe tener al menos ${minLength} caracteres`);
    }
    
    if (name && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) {
        errors.push('El nombre solo puede contener letras y espacios');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valida un número de teléfono
 * @param {string} phone 
 * @returns {boolean}
 */
export function validatePhone(phone) {
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
}

/**
 * Valida un código postal
 * @param {string} zipCode 
 * @returns {boolean}
 */
export function validateZipCode(zipCode) {
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    return zipCodeRegex.test(zipCode);
}

/**
 * Valida un número de tarjeta de crédito (usando algoritmo de Luhn)
 * @param {string} cardNumber 
 * @returns {boolean}
 */
export function validateCreditCard(cardNumber) {
    // Remover espacios y guiones
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Verificar que solo contenga dígitos y tenga 13-19 caracteres
    if (!/^\d{13,19}$/.test(cleaned)) {
        return false;
    }
    
    // Algoritmo de Luhn
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned.charAt(i), 10);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return (sum % 10) === 0;
}

/**
 * Valida una URL
 * @param {string} url 
 * @returns {boolean}
 */
export function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Valida un rango de edad
 * @param {number} age 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export function validateAge(age, min = 0, max = 120) {
    return age >= min && age <= max;
}

/**
 * Valida que un string no esté vacío
 * @param {string} value 
 * @returns {boolean}
 */
export function isNotEmpty(value) {
    return value && value.trim().length > 0;
}

/**
 * Valida la longitud de un string
 * @param {string} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export function validateLength(value, min, max) {
    const length = value ? value.trim().length : 0;
    return length >= min && length <= max;
}

/**
 * Valida un número dentro de un rango
 * @param {number} value 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
export function validateRange(value, min, max) {
    return value >= min && value <= max;
}

/**
 * Valida que un valor esté en una lista
 * @param {any} value 
 * @param {Array} allowedValues 
 * @returns {boolean}
 */
export function validateEnum(value, allowedValues) {
    return allowedValues.includes(value);
}

/**
 * Valida un objeto contra un schema
 * @param {Object} obj 
 * @param {Object} schema 
 * @returns {Object}
 */
export function validateObject(obj, schema) {
    const errors = [];
    
    for (const [key, validator] of Object.entries(schema)) {
        const value = obj[key];
        const result = validator(value);
        
        if (!result || (typeof result === 'object' && !result.isValid)) {
            errors.push(`${key}: ${result.errors ? result.errors.join(', ') : 'inválido'}`);
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}