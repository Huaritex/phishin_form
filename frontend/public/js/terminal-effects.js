// ===== TERMINAL EFFECTS =====

class TerminalEffects {
    constructor() {
        this.typingTexts = [
            'hack_access --target=profesional_day.exe',
            'sudo ./init_cyber_career.sh',
            'python3 decode_future.py --student-mode',
            'nmap -sS -O cyber_security_industry',
            'metasploit> exploit career_path',
            'john --wordlist=passwords.txt future.hash',
            'wireshark -i eth0 -f "tcp port 443"',
            'nmap -sV -sC target_university.edu'
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }
    
    init() {
        this.setupTypingEffect();
        this.setupCountdown();
        this.setupTerminalInteractions();
        this.setupGlitchEffects();
    }
    
    setupTypingEffect() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        this.typeText();
    }
    
    typeText() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;
        
        const currentText = this.typingTexts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Borrando texto
            typingElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
                setTimeout(() => this.typeText(), this.pauseTime);
                return;
            }
            
            setTimeout(() => this.typeText(), this.deletingSpeed);
        } else {
            // Escribiendo texto
            typingElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.typeText();
                }, this.pauseTime);
                return;
            }
            
            setTimeout(() => this.typeText(), this.typingSpeed);
        }
    }
    
    setupCountdown() {
        // Fecha objetivo (puedes cambiar esta fecha)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30); // 30 días desde ahora
        
        this.updateCountdown(targetDate);
        
        // Actualizar cada segundo
        setInterval(() => {
            this.updateCountdown(targetDate);
        }, 1000);
    }
    
    updateCountdown(targetDate) {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            // El evento ya pasó
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Actualizar elementos con animación
        this.animateNumber('days', days);
        this.animateNumber('hours', hours);
        this.animateNumber('minutes', minutes);
        this.animateNumber('seconds', seconds);
    }
    
    animateNumber(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== newValue) {
            element.classList.add('counter-animate');
            element.textContent = newValue.toString().padStart(2, '0');
            
            setTimeout(() => {
                element.classList.remove('counter-animate');
            }, 500);
        }
    }
    
    setupTerminalInteractions() {
        const terminalWindow = document.querySelector('.terminal-window');
        if (!terminalWindow) return;
        
        // Efecto de hover en terminal
        terminalWindow.addEventListener('mouseenter', () => {
            terminalWindow.style.transform = 'scale(1.02)';
            terminalWindow.style.boxShadow = '0 0 40px #00ff41, 0 0 80px #00ff41';
        });
        
        terminalWindow.addEventListener('mouseleave', () => {
            terminalWindow.style.transform = 'scale(1)';
            terminalWindow.style.boxShadow = '0 0 20px #00ff41';
        });
        
        // Efecto de click en terminal
        terminalWindow.addEventListener('click', () => {
            this.triggerTerminalGlitch();
        });
        
        // Efectos en botones de terminal
        const terminalButtons = document.querySelectorAll('.btn');
        terminalButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.animateTerminalButton(button);
            });
        });
    }
    
    triggerTerminalGlitch() {
        const terminalWindow = document.querySelector('.terminal-window');
        const terminalBody = document.querySelector('.terminal-body');
        
        if (!terminalWindow || !terminalBody) return;
        
        // Efecto de glitch
        terminalWindow.classList.add('animate-glitch');
        terminalBody.classList.add('animate-glitch-text');
        
        // Agregar texto de glitch temporal
        const glitchText = document.createElement('div');
        glitchText.className = 'glitch-text';
        glitchText.textContent = 'ERROR: Unauthorized access detected!';
        glitchText.style.cssText = `
            color: #ff0040;
            font-family: monospace;
            margin-top: 1rem;
            animation: glitch-text 0.5s ease-in-out;
        `;
        
        terminalBody.appendChild(glitchText);
        
        setTimeout(() => {
            terminalWindow.classList.remove('animate-glitch');
            terminalBody.classList.remove('animate-glitch-text');
            if (glitchText.parentNode) {
                glitchText.parentNode.removeChild(glitchText);
            }
        }, 1000);
    }
    
    animateTerminalButton(button) {
        button.style.transform = 'scale(0.9)';
        button.style.opacity = '0.7';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.opacity = '1';
        }, 150);
    }
    
    setupGlitchEffects() {
        // Efectos de glitch aleatorios en títulos
        const titles = document.querySelectorAll('.section-title, .countdown-title');
        
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                this.triggerGlitchEffect(title);
            });
        });
        
        // Efectos de glitch periódicos
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% de probabilidad cada 5 segundos
                const randomTitle = titles[Math.floor(Math.random() * titles.length)];
                this.triggerGlitchEffect(randomTitle);
            }
        }, 5000);
    }
    
    triggerGlitchEffect(element) {
        if (!element) return;
        
        element.classList.add('animate-glitch-text');
        
        setTimeout(() => {
            element.classList.remove('animate-glitch-text');
        }, 300);
    }
}

// Efectos de sonido simulados (visuales)
class SoundEffects {
    constructor() {
        this.setupKeyboardSounds();
        this.setupHoverSounds();
    }
    
    setupKeyboardSounds() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('keydown', () => {
                this.showKeyboardEffect(input);
            });
        });
    }
    
    setupHoverSounds() {
        const interactiveElements = document.querySelectorAll('.nav-link, .submit-btn, .specialization-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.showHoverEffect(element);
            });
        });
    }
    
    showKeyboardEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'keyboard-effect';
        effect.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ff41;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${element.offsetLeft + Math.random() * element.offsetWidth}px;
            top: ${element.offsetTop + Math.random() * element.offsetHeight}px;
            animation: keyboard-pulse 0.3s ease-out;
        `;
        
        element.parentNode.style.position = 'relative';
        element.parentNode.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 300);
    }
    
    showHoverEffect(element) {
        const effect = document.createElement('div');
        effect.className = 'hover-effect';
        effect.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            border: 1px solid #00ff41;
            border-radius: 4px;
            pointer-events: none;
            z-index: 1000;
            left: 0;
            top: 0;
            animation: hover-glow 0.5s ease-out;
        `;
        
        element.style.position = 'relative';
        element.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 500);
    }
}

// Efectos de carga
class LoadingEffects {
    constructor() {
        this.setupLoadingAnimations();
    }
    
    setupLoadingAnimations() {
        // Efecto de carga para el botón de envío
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                const form = document.getElementById('registration-form');
                if (form && form.checkValidity()) {
                    this.showLoadingEffect(submitBtn);
                }
            });
        }
    }
    
    showLoadingEffect(button) {
        const spinner = document.getElementById('loading-spinner');
        const btnText = button.querySelector('.btn-text');
        
        if (spinner && btnText) {
            btnText.style.opacity = '0';
            spinner.style.opacity = '1';
            
            // Simular carga
            setTimeout(() => {
                btnText.style.opacity = '1';
                spinner.style.opacity = '0';
                this.showSuccessEffect(button);
            }, 2000);
        }
    }
    
    showSuccessEffect(button) {
        button.classList.add('animate-success-bounce');
        button.classList.add('animate-success-glow');
        
        // Cambiar texto temporalmente
        const btnText = button.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'MISIÓN INICIADA!';
        
        setTimeout(() => {
            button.classList.remove('animate-success-bounce');
            button.classList.remove('animate-success-glow');
            btnText.textContent = originalText;
        }, 2000);
    }
}

// Efectos de easter eggs
class EasterEggs {
    constructor() {
        this.setupEasterEggs();
    }
    
    setupEasterEggs() {
        // Comando secreto en inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
        
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                this.checkEasterEggCommands(input, e);
            });
        });
        
        // Konami Code
        this.setupKonamiCode();
    }
    
    checkEasterEggCommands(input, event) {
        const value = input.value.toLowerCase();
        
        if (value.includes('sudo') && event.key === 'Enter') {
            this.triggerSudoEffect(input);
        } else if (value.includes('hack') && event.key === 'Enter') {
            this.triggerHackEffect(input);
        } else if (value.includes('matrix') && event.key === 'Enter') {
            this.triggerMatrixEffect(input);
        }
    }
    
    triggerSudoEffect(input) {
        input.style.borderColor = '#00ff41';
        input.style.boxShadow = '0 0 20px #00ff41';
        
        const message = document.createElement('div');
        message.textContent = 'Access granted: Root privileges activated!';
        message.style.cssText = `
            color: #00ff41;
            font-family: monospace;
            font-size: 0.8rem;
            margin-top: 0.5rem;
            animation: fadeIn 0.5s ease-out;
        `;
        
        input.parentNode.appendChild(message);
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }
    
    triggerHackEffect(input) {
        const container = input.closest('.form-group');
        if (container) {
            container.classList.add('animate-glitch');
            
            setTimeout(() => {
                container.classList.remove('animate-glitch');
            }, 1000);
        }
    }
    
    triggerMatrixEffect(input) {
        const body = document.body;
        body.style.animation = 'glitch 0.5s ease-in-out';
        
        setTimeout(() => {
            body.style.animation = '';
        }, 500);
    }
    
    setupKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                
                if (konamiIndex === konamiCode.length) {
                    this.triggerKonamiEffect();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }
    
    triggerKonamiEffect() {
        // Efecto especial del Konami Code
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #00ff41, #00d4ff, #b300ff, #ff0040);
            z-index: 9999;
            animation: konami-rainbow 2s ease-in-out;
            pointer-events: none;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 2000);
    }
}

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new TerminalEffects();
    new SoundEffects();
    new LoadingEffects();
    new EasterEggs();
});

// Agregar estilos CSS adicionales para efectos
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes keyboard-pulse {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
    
    @keyframes hover-glow {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
            transform: scale(1.1);
        }
        100% {
            opacity: 0;
            transform: scale(1.2);
        }
    }
    
    @keyframes konami-rainbow {
        0% {
            opacity: 0;
            transform: scale(0.8);
        }
        50% {
            opacity: 0.8;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(1.2);
        }
    }
    
    .glitch-text {
        animation: glitch-text 0.5s ease-in-out;
    }
    
    .keyboard-effect {
        box-shadow: 0 0 10px #00ff41;
    }
    
    .hover-effect {
        box-shadow: 0 0 20px #00ff41;
    }
`;
document.head.appendChild(additionalStyles);
