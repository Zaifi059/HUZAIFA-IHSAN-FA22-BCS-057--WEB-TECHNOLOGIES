# 🚀 Futuristic Portfolio - Installation & Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup (Laravel)](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Configuration](#database-configuration)
5. [API Integration](#api-integration)
6. [Deployment](#deployment)

---

## 🔧 Prerequisites

### Required Software
- PHP >= 8.1
- Composer
- Node.js >= 16.x
- MySQL >= 8.0
- Git

### Development Tools
- Code Editor (VS Code recommended)
- Postman (for API testing)
- Browser with DevTools

---

## ⚙️ Backend Setup (Laravel)

### 1. Install Laravel
```bash
composer create-project laravel/laravel portfolio-backend
cd portfolio-backend
```

### 2. Install Laravel Sanctum (for API Authentication)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 3. Environment Configuration
Edit `.env` file:
```env
APP_NAME="Portfolio API"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portfolio_db
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
SESSION_DRIVER=cookie
```

### 4. Create Database
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Run Migrations
```bash
php artisan migrate
```

### 6. Create Models
```bash
php artisan make:model Skill -m
php artisan make:model Project -m
php artisan make:model Blog -m
php artisan make:model Contact -m
php artisan make:model Profile -m
```

### 7. Configure Storage for File Uploads
```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public` for file uploads.

### 8. Create Controllers
```bash
php artisan make:controller API/SkillController --api
php artisan make:controller API/ProjectController --api
php artisan make:controller API/BlogController --api
php artisan make:controller API/ContactController
php artisan make:controller API/AuthController
php artisan make:controller API/ProfileController
```

### 9. Configure CORS
Edit `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['*'], // Change in production
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

### 9. Create Admin User Seeder
```bash
php artisan make:seeder AdminUserSeeder
```

Edit `database/seeders/AdminUserSeeder.php`:
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@portfolio.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=AdminUserSeeder
```

### 10. Start Laravel Server
```bash
php artisan serve
# Server will run on http://localhost:8000
```

---

## 🎨 Frontend Setup

### 1. Project Structure
```
/frontend
├── index.html          # Home page
├── blog.html           # Blog listing
├── blog-detail.html    # Single blog post
├── contact.html        # Contact form
├── admin/
│   ├── login.html      # Admin login
│   └── dashboard.html  # Admin dashboard
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── api.js
│   │   └── animations.js
│   └── images/
└── config.js
```

### 2. Create Configuration File
Create `frontend/config.js`:
```javascript
const CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api/v1',
    ADMIN_API_URL: 'http://localhost:8000/api/admin',
    AUTH_URL: 'http://localhost:8000/api',
    
    // Animation Settings
    ANIMATIONS: {
        PARTICLE_COUNT: 100,
        TYPING_SPEED: 100,
        SCROLL_DURATION: 800,
    },
    
    // Colors
    THEME: {
        PRIMARY: '#00d4ff',
        SECONDARY: '#b000ff',
        ACCENT: '#00fff2',
        SUCCESS: '#00ff88',
        WARNING: '#ffaa00',
        DANGER: '#ff0055',
    }
};
```

### 3. Create API Handler
Create `frontend/assets/js/api.js`:
```javascript
class API {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint);
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE',
        });
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }
}

// Initialize API instances
const publicAPI = new API(CONFIG.API_BASE_URL);
const adminAPI = new API(CONFIG.ADMIN_API_URL);
const authAPI = new API(CONFIG.AUTH_URL);
```

### 4. Simple Local Server Setup

#### Option A: Using Python
```bash
cd frontend
python -m http.server 3000
# Visit http://localhost:3000
```

#### Option B: Using Node.js http-server
```bash
npm install -g http-server
cd frontend
http-server -p 3000
# Visit http://localhost:3000
```

#### Option C: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

---

## 💾 Database Configuration

### Sample Data Seeders

#### Skills Seeder
```bash
php artisan make:seeder SkillSeeder
```

```php
<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            ['name' => 'JavaScript', 'level' => 90, 'category' => 'Frontend', 'order' => 1],
            ['name' => 'React', 'level' => 85, 'category' => 'Frontend', 'order' => 2],
            ['name' => 'Laravel', 'level' => 88, 'category' => 'Backend', 'order' => 3],
            ['name' => 'UI/UX Design', 'level' => 92, 'category' => 'Design', 'order' => 4],
            ['name' => 'GSAP', 'level' => 80, 'category' => 'Animation', 'order' => 5],
            ['name' => 'MySQL', 'level' => 85, 'category' => 'Database', 'order' => 6],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
```

Run seeder:
```bash
php artisan db:seed --class=SkillSeeder
```

---

## 🔗 API Integration

### Update Frontend Files

Replace API calls in all HTML files:

```javascript
// Example: Fetch Skills
async function fetchSkills() {
    try {
        const result = await publicAPI.get('/skills');
        
        if (result.success) {
            renderSkills(result.data);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}

// Example: Login
async function login(email, password) {
    try {
        const result = await authAPI.post('/login', { email, password });
        
        if (result.success) {
            adminAPI.setToken(result.token);
            window.location.href = '/admin/dashboard.html';
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}
```

---

## 🚀 Deployment

### Laravel (Backend) - Deployment Options

#### Option 1: Shared Hosting
1. Export database
2. Upload files via FTP
3. Update `.env` with production settings
4. Run migrations on production

#### Option 2: DigitalOcean/AWS
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 755 storage bootstrap/cache
```

### Frontend - Deployment Options

#### Option 1: Netlify
1. Connect GitHub repository
2. Build command: (none needed)
3. Publish directory: `frontend`
4. Update `config.js` with production API URL

#### Option 2: Vercel
```bash
npm install -g vercel
cd frontend
vercel
```

#### Option 3: GitHub Pages
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

---

## 🧪 Testing

### Test API Endpoints

#### Using cURL
```bash
# Get all skills
curl http://localhost:8000/api/v1/skills

# Create project (authenticated)
curl -X POST http://localhost:8000/api/admin/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Project","description":"Description","tech_stack":"React, Node","status":"published"}'
```

#### Using Postman
1. Import API collection
2. Set environment variables
3. Test all endpoints

---

## 📝 Common Issues & Solutions

### CORS Issues
- Ensure `cors.php` is configured correctly
- Check `SANCTUM_STATEFUL_DOMAINS` in `.env`

### Database Connection Failed
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### 404 on API Routes
- Run `php artisan route:clear`
- Check `routes/api.php` is configured

### Animations Not Working
- Check browser console for JavaScript errors
- Ensure all CDN libraries are loaded
- Verify CSS is properly linked

---

## 🔐 Security Best Practices

1. **Never commit `.env` file**
2. **Use environment variables for sensitive data**
3. **Implement rate limiting**
4. **Sanitize user inputs**
5. **Use HTTPS in production**
6. **Keep dependencies updated**

---

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [AOS Library](https://michalsnik.github.io/aos/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🎯 Next Steps

1. ✅ Set up development environment
2. ✅ Configure database
3. ✅ Test API endpoints
4. ✅ Connect frontend to backend
5. ✅ Add sample data
6. ✅ Test all features
7. 🚀 Deploy to production

---

**Need Help?** Check the documentation or open an issue on GitHub.

**Made with ❤️ using Laravel, Vanilla JS, GSAP & AOS**