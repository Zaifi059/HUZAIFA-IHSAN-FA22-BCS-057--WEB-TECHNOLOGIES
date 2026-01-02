# 🚀 Futuristic Portfolio – Full Stack Headless CMS

## 🎓 Student Information

- **Name:** Huzaifa Ihsan  
- **Registration No:** FA22-BCS-057  
- **Institute:** COMSATS University Islamabad, Vehari Campus  
- **Submitted To:** **Mam Ayesha**  
- **Course Name:** Web Technologies  

---

## 📘 Project Overview

The **Futuristic Portfolio** is a modern, dynamic full-stack web application designed to showcase professional achievements, technical skills, and industry insights.

Unlike traditional static portfolios, this project uses a **Headless CMS (Decoupled Architecture)**, where:

- **Frontend** handles UI, animations, and user experience  
- **Backend** provides a secure RESTful API for data and authentication  

The frontend is built with **HTML5, CSS3, JavaScript**, enhanced by **GSAP animations** for a futuristic and immersive experience.  
The backend is powered by **Laravel 10**, serving as a secure and scalable API.

---
🎯 Project Scope

The application serves two user roles:

Visitors (Public Users)

Administrator (Private Access)

✅ In-Scope Features

Responsive public portfolio website

Secure admin dashboard for content management

RESTful API for frontend communication

Structured database for dynamic content

Token-based authentication using Laravel Sanctum

❌ Out-of-Scope Features

User registration (single admin system)

E-commerce functionality

Third-party social media API integrations (links only)

⚙️ Functional Requirements
🌐 Public Module (Visitor Features)

FR-01: Landing Page

Hero section with animated introduction

FR-02: Skills Section

Categorized skills

Proficiency levels displayed via progress bars or percentages

FR-03: Projects (Portfolio)

Project gallery

Project title, description, and tech stack

FR-04: Blog

Blog listing

Detailed blog post view

FR-05: Contact Form

Input validation (email & message)

Stores messages in database

🔐 Admin Module (Management Features)

FR-06: Admin Authentication

Email & password login

Token-based authentication via Laravel Sanctum

FR-07: Dashboard Overview

Optional analytics (project/blog counts)

FR-08: Project Management

Create, update, delete projects

FR-09: Skill Management

Add skills

Set proficiency (0–100%)

FR-10: Blog Management

Write, publish, delete blog posts

🏗️ System Architecture
Architecture Pattern

Decoupled (Headless) Architecture

Frontend

SPA-like behavior using Vanilla JavaScript

Fetch API for data consumption

Backend

Laravel REST API

JSON-based responses

🧰 Technology Stack
🎨 Frontend (Client-Side)

Core: HTML5, CSS3, JavaScript (ES6+)

Styling: Custom CSS, Tailwind CSS

Animations:

GSAP (GreenSock Animation Platform)

AOS (Animate On Scroll)

Data Fetching: Fetch API

🖥️ Backend (Server-Side)

Language: PHP ≥ 8.1

Framework: Laravel 10.x

Authentication: Laravel Sanctum

Database: MySQL 8.0

Dependency Manager: Composer

Version Control: Git

API Testing: Postman

Local Server: Apache / Nginx / php artisan serve

🗄️ Database Schema
Table	Description
Users	Admin credentials (name, email, password_hash)
Projects	Portfolio items (title, description, tech_stack, image_url, status)
Skills	Technical skills (name, proficiency_level, category)
Blogs	Blog posts (title, slug, content, published_at)
Contacts	Contact messages (name, email, subject, message)
⚡ Installation & Setup Guide
📋 Prerequisites

Ensure the following are installed:

PHP ≥ 8.1

Composer

Node.js ≥ 16.x

MySQL ≥ 8.0

Git

🔧 Backend Setup (Laravel API)
1️⃣ Create Project
composer create-project laravel/laravel portfolio-backend
cd portfolio-backend

2️⃣ Install Sanctum
composer require laravel/sanctum

3️⃣ Environment Configuration (.env)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_db
DB_USERNAME=root
DB_PASSWORD=

4️⃣ Database Setup
CREATE DATABASE portfolio_db;

5️⃣ Migrations & Seeding
php artisan migrate
php artisan db:seed --class=AdminUserSeeder


Default Admin Credentials

Email: admin@portfolio.com
Password: password123

6️⃣ Start Backend Server
php artisan serve


📍 API Base URL:

http://localhost:8000/api

🌐 Frontend Setup
Configuration (frontend/config.js)
const CONFIG = {
  API_BASE_URL: 'http://localhost:8000/api/v1',
  ADMIN_API_URL: 'http://localhost:8000/api/admin',
  AUTH_URL: 'http://localhost:8000/api',
};

Running Frontend (Local Server Required)
cd frontend

# Python
python -m http.server 3000

# OR Node.js
npx http-server -p 3000


🌍 Access Application:

http://localhost:3000

🔌 API Documentation Overview
🌍 Public Endpoints (No Authentication)
Method	Endpoint	Description
GET	/v1/skills	Retrieve all skills
GET	/v1/projects	Retrieve published projects
GET	/v1/blogs	Retrieve blog posts
POST	/v1/contact	Submit contact message
🔐 Admin Endpoints (Bearer Token Required)
Method	Endpoint	Description
POST	/login	Authenticate admin
POST	/logout	Logout admin
POST	/admin/projects	Create project
PUT	/admin/projects/{id}	Update project
DELETE	/admin/projects/{id}	Delete project

📌 Similar CRUD endpoints exist for Skills and Blogs.

✅ Conclusion

The Futuristic Portfolio project demonstrates strong expertise in:

Modern full-stack development

Headless CMS architecture

Secure API design

High-performance frontend animations

By separating frontend and backend responsibilities, the application achieves scalability, maintainability, and flexibility, making it production-ready and future-proof.
