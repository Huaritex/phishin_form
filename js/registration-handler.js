// ===== REGISTRATION HANDLER =====

class RegistrationHandler {
    constructor() {
        this.form = null;
        this.apiEndpoint = '/api/register';
        this.registrations = [];
        
        this.init();
    }
    
    init() {
        this.form = document.getElementById('registration-form');
        if (this.form) {
            this.setupFormSubmission();
            this.loadExistingRegistrations();
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }
    
    async handleFormSubmission() {
        const formData = this.collectFormData();
        
        if (this.validateFormData(formData)) {
            this.showLoadingState();
            
            try {
                const response = await this.submitRegistration(formData);
                
                if (response.success) {
                    this.showSuccessState();
                    this.updateRegistrationCount();
                    this.resetForm();
                } else {
                    this.showErrorState(response.message);
                }
            } catch (error) {
                console.error('Error submitting registration:', error);
                this.showErrorState('Error de conexión. Intenta nuevamente.');
            }
        } else {
            this.showValidationErrors();
        }
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Recopilar datos básicos
        for (let [key, value] of formData.entries()) {
            if (key === 'specialization') {
                if (!data.specializations) data.specializations = [];
                data.specializations.push(value);
            } else {
                data[key] = value;
            }
        }
        
        // Agregar metadatos
        data.timestamp = new Date().toISOString();
        data.id = this.generateId();
        data.ip = 'unknown'; // Se puede obtener del servidor
        data.userAgent = navigator.userAgent;
        
        return data;
    }
    
    validateFormData(data) {
        const requiredFields = ['nombre', 'email', 'universidad', 'carrera', 'nivel_academico', 'motivacion', 'acepta_terminos'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        
        // Validar que al menos una especialización esté seleccionada
        if (!data.specializations || data.specializations.length === 0) {
            return false;
        }
        
        return true;
    }
    
    async submitRegistration(data) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            // Si no hay servidor, guardar localmente
            console.warn('Server not available, saving locally:', error);
            return this.saveLocally(data);
        }
    }
    
    saveLocally(data) {
        try {
            // Cargar registros existentes
            let existingRegistrations = [];
            const stored = localStorage.getItem('cyber_registrations');
            if (stored) {
                existingRegistrations = JSON.parse(stored);
            }
            
            // Agregar nuevo registro
            existingRegistrations.push(data);
            
            // Guardar en localStorage
            localStorage.setItem('cyber_registrations', JSON.stringify(existingRegistrations));
            
            // También intentar guardar en archivo (para desarrollo)
            this.saveToFile(existingRegistrations);
            
            return { success: true, message: 'Registro guardado localmente' };
        } catch (error) {
            console.error('Error saving locally:', error);
            return { success: false, message: 'Error al guardar el registro' };
        }
    }
    
    async saveToFile(registrations) {
        try {
            // Crear un blob con los datos
            const dataStr = JSON.stringify(registrations, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `cyber_registrations_${new Date().toISOString().split('T')[0]}.json`;
            
            // Descargar automáticamente (solo para desarrollo)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                link.click();
            }
        } catch (error) {
            console.error('Error saving to file:', error);
        }
    }
    
    loadExistingRegistrations() {
        try {
            const stored = localStorage.getItem('cyber_registrations');
            if (stored) {
                this.registrations = JSON.parse(stored);
                this.updateRegistrationCount();
            }
        } catch (error) {
            console.error('Error loading registrations:', error);
        }
    }
    
    updateRegistrationCount() {
        const countElement = document.getElementById('registered-count');
        if (countElement) {
            const currentCount = parseInt(countElement.textContent) || 0;
            const newCount = this.registrations.length;
            
            if (newCount > currentCount) {
                this.animateCounter(countElement, currentCount, newCount);
            }
        }
    }
    
    animateCounter(element, startCount, targetCount) {
        const increment = (targetCount - startCount) / 30;
        let currentCount = startCount;
        
        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
                currentCount = targetCount;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentCount);
        }, 50);
    }
    
    generateId() {
        return 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    showLoadingState() {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = document.getElementById('loading-spinner');
        
        if (btnText && spinner) {
            btnText.style.opacity = '0';
            spinner.style.opacity = '1';
            submitBtn.disabled = true;
        }
    }
    
    showSuccessState() {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = document.getElementById('loading-spinner');
        
        if (btnText && spinner) {
            btnText.style.opacity = '1';
            spinner.style.opacity = '0';
            submitBtn.disabled = false;
        }
        
        // Mostrar mensaje de éxito
        this.showSuccessMessage();
    }
    
    showErrorState(message) {
        const submitBtn = document.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = document.getElementById('loading-spinner');
        
        if (btnText && spinner) {
            btnText.style.opacity = '1';
            spinner.style.opacity = '0';
            submitBtn.disabled = false;
        }
        
        // Mostrar mensaje de error
        this.showErrorMessage(message);
    }
    
    showSuccessMessage() {
        const successOverlay = document.createElement('div');
        successOverlay.className = 'success-overlay';
        successOverlay.innerHTML = `
            <div class="success-content">
                <div class="success-icon">🚀</div>
                <h2>¡MISIÓN INICIADA!</h2>
                <p>Tu perfil de hacker ético ha sido registrado exitosamente.</p>
                <div class="success-details">
                    <div class="detail-item">
                        <span class="detail-label">ID de Registro:</span>
                        <span class="detail-value" id="registration-id">Generando...</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Fecha:</span>
                        <span class="detail-value">${new Date().toLocaleDateString('es-ES')}</span>
                    </div>
                </div>
                <div class="success-actions">
                    <button class="btn-secondary" onclick="this.closest('.success-overlay').remove()">Cerrar</button>
                    <button class="btn-primary" onclick="window.location.href='index.html'">Volver al Inicio</button>
                </div>
            </div>
        `;
        
        successOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: success-overlay 0.5s ease-out;
        `;
        
        document.body.appendChild(successOverlay);
        
        // Generar ID de registro
        const registrationId = this.generateId();
        const idElement = document.getElementById('registration-id');
        if (idElement) {
            idElement.textContent = registrationId;
        }
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.parentNode.removeChild(successOverlay);
            }
        }, 5000);
    }
    
    showErrorMessage(message) {
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'error-overlay';
        errorOverlay.innerHTML = `
            <div class="error-content">
                <div class="error-icon">⚠️</div>
                <h2>ERROR DE REGISTRO</h2>
                <p>${message}</p>
                <button class="btn-primary" onclick="this.closest('.error-overlay').remove()">Intentar Nuevamente</button>
            </div>
        `;
        
        errorOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 10, 10, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: error-overlay 0.5s ease-out;
        `;
        
        document.body.appendChild(errorOverlay);
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            if (errorOverlay.parentNode) {
                errorOverlay.parentNode.removeChild(errorOverlay);
            }
        }, 3000);
    }
    
    showValidationErrors() {
        const firstError = this.form.querySelector('.form-field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    resetForm() {
        setTimeout(() => {
            this.form.reset();
            
            // Limpiar mensajes de validación
            const errorMessages = this.form.querySelectorAll('.error-message, .success-message');
            errorMessages.forEach(msg => msg.remove());
            
            // Resetear progreso
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('progress-text');
            
            if (progressFill) progressFill.style.width = '0%';
            if (progressText) progressText.textContent = 'Nivel de acceso: 0%';
        }, 2000);
    }
}

// Servidor simple para desarrollo
class SimpleServer {
    constructor() {
        this.registrations = [];
        this.init();
    }
    
    init() {
        // Cargar registros existentes si existen
        this.loadRegistrations();
        
        // Interceptar requests POST a /api/register
        this.setupAPI();
    }
    
    loadRegistrations() {
        try {
            const stored = localStorage.getItem('cyber_registrations');
            if (stored) {
                this.registrations = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading registrations:', error);
        }
    }
    
    setupAPI() {
        // Interceptar fetch requests
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
            if (url === '/api/register' && options && options.method === 'POST') {
                return this.handleRegistration(options.body);
            }
            return originalFetch(url, options);
        };
    }
    
    async handleRegistration(body) {
        try {
            const data = JSON.parse(body);
            
            // Validar datos
            if (!this.validateRegistration(data)) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Datos de registro inválidos'
                }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            
            // Agregar registro
            this.registrations.push(data);
            
            // Guardar en localStorage
            localStorage.setItem('cyber_registrations', JSON.stringify(this.registrations));
            
            // Guardar en archivo
            this.saveToFile();
            
            return new Response(JSON.stringify({
                success: true,
                message: 'Registro exitoso',
                id: data.id
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
            
        } catch (error) {
            console.error('Error handling registration:', error);
            return new Response(JSON.stringify({
                success: false,
                message: 'Error interno del servidor'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
    
    validateRegistration(data) {
        const requiredFields = ['nombre', 'email', 'universidad', 'carrera', 'nivel_academico', 'motivacion'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return false;
            }
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        
        return true;
    }
    
    saveToFile() {
        try {
            const dataStr = JSON.stringify(this.registrations, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Crear enlace de descarga
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `cyber_registrations_${new Date().toISOString().split('T')[0]}.json`;
            
            // Descargar automáticamente
            link.click();
            
            // Limpiar URL
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        } catch (error) {
            console.error('Error saving to file:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationHandler();
    new SimpleServer();
});

// Agregar estilos CSS para los overlays
const overlayStyles = document.createElement('style');
overlayStyles.textContent = `
    @keyframes success-overlay {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes error-overlay {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .success-content,
    .error-content {
        background: var(--bg-secondary);
        border: 2px solid var(--accent-green);
        border-radius: 12px;
        padding: 3rem;
        text-align: center;
        max-width: 500px;
        box-shadow: var(--glow-green);
    }
    
    .error-content {
        border-color: var(--accent-red);
        box-shadow: var(--glow-red);
    }
    
    .success-icon,
    .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }
    
    .success-content h2,
    .error-content h2 {
        color: var(--accent-green);
        margin-bottom: 1rem;
        text-shadow: var(--glow-green);
    }
    
    .error-content h2 {
        color: var(--accent-red);
        text-shadow: var(--glow-red);
    }
    
    .success-details {
        margin: 2rem 0;
        text-align: left;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        padding: 0.5rem;
        background: var(--bg-tertiary);
        border-radius: 4px;
    }
    
    .detail-label {
        color: var(--text-secondary);
        font-family: var(--font-mono);
    }
    
    .detail-value {
        color: var(--accent-green);
        font-family: var(--font-mono);
        font-weight: 600;
    }
    
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .btn-primary,
    .btn-secondary {
        padding: 1rem 2rem;
        border: none;
        border-radius: 6px;
        font-family: var(--font-primary);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: var(--transition-normal);
    }
    
    .btn-primary {
        background: linear-gradient(45deg, var(--accent-green), var(--accent-blue));
        color: var(--bg-primary);
    }
    
    .btn-secondary {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border: 2px solid var(--accent-green);
    }
    
    .btn-primary:hover,
    .btn-secondary:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 255, 65, 0.3);
    }
`;
document.head.appendChild(overlayStyles);
