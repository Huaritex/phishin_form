# 🚀 Profesional por un Día - Cyber Revolution

Una aplicación web inmersiva con temática cyberpunk para el evento "Profesional por un Día" enfocado en ciberseguridad.

## 🎯 Características Principales

### 🎨 Identidad Visual Cyberpunk
- **Paleta de colores**: Negro profundo con acentos verde matriz, azul cyber, púrpura neón y rojo alerta
- **Efectos visuales**: Líneas de código deslizándose, bordes con glow neón, efectos de glitch
- **Tipografías**: Orbitron para títulos y Source Code Pro para elementos de terminal

### 🎮 Experiencia Gamificada
- **Terminal interactivo** que simula "hackear" acceso al evento
- **Countdown timer** con estética de consola
- **Formulario de registro** con progreso mostrado como "niveles de acceso"
- **Validación gamificada** con mensajes estilo terminal
- **Easter eggs** y comandos secretos

### 🔐 Áreas de Especialización
- Ethical Hacking & Penetration Testing
- Incident Response & Forensics
- Security Architecture & Engineering
- Threat Intelligence & Analysis
- Governance, Risk & Compliance
- Cloud Security & DevSecOps
- Malware Analysis & Reverse Engineering
- Social Engineering & Human Factors

### ⚡ Efectos Interactivos
- **Sistema de partículas** con conexiones dinámicas
- **Efectos de typing** en tiempo real
- **Animaciones de hover** con sonidos visuales
- **Efectos de glitch** aleatorios
- **Loading screens** con ASCII art
- **Efectos Matrix** opcionales

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos cyberpunk con animaciones avanzadas
- **JavaScript ES6+** - Interactividad y efectos
- **Python** - Servidor backend para manejo de datos
- **Canvas API** - Sistema de partículas
- **CSS Grid & Flexbox** - Layout responsivo

## 📁 Estructura del Proyecto

```
cybersec-event/
├── index.html                 # Página principal
├── registro.html              # Página de registro
├── server.py                  # Servidor backend Python
├── css/
│   ├── cyberpunk-theme.css    # Estilos principales
│   ├── animations.css         # Animaciones y efectos
│   └── responsive.css         # Diseño responsivo
├── js/
│   ├── particle-system.js     # Sistema de partículas
│   ├── terminal-effects.js    # Efectos de terminal
│   ├── form-validation.js     # Validación gamificada
│   └── registration-handler.js # Manejo de registros
├── assets/
│   ├── audio/                 # Efectos de sonido (opcional)
│   ├── fonts/                 # Tipografías tech
│   └── icons/                 # Iconografía cybersec
├── registrations.json         # Archivo de registros (generado automáticamente)
└── README.md                  # Este archivo
```

## 🚀 Instalación y Uso

### Opción 1: Servidor Python (Recomendado)
```bash
# Ejecutar el servidor backend
python3 server.py

# El servidor se iniciará en http://localhost:8000
# Los registros se guardarán automáticamente en registrations.json
```

### Opción 2: Servidor HTTP Simple
```bash
# Solo para desarrollo frontend
python3 -m http.server 8000
```

### Requisitos del Sistema
- Python 3.6+
- Navegador web moderno (Chrome 60+, Firefox 55+, Safari 12+, Edge 79+)

## 📝 Sistema de Registro

### Características del Formulario
- **Validación en tiempo real** con mensajes estilo terminal
- **Progreso gamificado** (Novato → Hacker Ético)
- **Guardado automático** en archivo JSON
- **Easter eggs** y comandos secretos
- **Diseño responsivo** para todos los dispositivos

### Datos Recopilados
- Información personal (nombre, email, teléfono, edad)
- Información académica (universidad, carrera, nivel)
- Especializaciones de interés (múltiple selección)
- Experiencia previa y motivación
- Configuración adicional (fuente de información, términos)

### Almacenamiento
- **Archivo JSON**: `registrations.json` (formato legible)
- **Backup automático** con timestamp
- **Validación de datos** antes del guardado
- **Estadísticas en tiempo real**

## 🎮 Características Interactivas

### Comandos Secretos (Easter Eggs)
- Escribir `sudo` en cualquier campo de texto
- Escribir `hack` para efectos especiales
- Escribir `matrix` para efecto de glitch global
- **Konami Code**: ↑↑↓↓←→←→BA

### Efectos de Validación
- **Mensajes estilo terminal**: "ERROR 404: Email not found"
- **Progreso gamificado**: "Nivel de acceso: Hacker Ético (100%)"
- **Animaciones de éxito**: Efectos de pulso y glow
- **Validación en tiempo real** con feedback visual

### Sistema de Partículas
- **Partículas flotantes** con conexiones dinámicas
- **Efectos Matrix** opcionales (código cayendo)
- **Partículas de hover** en elementos interactivos
- **Optimización automática** según el dispositivo

## 🔧 API del Servidor

### Endpoints Disponibles

#### POST /api/register
Registrar nuevo usuario
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@universidad.edu",
  "universidad": "Universidad Tech",
  "carrera": "Computer Science",
  "nivel_academico": "pregrado",
  "specializations": ["ethical-hacking", "incident-response"],
  "motivacion": "Me interesa proteger sistemas..."
}
```

#### GET /api/registrations
Obtener todos los registros
```json
{
  "registrations": [...]
}
```

#### GET /api/stats
Obtener estadísticas
```json
{
  "total": 150,
  "by_specialization": {...},
  "by_university": {...},
  "by_level": {...},
  "recent": 25
}
```

## 🎨 Personalización

### Colores
Modifica las variables CSS en `cyberpunk-theme.css`:
```css
:root {
    --accent-green: #00ff41;    /* Verde matriz */
    --accent-blue: #00d4ff;     /* Azul cyber */
    --accent-purple: #b300ff;   /* Púrpura neón */
    --accent-red: #ff0040;      /* Rojo alerta */
}
```

### Animaciones
Controla las animaciones en `animations.css`:
- Desactiva animaciones para usuarios con `prefers-reduced-motion`
- Ajusta duraciones y efectos según preferencias

### Contenido
- Modifica textos en `index.html` y `registro.html`
- Actualiza especializaciones en el formulario
- Cambia fecha del countdown en `terminal-effects.js`

## 📱 Responsive Design

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: 320px, 768px, 1024px, 1400px+
- **Accesibilidad**: Navegación por teclado, alto contraste
- **Performance**: Animaciones reducidas en móviles

## 🔧 Configuración Avanzada

### Modo de Alto Contraste
```css
@media (prefers-contrast: high) {
    /* Estilos de alto contraste */
}
```

### Reducción de Movimiento
```css
@media (prefers-reduced-motion: reduce) {
    /* Desactivar animaciones */
}
```

### Modo de Impresión
```css
@media print {
    /* Estilos para impresión */
}
```

## 🎯 Características de Accesibilidad

- **Navegación por teclado** optimizada
- **Alto contraste** opcional
- **Reducción de animaciones** para usuarios sensibles
- **Semántica HTML** correcta
- **ARIA labels** donde sea necesario

## 🚀 Optimizaciones de Performance

- **Lazy loading** para animaciones pesadas
- **RequestAnimationFrame** para animaciones suaves
- **Debouncing** en eventos de input
- **Canvas optimizado** para partículas
- **CSS transforms** para mejor rendimiento

## 📊 Métricas y Analytics

El sistema incluye:
- **Contador de registros** en tiempo real
- **Tracking de progreso** del formulario
- **Métricas de interacción** con efectos
- **Estadísticas de especializaciones** seleccionadas
- **API de estadísticas** para análisis

## 🔮 Futuras Mejoras

- [ ] Dashboard de administración web
- [ ] Sistema de notificaciones push
- [ ] Integración con calendario
- [ ] Exportación de datos en múltiples formatos
- [ ] Efectos de sonido opcionales
- [ ] Modo oscuro/claro
- [ ] Internacionalización (i18n)
- [ ] Sistema de autenticación
- [ ] Base de datos SQLite
- [ ] API REST completa

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o sugerencias sobre este proyecto, contacta al equipo de desarrollo.

---

**¡Decodifica tu futuro profesional y únete a la revolución cyber!** 🚀🔐

## 🚀 Inicio Rápido

```bash
# Clonar o descargar el proyecto
cd cybersec-event

# Ejecutar servidor
python3 server.py

# Abrir navegador en http://localhost:8000
# ¡Listo para hackear el futuro! 🔐
```
