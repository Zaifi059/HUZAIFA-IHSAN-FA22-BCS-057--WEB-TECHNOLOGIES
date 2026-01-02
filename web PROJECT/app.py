#!/usr/bin/env python3
"""
Futuristic Portfolio - Flask Backend Server
Handles API endpoints for the portfolio and admin dashboard
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
from werkzeug.utils import secure_filename
import json
import os
import base64

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# In-memory database (will reset on server restart)
db = {
    'profile': {
        'name': 'John Doe',
        'job_title': 'Full-Stack Developer',
        'bio': 'Passionate developer creating amazing digital experiences.',
        'profile_image': None,
        'email': 'john@example.com',
        'phone': '+1 (555) 123-4567',
        'location': 'San Francisco, CA'
    },
    'skills': [
        {'id': 1, 'name': 'JavaScript', 'level': 95, 'category': 'Frontend'},
        {'id': 2, 'name': 'Python', 'level': 90, 'category': 'Backend'},
        {'id': 3, 'name': 'React', 'level': 92, 'category': 'Frontend'},
        {'id': 4, 'name': 'Laravel', 'level': 88, 'category': 'Backend'},
        {'id': 5, 'name': 'Web Design', 'level': 85, 'category': 'Design'},
        {'id': 6, 'name': 'Database Design', 'level': 87, 'category': 'Backend'}
    ],
    'projects': [
        {
            'id': 1,
            'title': 'E-Commerce Platform',
            'description': 'A full-stack e-commerce platform with payment integration',
            'technology': ['React', 'Node.js', 'MongoDB'],
            'link': 'https://github.com',
            'image': 'project1.jpg',
            'status': 'completed'
        },
        {
            'id': 2,
            'title': 'AI Chat Application',
            'description': 'Real-time chat application with AI-powered suggestions',
            'technology': ['Vue.js', 'Python', 'WebSocket'],
            'link': 'https://github.com',
            'image': 'project2.jpg',
            'status': 'completed'
        },
        {
            'id': 3,
            'title': 'Mobile App Backend',
            'description': 'RESTful API for a popular mobile application',
            'technology': ['Laravel', 'MySQL', 'Docker'],
            'link': 'https://github.com',
            'image': 'project3.jpg',
            'status': 'in-progress'
        }
    ],
    'blog': [
        {
            'id': 1,
            'title': 'Getting Started with Web Development',
            'excerpt': 'A comprehensive guide for beginners',
            'content': 'Full blog content here...',
            'date': '2025-12-15',
            'author': 'John Doe',
            'category': 'Tutorial'
        },
        {
            'id': 2,
            'title': 'Best Practices in Full-Stack Development',
            'excerpt': 'Tips and tricks from industry experts',
            'content': 'Full blog content here...',
            'date': '2025-12-10',
            'author': 'John Doe',
            'category': 'Best Practices'
        }
    ],
    'contacts': []
}

# Routes

@app.route('/')
def index():
    """Serve the main portfolio page"""
    return send_from_directory('.', 'futuristic_portfolio.html')

@app.route('/admin')
def admin():
    """Serve the admin dashboard"""
    return send_from_directory('.', 'admin_dashboard(1).html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(UPLOAD_FOLDER, filename)

# Profile API Endpoints
@app.route('/api/v1/profile', methods=['GET'])
def get_profile():
    """Get profile information"""
    return jsonify({
        'success': True,
        'data': db['profile']
    })

@app.route('/api/admin/profile', methods=['POST', 'PUT'])
def update_profile():
    """Update profile information with file upload support"""
    # Handle file upload
    profile_image_path = None
    if 'profile_image' in request.files:
        file = request.files['profile_image']
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(f"profile_{datetime.now().timestamp()}.{file.filename.rsplit('.', 1)[1].lower()}")
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            profile_image_path = f"/uploads/{filename}"
    
    # Handle form data
    name = request.form.get('name')
    job_title = request.form.get('job_title')
    bio = request.form.get('bio')
    email = request.form.get('email')
    phone = request.form.get('phone')
    location = request.form.get('location')
    
    # Update profile
    if name:
        db['profile']['name'] = name
    if job_title:
        db['profile']['job_title'] = job_title
    if bio:
        db['profile']['bio'] = bio
    if email:
        db['profile']['email'] = email
    if phone:
        db['profile']['phone'] = phone
    if location:
        db['profile']['location'] = location
    if profile_image_path:
        db['profile']['profile_image'] = profile_image_path
    
    return jsonify({
        'success': True,
        'message': 'Profile updated successfully',
        'data': db['profile']
    })

# Skills API Endpoints
@app.route('/api/v1/skills', methods=['GET'])
def get_skills():
    """Get all skills"""
    return jsonify({
        'success': True,
        'data': db['skills']
    })

@app.route('/api/admin/skills', methods=['POST'])
def create_skill():
    """Create a new skill"""
    data = request.json
    if not data or 'name' not in data:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    skill = {
        'id': max([s['id'] for s in db['skills']], default=0) + 1,
        'name': data['name'],
        'level': data.get('level', 50),
        'category': data.get('category', 'Other')
    }
    db['skills'].append(skill)
    
    return jsonify({
        'success': True,
        'message': 'Skill created successfully',
        'data': skill
    }), 201

@app.route('/api/admin/skills/<int:skill_id>', methods=['PUT', 'DELETE'])
def manage_skill(skill_id):
    """Update or delete a skill"""
    skill = next((s for s in db['skills'] if s['id'] == skill_id), None)
    
    if not skill:
        return jsonify({'success': False, 'message': 'Skill not found'}), 404
    
    if request.method == 'DELETE':
        db['skills'].remove(skill)
        return jsonify({'success': True, 'message': 'Skill deleted successfully'})
    
    # PUT - Update
    data = request.json
    skill.update({k: v for k, v in data.items() if k in ['name', 'level', 'category']})
    
    return jsonify({
        'success': True,
        'message': 'Skill updated successfully',
        'data': skill
    })

# Projects API Endpoints
@app.route('/api/v1/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    return jsonify({
        'success': True,
        'data': db['projects']
    })

@app.route('/api/admin/projects', methods=['POST'])
def create_project():
    """Create a new project"""
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    project = {
        'id': max([p['id'] for p in db['projects']], default=0) + 1,
        'title': data['title'],
        'description': data.get('description', ''),
        'technology': data.get('technology', []),
        'link': data.get('link', ''),
        'image': data.get('image', ''),
        'status': data.get('status', 'planning')
    }
    db['projects'].append(project)
    
    return jsonify({
        'success': True,
        'message': 'Project created successfully',
        'data': project
    }), 201

@app.route('/api/admin/projects/<int:project_id>', methods=['PUT', 'DELETE'])
def manage_project(project_id):
    """Update or delete a project"""
    project = next((p for p in db['projects'] if p['id'] == project_id), None)
    
    if not project:
        return jsonify({'success': False, 'message': 'Project not found'}), 404
    
    if request.method == 'DELETE':
        db['projects'].remove(project)
        return jsonify({'success': True, 'message': 'Project deleted successfully'})
    
    # PUT - Update
    data = request.json
    project.update({k: v for k, v in data.items() if k in ['title', 'description', 'technology', 'link', 'image', 'status']})
    
    return jsonify({
        'success': True,
        'message': 'Project updated successfully',
        'data': project
    })

# Blog API Endpoints
@app.route('/api/v1/blog', methods=['GET'])
def get_blog():
    """Get all blog posts"""
    return jsonify({
        'success': True,
        'data': db['blog']
    })

@app.route('/api/admin/blog', methods=['POST'])
def create_blog():
    """Create a new blog post"""
    data = request.json
    if not data or 'title' not in data:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    blog = {
        'id': max([b['id'] for b in db['blog']], default=0) + 1,
        'title': data['title'],
        'excerpt': data.get('excerpt', ''),
        'content': data.get('content', ''),
        'date': datetime.now().isoformat()[:10],
        'author': data.get('author', 'John Doe'),
        'category': data.get('category', 'General')
    }
    db['blog'].append(blog)
    
    return jsonify({
        'success': True,
        'message': 'Blog post created successfully',
        'data': blog
    }), 201

@app.route('/api/admin/blog/<int:blog_id>', methods=['PUT', 'DELETE'])
def manage_blog(blog_id):
    """Update or delete a blog post"""
    blog = next((b for b in db['blog'] if b['id'] == blog_id), None)
    
    if not blog:
        return jsonify({'success': False, 'message': 'Blog post not found'}), 404
    
    if request.method == 'DELETE':
        db['blog'].remove(blog)
        return jsonify({'success': True, 'message': 'Blog post deleted successfully'})
    
    # PUT - Update
    data = request.json
    blog.update({k: v for k, v in data.items() if k in ['title', 'excerpt', 'content', 'category']})
    
    return jsonify({
        'success': True,
        'message': 'Blog post updated successfully',
        'data': blog
    })

# Contact API Endpoints
@app.route('/api/v1/contact', methods=['POST'])
def send_contact():
    """Handle contact form submission"""
    data = request.json
    if not data or 'name' not in data or 'email' not in data or 'message' not in data:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    contact = {
        'id': len(db['contacts']) + 1,
        'name': data['name'],
        'email': data['email'],
        'subject': data.get('subject', ''),
        'message': data['message'],
        'date': datetime.now().isoformat(),
        'status': 'new'
    }
    db['contacts'].append(contact)
    
    return jsonify({
        'success': True,
        'message': 'Contact message received successfully',
        'data': contact
    }), 201

@app.route('/api/admin/contacts', methods=['GET'])
def get_contacts():
    """Get all contact messages"""
    return jsonify({
        'success': True,
        'data': db['contacts']
    })

# Admin Stats
@app.route('/api/admin/stats', methods=['GET'])
def get_stats():
    """Get admin statistics"""
    return jsonify({
        'success': True,
        'data': {
            'total_projects': len(db['projects']),
            'total_skills': len(db['skills']),
            'total_blog_posts': len(db['blog']),
            'total_contacts': len(db['contacts']),
            'completed_projects': len([p for p in db['projects'] if p['status'] == 'completed']),
            'in_progress_projects': len([p for p in db['projects'] if p['status'] == 'in-progress'])
        }
    })

# Health check
@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Server is running'}), 200

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting Futuristic Portfolio Backend Server...")
    print("📍 Server running at http://localhost:5000")
    print("📱 Portfolio: http://localhost:5000")
    print("⚙️  Admin Dashboard: http://localhost:5000/admin")
    print("🔧 API Documentation: All endpoints support CORS")
    print("\nAPI Base URL: http://localhost:5000/api/")
    print("\nPress Ctrl+C to stop the server\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
