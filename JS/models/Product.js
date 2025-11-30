/* ==========================================
   productos
   Single Responsibility: Solo maneja lógica de productos
   ========================================== */

export class Product {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.category = data.category;
        this.image = data.image;
        this.ingredients = data.ingredients || [];
        this.certifications = data.certifications || [];
        this.description = data.description || '';
        this.usage = data.usage || '';
        this.stock = data.stock || 0;
        this.reviews = data.reviews || 0;
    }

    /**
     * Verifica si el producto está en stock
     * @returns {boolean}
     */
    isInStock() {
        return this.stock > 0;
    }

    /**
     * Verifica si el producto tiene una certificación específica
     * @param {string} certification 
     * @returns {boolean}
     */
    hasCertification(certification) {
        return this.certifications.includes(certification);
    }

    /**
     * Verifica si el producto coincide con un término de búsqueda
     * @param {string} searchTerm 
     * @returns {boolean}
     */
    matchesSearch(searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
            this.name.toLowerCase().includes(term) ||
            this.category.toLowerCase().includes(term) ||
            this.ingredients.some(ing => ing.toLowerCase().includes(term))
        );
    }

    /**
     * Verifica si el producto cumple con todos los filtros
     * @param {Array<string>} filters 
     * @returns {boolean}
     */
    matchesFilters(filters) {
        if (filters.length === 0) return true;
        return filters.every(filter => this.hasCertification(filter));
    }

    /**
     * Obtiene el precio formateado
     * @returns {string}
     */
    getFormattedPrice() {
        return `$${this.price.toLocaleString()}`;
    }

    /**
     * Reduce el stock del producto
     * @param {number} quantity 
     */
    reduceStock(quantity) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
        }
    }

    /**
     * Aumenta el stock del producto
     * @param {number} quantity 
     */
    increaseStock(quantity) {
        this.stock += quantity;
    }

    /**
     * Verifica si el stock está bajo
     * @returns {boolean}
     */
    isLowStock() {
        return this.stock > 0 && this.stock <= 5;
    }

    /**
     * Serializa el producto a JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            category: this.category,
            image: this.image,
            ingredients: this.ingredients,
            certifications: this.certifications,
            description: this.description,
            usage: this.usage,
            stock: this.stock,
            reviews: this.reviews
        };
    }
}