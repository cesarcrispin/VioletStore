import { AppController } from './controllers/AppController.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Inicializando VioletStore...');
        
        // Crea la instancia del controlador principal
        const app = new AppController();
        
        // Inicializar la aplicación
        await app.init();
        
        // Hacer disponible globalmente para debugging
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.app = app;
            console.log('🔧 App disponible en window.app para debugging');
        }
        
        console.log('✨ VioletStore inicializado correctamente');
    } catch (error) {
        console.error('❌ Error crítico al inicializar la aplicación:', error);
        
        // Mostrar mensaje de error al usuario
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #f9fafb;
                padding: 2rem;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    text-align: center;
                ">
                    <h1 style="color: #dc2626; margin-bottom: 1rem;">
                        Error al cargar la aplicación
                    </h1>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">
                        Ha ocurrido un error al inicializar VioletStore.
                        Por favor, recarga la página o contacta al soporte.
                    </p>
                    <button 
                        onclick="window.location.reload()"
                        style="
                            background-color: #ff4fbf;
                            color: white;
                            padding: 0.75rem 1.5rem;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                        "
                    >
                        Recargar Página
                    </button>
                </div>
            </div>
        `;
    }
});

/**
 * Manejo de errores globales
 */
window.addEventListener('error', (event) => {
    console.error('Error global capturado:', event.error);
});

/**
 * Manejo de promesas rechazadas
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promesa rechazada no manejada:', event.reason);
});

/**
 * Cleanup antes de cerrar/recargar
 */
window.addEventListener('beforeunload', () => {
    console.log('👋 Cerrando VioletStore...');
});