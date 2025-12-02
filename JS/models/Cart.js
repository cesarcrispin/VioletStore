/* ==========================================
   CART MODEL
   Modelo de datos para el carrito de compras
   Single Responsibility: Solo maneja lógica del carrito
   ========================================== */

export class Cart {
    constructor() {
        this.items = [];
        this.discountCode = null;
        this.discountPercentage = 0;
        console.log('✅ Cart creado');
    }

    /**
     * Agrega un producto al carrito
     * @param {Product} product 
     * @param {number} quantity 
     */
    addItem(product, quantity = 1) {
        console.log('📦 Cart.addItem llamado:', { 
            productId: product.id, 
            productName: product.name,
            quantity 
        });
        
        const existingItem = this.findItem(product.id);
        
        if (existingItem) {
            console.log('   → Item ya existe, incrementando cantidad');
            existingItem.quantity += quantity;
        } else {
            console.log('   → Agregando nuevo item');
            this.items.push({
                product: product,
                quantity: quantity
            });
        }
        
        console.log('   → Total items en carrito:', this.items.length);
        console.log('   → Total cantidad:', this.getTotalItems());
    }

    /**
     * Elimina un producto del carrito
     * @param {number} productId 
     */
    removeItem(productId) {
        console.log('🗑️ Cart.removeItem:', productId);
        this.items = this.items.filter(item => item.product.id !== productId);
    }

    /**
     * Actualiza la cantidad de un producto
     * @param {number} productId 
     * @param {number} quantity 
     */
    updateQuantity(productId, quantity) {
        console.log('🔄 Cart.updateQuantity:', { productId, quantity });
        
        if (quantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.findItem(productId);
        if (item) {
            item.quantity = quantity;
        }
    }

    /**
     * Busca un item en el carrito
     * @param {number} productId 
     * @returns {Object|undefined}
     */
    findItem(productId) {
        return this.items.find(item => item.product.id === productId);
    }

    /**
     * Calcula el subtotal (sin descuentos)
     * @returns {number}
     */
    getSubtotal() {
        return this.items.reduce((sum, item) => 
            sum + (item.product.price * item.quantity), 0
        );
    }

    /**
     * Calcula el monto del descuento
     * @returns {number}
     */
    getDiscountAmount() {
        if (this.discountPercentage === 0) return 0;
        return (this.getSubtotal() * this.discountPercentage) / 100;
    }

    /**
     * Calcula el total (con descuentos)
     * @returns {number}
     */
    getTotal() {
        return this.getSubtotal() - this.getDiscountAmount();
    }

    /**
     * Obtiene el total de items en el carrito
     * @returns {number}
     */
    getTotalItems() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Aplica un código de descuento
     * @param {string} code 
     * @param {number} percentage 
     */
    applyDiscount(code, percentage) {
        this.discountCode = code;
        this.discountPercentage = percentage;
    }

    /**
     * Remueve el descuento aplicado
     */
    removeDiscount() {
        this.discountCode = null;
        this.discountPercentage = 0;
    }

    /**
     * Limpia el carrito
     */
    clear() {
        console.log('🧹 Cart.clear - Limpiando carrito');
        this.items = [];
        this.removeDiscount();
    }

    /**
     * Verifica si el carrito está vacío
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    }

    /**
     * Obtiene todos los items del carrito
     * @returns {Array}
     */
    getItems() {
        return [...this.items];
    }

    /**
     * Serializa el carrito a JSON
     * @returns {Object}
     */
    toJSON() {
        return {
            items: this.items.map(item => ({
                productId: item.product.id,
                // Guardar solo datos necesarios, no la instancia completa
                product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    category: item.product.category,
                    image: item.product.image,
                    ingredients: item.product.ingredients,
                    certifications: item.product.certifications,
                    description: item.product.description,
                    usage: item.product.usage,
                    stock: item.product.stock,
                    reviews: item.product.reviews
                },
                quantity: item.quantity
            })),
            discountCode: this.discountCode,
            discountPercentage: this.discountPercentage
        };
    }

    /**
     * Carga el carrito desde JSON
     * @param {Object} data 
     */
    fromJSON(data) {
        if (!data) return;
        
        console.log('📥 Cart.fromJSON - Cargando datos:', data);

        this.items = [];
        this.discountCode = data.discountCode || null;
        this.discountPercentage = data.discountPercentage || 0;
        
        console.log('⚠️ Carrito cargado vacío (productos antiguos descartados)');
    }
}
