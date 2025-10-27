// Custom 3D Cursor Animation
const cursor3d = document.getElementById('cursor3d');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let dotX = 0;
let dotY = 0;

// Check if device is mobile
const isMobile = window.innerWidth <= 768;

if (!isMobile) {
    // Update cursor position smoothly
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with smooth following
    function animateCursor() {
        // Outer cursor - slower, smoother
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        
        // Inner dot - faster, tighter
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        
        cursor3d.style.left = cursorX + 'px';
        cursor3d.style.top = cursorY + 'px';
        
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor hover effects
    const interactiveElements = document.querySelectorAll('a, button, .btn, .portfolio-item, .service-card, .nav-menu a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor3d.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor3d.style.borderColor = 'rgba(236, 72, 153, 0.9)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(3)';
            cursorDot.style.boxShadow = '0 0 30px rgba(236, 72, 153, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor3d.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor3d.style.borderColor = 'rgba(99, 102, 241, 0.8)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.8)';
        });
    });

    // Click effect
    document.addEventListener('click', () => {
        cursor3d.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        
        setTimeout(() => {
            cursor3d.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 100);
    });
}

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Skip empty hash
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// File Upload Handler
const fileUpload = document.getElementById('file-upload');
const fileName = document.getElementById('file-name');
const fileUploadLabel = document.querySelector('.file-upload-label');

fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileName.textContent = file.name;
        fileName.style.color = '#6366f1';
        fileUploadLabel.style.borderColor = '#6366f1';
    } else {
        fileName.textContent = 'Upload Project Image/Document';
        fileName.style.color = '';
        fileUploadLabel.style.borderColor = '';
    }
});

// Form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(contactForm);
    
    // Show success message (you can replace this with actual form submission logic)
    alert('Thank you for your message and file upload! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
    fileName.textContent = 'Upload Project Image/Document';
    fileName.style.color = '';
    fileUploadLabel.style.borderColor = '';
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Portfolio hover effect enhancement
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.portfolio-image');
        if (overlay) {
            overlay.style.transform = 'scale(1.05)';
            overlay.style.transition = 'transform 0.3s ease';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.portfolio-image');
        if (overlay) {
            overlay.style.transform = 'scale(1)';
        }
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typing effect for hero title (optional enhancement)
let heroTitleElement = document.querySelector('.hero-title');
if (heroTitleElement) {
    const text = heroTitleElement.innerHTML;
    heroTitleElement.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitleElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Uncomment the line below to enable typing effect
    // setTimeout(typeWriter, 1000);
}

// Service cards animation on scroll
const serviceCards = document.querySelectorAll('.service-card');

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, observerOptions);

serviceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
});

// Portfolio items animation on scroll
const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }, index * 100);
        }
    });
}, observerOptions);

portfolioItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    portfolioObserver.observe(item);
});

// Active navigation link highlighting
const navLinksArray = Array.from(navLinks);
const sectionsArray = Array.from(sections);

window.addEventListener('scroll', () => {
    let current = '';
    
    sectionsArray.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Console welcome message
console.log('%c Portfolio of Huzaifa Ihsan 🚀', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c BS Computer Science - COMSATS University', 'color: #8b5cf6; font-size: 14px;');
console.log('%c Email: huzaifaihsan059@gmail.com', 'color: #ec4899; font-size: 12px;');
console.log('%c Phone: +92 319 1744839', 'color: #ec4899; font-size: 12px;');

