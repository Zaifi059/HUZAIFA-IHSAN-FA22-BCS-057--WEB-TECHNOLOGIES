#!/usr/bin/env python3
"""
Simple HTTP Server for Mobile Testing
Run this script to view your website on mobile devices
"""

import http.server
import socketserver
import os
import socket

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def get_local_ip():
    """Get the local IP address"""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def main():
    handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        local_ip = get_local_ip()
        
        print("=" * 60)
        print("🚀 Local Development Server Started!")
        print("=" * 60)
        print(f"\n📱 To view on your mobile device:")
        print(f"   1. Make sure your phone is on the same WiFi network")
        print(f"   2. Open this URL on your mobile browser:")
        print(f"      http://{local_ip}:{PORT}/")
        print(f"\n💻 To view on your computer:")
        print(f"      http://localhost:{PORT}/")
        print(f"\n⏹️  Press Ctrl+C to stop the server")
        print("=" * 60)
        print()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped!")
            httpd.shutdown()

if __name__ == "__main__":
    main()

