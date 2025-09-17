#!/usr/bin/env python3
"""
Servidor simple para manejar registros de la aplicación Cyber Revolution
"""

import json
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import webbrowser

class RegistrationHandler(BaseHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.registrations_file = 'registrations.json'
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        """Manejar requests GET"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/':
            self.serve_file('index.html')
        elif parsed_path.path == '/registro.html':
            self.serve_file('registro.html')
        elif parsed_path.path == '/api/registrations':
            self.get_registrations()
        elif parsed_path.path == '/api/stats':
            self.get_stats()
        elif parsed_path.path.endswith('.css'):
            self.serve_file(parsed_path.path[1:], 'text/css')
        elif parsed_path.path.endswith('.js'):
            self.serve_file(parsed_path.path[1:], 'application/javascript')
        else:
            self.serve_file(parsed_path.path[1:])
    
    def do_POST(self):
        """Manejar requests POST"""
        if self.path == '/api/register':
            self.handle_registration()
        else:
            self.send_error(404, "Not Found")
    
    def serve_file(self, filename, content_type='text/html'):
        """Servir archivos estáticos"""
        try:
            if not os.path.exists(filename):
                self.send_error(404, "File not found")
                return
            
            with open(filename, 'rb') as f:
                content = f.read()
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(content)
            
        except Exception as e:
            print(f"Error serving file {filename}: {e}")
            self.send_error(500, "Internal Server Error")
    
    def handle_registration(self):
        """Manejar registro de nuevo usuario"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            # Validar datos
            if not self.validate_registration(data):
                self.send_json_response({'success': False, 'message': 'Datos inválidos'}, 400)
                return
            
            # Agregar metadatos
            data['id'] = self.generate_id()
            data['timestamp'] = datetime.now().isoformat()
            data['ip'] = self.client_address[0]
            
            # Guardar registro
            self.save_registration(data)
            
            # Respuesta exitosa
            self.send_json_response({
                'success': True, 
                'message': 'Registro exitoso',
                'id': data['id']
            })
            
        except Exception as e:
            print(f"Error handling registration: {e}")
            self.send_json_response({'success': False, 'message': 'Error interno'}, 500)
    
    def validate_registration(self, data):
        """Validar datos de registro"""
        required_fields = ['nombre', 'email', 'universidad', 'carrera', 'nivel_academico', 'motivacion']
        
        for field in required_fields:
            if field not in data or not data[field] or data[field].strip() == '':
                return False
        
        # Validar email
        import re
        email_pattern = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_pattern, data['email']):
            return False
        
        return True
    
    def save_registration(self, data):
        """Guardar registro en archivo JSON"""
        registrations = self.load_registrations()
        registrations.append(data)
        
        with open(self.registrations_file, 'w', encoding='utf-8') as f:
            json.dump(registrations, f, indent=2, ensure_ascii=False)
        
        print(f"Registro guardado: {data['nombre']} ({data['email']})")
    
    def load_registrations(self):
        """Cargar registros existentes"""
        if os.path.exists(self.registrations_file):
            try:
                with open(self.registrations_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading registrations: {e}")
                return []
        return []
    
    def get_registrations(self):
        """Obtener todos los registros"""
        registrations = self.load_registrations()
        self.send_json_response({'registrations': registrations})
    
    def get_stats(self):
        """Obtener estadísticas de registros"""
        registrations = self.load_registrations()
        
        stats = {
            'total': len(registrations),
            'by_specialization': {},
            'by_university': {},
            'by_level': {},
            'recent': len([r for r in registrations if self.is_recent(r)])
        }
        
        for reg in registrations:
            # Especializaciones
            if 'specializations' in reg:
                for spec in reg['specializations']:
                    stats['by_specialization'][spec] = stats['by_specialization'].get(spec, 0) + 1
            
            # Universidades
            uni = reg.get('universidad', 'Unknown')
            stats['by_university'][uni] = stats['by_university'].get(uni, 0) + 1
            
            # Nivel académico
            level = reg.get('nivel_academico', 'Unknown')
            stats['by_level'][level] = stats['by_level'].get(level, 0) + 1
        
        self.send_json_response(stats)
    
    def is_recent(self, registration):
        """Verificar si el registro es reciente (últimas 24 horas)"""
        try:
            reg_time = datetime.fromisoformat(registration['timestamp'])
            now = datetime.now()
            return (now - reg_time).total_seconds() < 86400  # 24 horas
        except:
            return False
    
    def generate_id(self):
        """Generar ID único para el registro"""
        import uuid
        return f"reg_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{str(uuid.uuid4())[:8]}"
    
    def send_json_response(self, data, status=200):
        """Enviar respuesta JSON"""
        response = json.dumps(data, ensure_ascii=False, indent=2)
        
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response.encode('utf-8'))))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(response.encode('utf-8'))
    
    def do_OPTIONS(self):
        """Manejar preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Personalizar mensajes de log"""
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def start_server(port=8000):
    """Iniciar el servidor"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, RegistrationHandler)
    
    print(f"🚀 Servidor Cyber Revolution iniciado en puerto {port}")
    print(f"📱 Accede a: http://localhost:{port}")
    print(f"📝 Registros se guardan en: registrations.json")
    print("🛑 Presiona Ctrl+C para detener el servidor")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido")
        httpd.shutdown()

if __name__ == '__main__':
    import sys
    
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Puerto inválido, usando puerto 8000")
    
    # Abrir navegador automáticamente
    def open_browser():
        import time
        time.sleep(1)
        webbrowser.open(f'http://localhost:{port}')
    
    browser_thread = threading.Thread(target=open_browser)
    browser_thread.daemon = True
    browser_thread.start()
    
    start_server(port)
