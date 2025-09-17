// ===== PARTICLE SYSTEM =====

class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.start();
        this.bindEvents();
    }
    
    createCanvas() {
        // Crear contenedor de partículas
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.6';
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createParticles() {
        const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Actualizar y dibujar partículas
        this.particles.forEach((particle, index) => {
            particle.update();
            particle.draw(this.ctx);
            
            // Conectar partículas cercanas
            for (let j = index + 1; j < this.particles.length; j++) {
                const otherParticle = this.particles[j];
                const distance = this.getDistance(particle, otherParticle);
                
                if (distance < 100) {
                    this.drawConnection(this.ctx, particle, otherParticle, distance);
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    getDistance(particle1, particle2) {
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    drawConnection(ctx, particle1, particle2, distance) {
        const opacity = (100 - distance) / 100;
        ctx.strokeStyle = `rgba(0, 255, 65, ${opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particle1.x, particle1.y);
        ctx.lineTo(particle2.x, particle2.y);
        ctx.stroke();
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.particles.forEach(particle => {
                particle.reset(this.canvas.width, this.canvas.height);
            });
        });
        
        // Pausar animaciones cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
}

class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.reset(canvasWidth, canvasHeight);
    }
    
    reset(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Variaciones de color cyberpunk
        this.colors = [
            'rgba(0, 255, 65, ',    // Verde matriz
            'rgba(0, 212, 255, ',   // Azul cyber
            'rgba(179, 0, 255, ',   // Púrpura neón
            'rgba(255, 0, 64, '     // Rojo alerta
        ];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Efecto de flotación suave
        this.vx += (Math.random() - 0.5) * 0.01;
        this.vy += (Math.random() - 0.5) * 0.01;
        
        // Limitar velocidad
        this.vx = Math.max(-1, Math.min(1, this.vx));
        this.vy = Math.max(-1, Math.min(1, this.vy));
        
        // Rebotar en los bordes
        if (this.x < 0 || this.x > this.canvasWidth) {
            this.vx *= -1;
        }
        if (this.y < 0 || this.y > this.canvasHeight) {
            this.vy *= -1;
        }
        
        // Mantener dentro del canvas
        this.x = Math.max(0, Math.min(this.canvasWidth, this.x));
        this.y = Math.max(0, Math.min(this.canvasHeight, this.y));
        
        // Variar opacidad
        this.opacity += (Math.random() - 0.5) * 0.02;
        this.opacity = Math.max(0.1, Math.min(0.7, this.opacity));
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color + '1)';
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Efectos de Matrix (código cayendo)
class MatrixEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.columns = [];
        this.fontSize = 14;
        this.animationId = null;
        this.isRunning = false;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.initColumns();
        this.start();
        this.bindEvents();
    }
    
    createCanvas() {
        const container = document.getElementById('particles-container');
        if (!container) return;
        
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-2';
        this.canvas.style.opacity = '0.1';
        
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.initColumns();
    }
    
    initColumns() {
        this.columns = [];
        const columnCount = Math.floor(this.canvas.width / this.fontSize);
        
        for (let i = 0; i < columnCount; i++) {
            this.columns.push({
                x: i * this.fontSize,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 1,
                chars: this.generateRandomChars(20)
            });
        }
    }
    
    generateRandomChars(length) {
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Efecto de desvanecimiento
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px monospace`;
        
        this.columns.forEach(column => {
            // Dibujar caracteres
            for (let i = 0; i < column.chars.length; i++) {
                const char = column.chars[i];
                const y = column.y - (i * this.fontSize);
                
                if (y > 0 && y < this.canvas.height) {
                    const opacity = Math.max(0, 1 - (i / column.chars.length));
                    this.ctx.globalAlpha = opacity;
                    this.ctx.fillText(char, column.x, y);
                }
            }
            
            // Mover columna
            column.y += column.speed;
            
            // Reiniciar columna cuando sale de pantalla
            if (column.y > this.canvas.height + (column.chars.length * this.fontSize)) {
                column.y = -column.chars.length * this.fontSize;
                column.chars = this.generateRandomChars(20);
            }
        });
        
        this.ctx.globalAlpha = 1;
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stop();
            } else {
                this.start();
            }
        });
    }
}

// Inicializar efectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario prefiere movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Inicializar sistema de partículas
        new ParticleSystem();
        
        // Inicializar efecto Matrix (opcional, más intenso)
        // new MatrixEffect();
    }
    
    // Agregar partículas flotantes adicionales
    createFloatingParticles();
});

// Crear partículas flotantes simples para elementos específicos
function createFloatingParticles() {
    const elements = document.querySelectorAll('.mission-card, .stat-item, .terminal-window');
    
    elements.forEach(element => {
        const particleCount = 3;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ff41;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.6;
                animation: float 4s ease-in-out infinite;
                animation-delay: ${i * 0.5}s;
            `;
            
            element.style.position = 'relative';
            element.appendChild(particle);
            
            // Posicionar partícula aleatoriamente
            const rect = element.getBoundingClientRect();
            particle.style.left = Math.random() * rect.width + 'px';
            particle.style.top = Math.random() * rect.height + 'px';
        }
    });
}

// Efectos de hover para partículas
document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('.nav-link, .submit-btn, .specialization-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            createHoverParticles(element);
        });
    });
});

function createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: #00ff41;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: particle-float 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
}

// Agregar estilos CSS para las animaciones de partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes particle-float {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) scale(0);
        }
    }
    
    .floating-particle {
        box-shadow: 0 0 10px #00ff41;
    }
`;
document.head.appendChild(style);
