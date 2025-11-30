/* ==========================================
   Controlador principal de la aplicación
   ========================================== */

import { DataService } from '../services/DataService.js';
import { StorageService } from '../services/StorageService.js';
import { NotificationService } from '../services/NotificationService.js';
import { ProductController } from './ProductController.js';
import { CartController } from './CartController.js';
import { AuthController } from './AuthController.js';
import { NavigationController } from './NavigationController.js';
import { HomeView } from '../views/HomeView.js';
import { CartView } from '../views/CartView.js';
import { AuthView } from '../views/AuthView.js';
import { ProfileView } from '../views/ProfileView.js';
import { BlogView } from '../views/BlogView.js';
import { AdvisorView } from '../views/AdvisorView.js';
import { ProductView } from '../views/ProductView.js';
import { Order } from '../models/Order.js';
import { VIEWS, EVENTS } from '../config/constants.js';

export class AppController {
    constructor() {
        // Services
        this.dataService = new DataService();
        this.storageService = new StorageService();
        this.notificationService = new NotificationService();

        // Controllers
        this.navigationController = new NavigationController();
        this.authController = new AuthController();
        this.cartController = new CartController();
        this.productController = null;

        // Views
        this.homeView = new HomeView();
        this.cartView = new CartView();
        this.authView = new AuthView();
        this.profileView = new ProfileView();
        this.blogView = new BlogView();
        this.advisorView = new AdvisorView();
        this.productView = new ProductView();

        // State
        this.isInitialized = false;
        this.orderHistory = [];
        this.blogPosts = [];
        this.discountCodes = [];
    }

    async init() {
        try {
            console.log('🚀 Inicializando VioletStore...');

            await this.loadData();

            this.setupFilters();

            this.setupGlobalListeners();
            this.setupUIHandlers();

            this.loadOrderHistory();

            this.navigationController.navigateTo(VIEWS.HOME);

            this.renderProducts();

            this.updateCartBadge();

            this.isInitialized = true;

            console.log('✅ VioletStore inicializado correctamente');
            this.notificationService.success('¡Bienvenido a VioletStore!');
        } catch (error) {
            console.error('❌ Error al inicializar:', error);
            this.notificationService.error('Error al cargar la aplicación');
        }
    }

    async loadData() {
        const data = await this.dataService.loadData();
        
        this.productController = new ProductController(data.products);
        this.blogPosts = data.blogPosts;
        this.discountCodes = data.discountCodes;

        console.log(`📦 Cargados ${data.products.length} productos`);
    }

    setupFilters() {
        const certifications = this.productController.getCertifications();
        this.homeView.renderFilters(certifications);
    }

    setupGlobalListeners() {
        document.addEventListener(EVENTS.CART_UPDATED, () => {
            this.updateCartBadge();
        });

        document.addEventListener(EVENTS.USER_LOGGED_IN, () => {
            this.handleAuthChange();
        });

        document.addEventListener(EVENTS.USER_LOGGED_OUT, () => {
            this.handleAuthChange();
        });

        document.addEventListener(EVENTS.VIEW_CHANGED, (e) => {
            this.handleViewChange(e.detail.view, e.detail.data);
        });
    }

    setupUIHandlers() {
        this.setupNavigation();
        this.setupSearch();
        this.setupFilters();
        this.setupAuth();
        this.setupAdvisor();
    }

    setupNavigation() {
        this.navigationController.setupNavLinks();

        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                this.navigationController.navigateTo(VIEWS.CART);
            });
        }

        const userBtn = document.getElementById('userBtn');
        if (userBtn) {
            userBtn.addEventListener('click', () => {
                if (this.authController.isAuthenticated()) {
                    this.navigationController.navigateTo(VIEWS.PROFILE);
                } else {
                    this.navigationController.navigateTo(VIEWS.LOGIN);
                }
            });
        }

        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                mainNav.classList.toggle('active');
            });
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.productController.setSearchTerm(e.target.value);
                this.renderProducts();
            });
        }
    }

    setupFilters() {
        const filterButtons = document.getElementById('filterButtons');
        if (filterButtons) {
            filterButtons.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    const filter = e.target.dataset.filter;
                    e.target.classList.toggle('active');
                    this.productController.toggleFilter(filter);
                    this.renderProducts();
                }
            });
        }
    }

    setupAuth() {
        const authForm = document.getElementById('authForm');
        const toggleAuthMode = document.getElementById('toggleAuthMode');

        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAuthSubmit();
            });
        }

        if (toggleAuthMode) {
            toggleAuthMode.addEventListener('click', () => {
                this.toggleAuthMode();
            });
        }
    }

    setupAdvisor() {
        const advisorForm = document.getElementById('advisorForm');
        if (advisorForm) {
            advisorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdvisorSubmit();
            });
        }
    }

    renderProducts() {
        const products = this.productController.getFilteredProducts();
        this.homeView.render(products);
        
        //listeners de productos
        this.setupProductListeners();
    }

    setupProductListeners() {
        // Ver detalle
        document.querySelectorAll('.btn-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.showProductDetail(productId);
            });
        });

        // Agregar al carrito
        document.querySelectorAll('.btn-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const product = this.productController.getProductById(productId);
                if (product) {
                    this.cartController.addProduct(product);
                }
            });
        });
    }

    showProductDetail(productId) {
        const product = this.productController.getProductById(productId);
        if (!product) return;

        this.productView.render(product);

        // Listener para agregar al carrito desde el modal
        const addBtn = document.getElementById('addToCartModal');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.cartController.addProduct(product);
                this.productView.hideModal();
            });
        }

        // Listener para cerrar modal
        const closeBtn = document.getElementById('closeModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.productView.hideModal();
            });
        }
    }

    handleViewChange(view, data) {
        switch(view) {
            case VIEWS.HOME:
                this.renderProducts();
                break;
            case VIEWS.CART:
                this.renderCart();
                break;
            case VIEWS.PROFILE:
                if (this.authController.isAuthenticated()) {
                    this.renderProfile();
                } else {
                    this.navigationController.navigateTo(VIEWS.LOGIN);
                }
                break;
            case VIEWS.BLOG:
                this.renderBlog();
                break;
            case VIEWS.LOGIN:
                this.authView.render(this.authController.getMode());
                break;
        }
    }

    renderCart() {
        const cartData = {
            items: this.cartController.getItems(),
            subtotal: this.cartController.getSubtotal(),
            discount: this.cartController.getDiscountAmount(),
            total: this.cartController.getTotal(),
            isEmpty: this.cartController.isEmpty()
        };

        this.cartView.render(cartData);
        this.setupCartListeners();
    }

    setupCartListeners() {
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                const action = e.target.dataset.action;
                
                if (action === 'increment') {
                    this.cartController.incrementQuantity(productId);
                } else {
                    this.cartController.decrementQuantity(productId);
                }
                
                this.renderCart();
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.productId);
                this.cartController.removeProduct(productId);
                this.renderCart();
            });
        });

        const applyDiscountBtn = document.getElementById('applyDiscountBtn');
        if (applyDiscountBtn) {
            applyDiscountBtn.addEventListener('click', () => {
                this.applyDiscount();
            });
        }

        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.processCheckout();
            });
        }
    }

    async applyDiscount() {
        const codeInput = document.getElementById('discountCode');
        const code = codeInput.value.toUpperCase().trim();

        if (!code) {
            this.notificationService.warning('Ingresa un código de descuento');
            return;
        }

        const discountData = await this.dataService.validateDiscountCode(code);
        
        if (discountData) {
            this.cartController.applyDiscountCode(code, discountData);
            this.renderCart();
        }
    }

    processCheckout() {
        if (!this.authController.requireAuth()) {
            this.navigationController.navigateTo(VIEWS.LOGIN);
            return;
        }

        const validation = this.cartController.validateCheckout();
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                this.notificationService.error(error);
            });
            return;
        }

        const user = this.authController.getCurrentUser();
        const order = Order.fromCart(this.cartController.getCart(), user.email);

        this.storageService.addOrder(order);
        this.orderHistory.push(order);

        this.cartController.clearCart();
        this.notificationService.success('¡Pedido realizado con éxito!');
        this.navigationController.navigateTo(VIEWS.PROFILE);
    }

    renderProfile() {
        const user = this.authController.getCurrentUser();
        if (!user) return;

        this.profileView.render({
            user: user,
            orders: this.orderHistory
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.authController.logout();
                this.navigationController.navigateTo(VIEWS.HOME);
            });
        }
    }

    renderBlog() {
        this.blogView.render(this.blogPosts);
    }

    async handleAuthSubmit() {
        const values = this.authView.getFormValues();

        if (this.authController.getMode()) {
            const validation = this.authController.validateLogin(values.email, values.password);
            if (!validation.isValid) {
                validation.errors.forEach(error => {
                    this.notificationService.error(error);
                });
                return;
            }

            try {
                await this.authController.login(values.email, values.password);
                this.authView.clearForm();
                this.navigationController.navigateTo(VIEWS.HOME);
            } catch (error) {

            }
        } else {
            const validation = this.authController.validateRegister(values.name, values.email, values.password);
            
            if (!validation.isValid) {
                validation.errors.forEach(error => {
                    this.notificationService.error(error);
                });
                return;
            }

            try {
                await this.authController.register(values.name, values.email, values.password);
                this.authView.clearForm();
                this.navigationController.navigateTo(VIEWS.HOME);
            } catch (error) {

            }
        }
    }

    toggleAuthMode() {
        const isLogin = this.authController.toggleMode();
        this.authView.updateMode(isLogin);
    }

    handleAuthChange() {
        this.updateCartBadge();
    }

    handleAdvisorSubmit() {
        const message = this.advisorView.getMessage();
        
        if (message.trim()) {
            this.notificationService.success('¡Mensaje enviado! Un asesor se contactará contigo pronto.');
            this.advisorView.clearForm();
        }
    }

    updateCartBadge() {
        const badge = document.getElementById('cartBadge');
        const totalItems = this.cartController.getTotalItems();
        if (badge) {
            badge.textContent = totalItems;
        }
    }

    loadOrderHistory() {
        const ordersData = this.storageService.getOrderHistory();
        this.orderHistory = ordersData.map(data => Order.fromJSON(data));
    }
}