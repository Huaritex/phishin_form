// ===== FORM VALIDATION =====

class FormValidation {
    constructor() {
        this.form = null;
        this.progressFill = null;
        this.progressText = null;
        this.registeredCount = 0;
        
        this.init();
    }
    
    init() {
        this.form = document.getElementById('registration-form');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        
        if (this.form) {
            this.setupFormValidation();
            this.setupProgressTracking();
            this.setupSpecialEffects();
            this.setupFormSubmission();
        }
        
        this.updateRegisteredCount();
    }
    
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Validación en tiempo real
            input.addEventListener('input', () => {
                this.validateField(input);
                this.updateProgress();
            });
            
            // Validación al perder foco
            input.addEventListener('blur', () => {
                this.validateField(input);
                this.updateProgress();
            });
            
            // Efectos visuales
            input.addEventListener('focus', () => {
                this.addFocusEffect(input);
            });
            
            input.addEventListener('blur', () => {
                this.removeFocusEffect(input);
            });
        });
        
        // Validación de checkboxes
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateProgress();
                this.animateCheckbox(checkbox);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name || field.id;
        
        let isValid = true;
        let errorMessage = '';
        
        // Validaciones específicas por tipo de campo
        switch (fieldType) {
            case 'email':
                isValid = this.validateEmail(value);
                errorMessage = isValid ? '' : 'ERROR 404: Email format not found';
                break;
                
            case 'text':
                if (fieldName.includes('name') || fieldName.includes('nombre')) {
                    isValid = value.length >= 2;
                    errorMessage = isValid ? '' : 'ERROR: Name too short';
                } else {
                    isValid = value.length >= 1;
                    errorMessage = isValid ? '' : 'ERROR: Field required';
                }
                break;
                
            case 'select-one':
                isValid = value !== '';
                errorMessage = isValid ? '' : 'ERROR: Selection required';
                break;
                
            case 'textarea':
                isValid = value.length >= 10;
                errorMessage = isValid ? '' : 'ERROR: Minimum 10 characters required';
                break;
        }
        
        // Mostrar resultado de validación
        this.showValidationResult(field, isValid, errorMessage);
        
        return isValid;
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showValidationResult(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Remover mensajes anteriores
        const existingError = formGroup.querySelector('.error-message');
        const existingSuccess = formGroup.querySelector('.success-message');
        
        if (existingError) existingError.remove();
        if (existingSuccess) existingSuccess.remove();
        
        // Agregar nuevo mensaje
        if (!isValid && errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = errorMessage;
            errorDiv.style.cssText = `
                color: #ff0040;
                font-family: monospace;
                font-size: 0.8rem;
                margin-top: 0.5rem;
                animation: fadeIn 0.3s ease-out;
            `;
            
            formGroup.appendChild(errorDiv);
            field.classList.add('form-field-error');
            
            setTimeout(() => {
                field.classList.remove('form-field-error');
            }, 500);
        } else if (isValid && field.value.trim()) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = '✓ Access granted';
            successDiv.style.cssText = `
                color: #00ff41;
                font-family: monospace;
                font-size: 0.8rem;
                margin-top: 0.5rem;
                animation: fadeIn 0.3s ease-out;
            `;
            
            formGroup.appendChild(successDiv);
            field.classList.add('form-field-success');
            
            setTimeout(() => {
                field.classList.remove('form-field-success');
            }, 500);
        }
    }
    
    addFocusEffect(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('focused');
        }
        
        // Efecto de typing
        this.showTypingEffect(field);
    }
    
    removeFocusEffect(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('focused');
        }
    }
    
    showTypingEffect(field) {
        const effect = document.createElement('div');
        effect.className = 'typing-effect';
        effect.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border: 2px solid #00ff41;
            border-radius: 6px;
            pointer-events: none;
            z-index: 1000;
            animation: typing-glow 0.3s ease-out;
        `;
        
        field.parentNode.style.position = 'relative';
        field.parentNode.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 300);
    }
    
    animateCheckbox(checkbox) {
        const label = checkbox.closest('.specialization-item');
        if (label) {
            if (checkbox.checked) {
                label.classList.add('checked');
                this.showCheckboxSuccess(label);
            } else {
                label.classList.remove('checked');
            }
        }
    }
    
    showCheckboxSuccess(label) {
        const effect = document.createElement('div');
        effect.className = 'checkbox-success';
        effect.textContent = '✓ Specialization unlocked';
        effect.style.cssText = `
            position: absolute;
            top: -25px;
            right: 0;
            color: #00ff41;
            font-family: monospace;
            font-size: 0.7rem;
            animation: success-float 1s ease-out forwards;
        `;
        
        label.style.position = 'relative';
        label.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }
    
    setupProgressTracking() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        
        // Calcular progreso inicial
        this.updateProgress();
    }
    
    updateProgress() {
        if (!this.progressFill || !this.progressText) return;
        
        const inputs = this.form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        
        let completedFields = 0;
        let totalFields = inputs.length;
        
        // Contar campos completados
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                completedFields++;
            }
        });
        
        // Contar especializaciones seleccionadas
        const selectedSpecializations = this.form.querySelectorAll('input[type="checkbox"]:checked').length;
        const specializationBonus = Math.min(selectedSpecializations, 3); // Máximo 3 puntos bonus
        
        const progress = Math.min(100, ((completedFields + specializationBonus) / (totalFields + 3)) * 100);
        
        // Actualizar barra de progreso
        this.progressFill.style.width = progress + '%';
        
        // Actualizar texto de progreso
        const level = this.getAccessLevel(progress);
        this.progressText.textContent = `Nivel de acceso: ${level} (${Math.round(progress)}%)`;
        
        // Efectos visuales
        if (progress === 100) {
            this.progressFill.classList.add('animate-pulse-glow');
            this.showCompletionEffect();
        } else {
            this.progressFill.classList.remove('animate-pulse-glow');
        }
    }
    
    getAccessLevel(progress) {
        if (progress < 25) return 'Novato';
        if (progress < 50) return 'Aprendiz';
        if (progress < 75) return 'Intermedio';
        if (progress < 100) return 'Avanzado';
        return 'Hacker Ético';
    }
    
    showCompletionEffect() {
        const effect = document.createElement('div');
        effect.className = 'completion-effect';
        effect.innerHTML = `
            <div style="text-align: center; color: #00ff41; font-family: monospace;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎉</div>
                <div style="font-size: 1rem;">¡Perfil completo!</div>
                <div style="font-size: 0.8rem; color: #888;">Listo para iniciar misión</div>
            </div>
        `;
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 10, 0.95);
            border: 2px solid #00ff41;
            border-radius: 12px;
            padding: 2rem;
            z-index: 10000;
            animation: completion-popup 2s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }
    
    setupSpecialEffects() {
        // Efectos especiales para campos específicos
        const nameInput = this.form.querySelector('input[placeholder*="nombre"]');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                this.checkForEasterEggs(nameInput);
            });
        }
        
        const emailInput = this.form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                this.animateEmailValidation(emailInput);
            });
        }
    }
    
    checkForEasterEggs(input) {
        const value = input.value.toLowerCase();
        
        if (value.includes('neo')) {
            this.triggerNeoEffect(input);
        } else if (value.includes('hacker')) {
            this.triggerHackerEffect(input);
        } else if (value.includes('cyber')) {
            this.triggerCyberEffect(input);
        }
    }
    
    triggerNeoEffect(input) {
        const effect = document.createElement('div');
        effect.textContent = 'Welcome to the Matrix, Neo...';
        effect.style.cssText = `
            position: absolute;
            top: -30px;
            left: 0;
            color: #00ff41;
            font-family: monospace;
            font-size: 0.8rem;
            animation: neo-glow 2s ease-out;
        `;
        
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }
    
    triggerHackerEffect(input) {
        input.style.borderColor = '#ff0040';
        input.style.boxShadow = '0 0 20px #ff0040';
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 1000);
    }
    
    triggerCyberEffect(input) {
        const container = input.closest('.form-group');
        if (container) {
            container.style.animation = 'cyber-pulse 1s ease-in-out';
            
            setTimeout(() => {
                container.style.animation = '';
            }, 1000);
        }
    }
    
    animateEmailValidation(input) {
        const value = input.value;
        const isValid = this.validateEmail(value);
        
        if (value.length > 0) {
            input.style.borderColor = isValid ? '#00ff41' : '#ff0040';
            input.style.boxShadow = isValid ? '0 0 20px #00ff41' : '0 0 20px #ff0040';
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            } else {
                this.showFormErrors();
            }
        });
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Validar al menos una especialización
        const checkboxes = this.form.querySelectorAll('input[type="checkbox"]');
        const checkedBoxes = this.form.querySelectorAll('input[type="checkbox"]:checked');
        
        if (checkedBoxes.length === 0) {
            this.showSpecializationError();
            isValid = false;
        }
        
        return isValid;
    }
    
    showSpecializationError() {
        const specializationsContainer = this.form.querySelector('.specializations-grid');
        if (specializationsContainer) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'specialization-error';
            errorDiv.textContent = 'ERROR: Select at least one specialization';
            errorDiv.style.cssText = `
                color: #ff0040;
                font-family: monospace;
                font-size: 0.9rem;
                margin-top: 1rem;
                text-align: center;
                animation: shake 0.5s ease-in-out;
            `;
            
            specializationsContainer.appendChild(errorDiv);
            
            setTimeout(() => {
                if (errorDiv.parentNode) {
                    errorDiv.parentNode.removeChild(errorDiv);
                }
            }, 3000);
        }
    }
    
    showFormErrors() {
        const firstError = this.form.querySelector('.form-field-error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    submitForm() {
        // Simular envío del formulario
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        console.log('Form data:', data);
        
        // Mostrar efecto de envío exitoso
        this.showSubmissionSuccess();
        
        // Incrementar contador de registros
        this.registeredCount++;
        this.updateRegisteredCount();
        
        // Resetear formulario después de un delay
        setTimeout(() => {
            this.form.reset();
            this.updateProgress();
        }, 3000);
    }
    
    showSubmissionSuccess() {
        const successOverlay = document.createElement('div');
        successOverlay.className = 'submission-success';
        successOverlay.innerHTML = `
            <div style="text-align: center; color: #00ff41; font-family: monospace;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">MISIÓN INICIADA</div>
                <div style="font-size: 1rem; color: #888;">Tu perfil de hacker ético ha sido registrado</div>
                <div style="font-size: 0.8rem; color: #666; margin-top: 1rem;">
                    Preparando acceso a la matriz...
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
            animation: submission-overlay 3s ease-out forwards;
        `;
        
        document.body.appendChild(successOverlay);
        
        setTimeout(() => {
            if (successOverlay.parentNode) {
                successOverlay.parentNode.removeChild(successOverlay);
            }
        }, 3000);
    }
    
    updateRegisteredCount() {
        const countElement = document.getElementById('registered-count');
        if (countElement) {
            // Simular incremento gradual
            const targetCount = this.registeredCount + Math.floor(Math.random() * 50) + 100;
            this.animateCounter(countElement, targetCount);
        }
    }
    
    animateCounter(element, targetCount) {
        const startCount = parseInt(element.textContent) || 0;
        const increment = (targetCount - startCount) / 50;
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
}

// Inicializar validación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new FormValidation();
});

// Agregar estilos CSS adicionales para efectos de validación
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    @keyframes typing-glow {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes success-float {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
    
    @keyframes completion-popup {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes neo-glow {
        0%, 100% {
            text-shadow: 0 0 10px #00ff41;
        }
        50% {
            text-shadow: 0 0 20px #00ff41, 0 0 30px #00ff41;
        }
    }
    
    @keyframes cyber-pulse {
        0%, 100% {
            box-shadow: 0 0 20px #00d4ff;
        }
        50% {
            box-shadow: 0 0 40px #00d4ff, 0 0 60px #00d4ff;
        }
    }
    
    @keyframes submission-overlay {
        0% {
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        80% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    
    .form-group.focused {
        transform: scale(1.02);
    }
    
    .specialization-item.checked {
        border-color: #00ff41;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
    }
    
    .error-message {
        animation: fadeIn 0.3s ease-out;
    }
    
    .success-message {
        animation: fadeIn 0.3s ease-out;
    }
`;
document.head.appendChild(validationStyles);
