/* ==========================================
   usuarios
   Single Responsibility: Solo maneja lógica de usuarios
   ========================================== */

export class User {
    constructor(data) {
        this.email = data.email;
        this.name = data.name || 'Usuario';
        this.referralCode = data.referralCode || this.generateReferralCode();
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    /**
     * Genera un código de referido único
     * @returns {string}
     */
    generateReferralCode() {
        return 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    /**
     * Obtiene el nombre corto del usuario
     * @returns {string}
     */
    getShortName() {
        return this.name.split(' ')[0];
    }

    /**
     * Obtiene las iniciales del usuario
     * @returns {string}
     */
    getInitials() {
        return this.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }

    /**
     * Valida el email del usuario
     * @returns {boolean}
     */
    isValidEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    /**
     * Actualiza la información del usuario
     * @param {Object} data 
     */
    update(data) {
        if (data.name) this.name = data.name;
        if (data.email) this.email = data.email;
    }

    /**
     * Serializa el usuario a JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            email: this.email,
            name: this.name,
            referralCode: this.referralCode,
            createdAt: this.createdAt
        };
    }

    /**
     * Crea un usuario desde JSON
     * @param {Object} data 
     * @returns {User}
     */
    static fromJSON(data) {
        return new User(data);
    }
}