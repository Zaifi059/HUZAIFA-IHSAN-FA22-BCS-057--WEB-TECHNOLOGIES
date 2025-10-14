// Admin Dashboard JavaScript

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeNavigation();
    initializeDarkMode();
    addFadeInAnimation();
    initializePageAnimations();
    addInteractiveFeatures();
});

// Chart.js Configuration and Initialization
function initializeCharts() {
    // Sales Chart (Line Chart)
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
                    borderColor: '#4e73df',
                    backgroundColor: 'rgba(78, 115, 223, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4e73df',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4e73df',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#858796'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(133, 135, 150, 0.2)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#858796',
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Revenue Chart (Doughnut Chart)
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'Social', 'Referral'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                    hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                    hoverBorderColor: "rgba(234, 236, 244, 1)",
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4e73df',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '80%'
            }
        });
    }
}

// Navigation Management
function initializeNavigation() {
    // Initialize with dashboard page active
    showPage('dashboard');
}

// Show specific page with animations
function showPage(pageId) {
    // Get all pages and nav links
    const pages = document.querySelectorAll('.page-content');
    const navLinks = document.querySelectorAll('.top-nav .nav-link');
    
    // Remove active classes from all pages and nav links
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('slide-out');
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current nav link
    const currentNavLink = document.querySelector(`[data-page="${pageId}"]`);
    if (currentNavLink) {
        currentNavLink.classList.add('active');
    }
    
    // Show the selected page with animation
    setTimeout(() => {
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('slide-out');
            targetPage.classList.add('active');
            
            // Initialize charts for analytics page
            if (pageId === 'analytics') {
                initializeAnalyticsCharts();
            }
        }
    }, 200);
    
    // Update page title
    updatePageTitle(pageId);
}

// Update page title based on current page
function updatePageTitle(pageId) {
    const titles = {
        'dashboard': 'Dashboard Overview',
        'users': 'Users Management',
        'orders': 'Orders Management',
        'products': 'Products Management',
        'analytics': 'Analytics & Reports',
        'settings': 'Settings'
    };
    
    const titleElement = document.querySelector('.h2');
    if (titleElement && titles[pageId]) {
        titleElement.textContent = titles[pageId];
    }
}

// Initialize page animations
function initializePageAnimations() {
    // Add staggered animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-in');
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize Analytics Charts
function initializeAnalyticsCharts() {
    // Traffic Chart (Bar Chart)
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'bar',
            data: {
                labels: ['Google', 'Facebook', 'Twitter', 'Direct', 'Referral'],
                datasets: [{
                    label: 'Traffic Sources',
                    data: [65, 25, 15, 45, 20],
                    backgroundColor: [
                        '#4e73df',
                        '#1cc88a',
                        '#36b9cc',
                        '#f6c23e',
                        '#e74a3b'
                    ],
                    borderColor: [
                        '#2e59d9',
                        '#17a673',
                        '#2c9faf',
                        '#dda20a',
                        '#be2617'
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#4e73df',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#858796'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(133, 135, 150, 0.2)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#858796',
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
}

// Add Interactive Features
function addInteractiveFeatures() {
    // Add click animations to table rows
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            this.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
            setTimeout(() => {
                this.style.backgroundColor = '';
            }, 500);
        });
    });
    
    // Add loading states to buttons
    const actionButtons = document.querySelectorAll('.btn:not(.dropdown-toggle)');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('btn-primary') && !this.classList.contains('btn-secondary')) {
                return; // Don't add loading to primary/secondary buttons
            }
            
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading-spinner"></span> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification('Action completed successfully!', 'success');
            }, 2000);
        });
    });
    
    // Add form submission animations
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading-spinner"></span> Saving...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    showNotification('Settings saved successfully!', 'success');
                }, 1500);
            }
        });
    });
}

// Dark Mode Toggle Functionality
function initializeDarkMode() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    setTheme(currentTheme);
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    const darkModeIcon = document.getElementById('darkModeIcon');
    
    if (darkModeIcon) {
        if (theme === 'dark') {
            darkModeIcon.className = 'bi bi-sun';
        } else {
            darkModeIcon.className = 'bi bi-moon';
        }
    }
}

// Add Fade-in Animation to Cards
function addFadeInAnimation() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Real-time Data Updates (Simulation)
function updateDashboardData() {
    // Update user count
    const userCount = document.querySelector('.border-left-primary .h5');
    if (userCount) {
        const currentCount = parseInt(userCount.textContent.replace(/,/g, ''));
        const newCount = currentCount + Math.floor(Math.random() * 5);
        userCount.textContent = newCount.toLocaleString();
    }
    
    // Update sales
    const salesAmount = document.querySelector('.border-left-success .h5');
    if (salesAmount) {
        const currentAmount = parseInt(salesAmount.textContent.replace(/[$,]/g, ''));
        const newAmount = currentAmount + Math.floor(Math.random() * 1000);
        salesAmount.textContent = '$' + newAmount.toLocaleString();
    }
    
    // Update orders
    const orderCount = document.querySelector('.border-left-info .h5');
    if (orderCount) {
        const currentCount = parseInt(orderCount.textContent.replace(/,/g, ''));
        const newCount = currentCount + Math.floor(Math.random() * 3);
        orderCount.textContent = newCount.toLocaleString();
    }
    
    // Update pending tasks
    const taskCount = document.querySelector('.border-left-warning .h5');
    if (taskCount) {
        const currentCount = parseInt(taskCount.textContent);
        const newCount = Math.max(0, currentCount + (Math.random() > 0.5 ? 1 : -1));
        taskCount.textContent = newCount;
    }
}

// Initialize real-time updates every 30 seconds
setInterval(updateDashboardData, 30000);

// Handle Window Resize
window.addEventListener('resize', function() {
    // Close offcanvas on desktop
    if (window.innerWidth >= 992) {
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('sidebar'));
        if (offcanvas) {
            offcanvas.hide();
        }
    }
});

// Add Loading States
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Handle Form Submissions (if any forms are added later)
function handleFormSubmit(form) {
    showLoading(form);
    
    // Simulate API call
    setTimeout(() => {
        hideLoading(form);
        showNotification('Form submitted successfully!', 'success');
    }, 2000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Search Functionality (for future implementation)
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', searchTerm);
        });
    }
}

// Export Functions (for future implementation)
function exportData(format) {
    showNotification(`Exporting data as ${format}...`, 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification('Data exported successfully!', 'success');
    }, 2000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Toggle dark mode with Ctrl+D
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
    }
    
    // Toggle sidebar with Ctrl+B
    if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        const sidebarToggle = document.querySelector('[data-bs-target="#sidebar"]');
        if (sidebarToggle) {
            sidebarToggle.click();
        }
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize tooltips and popovers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize Bootstrap popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Performance Monitoring
function logPerformance() {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
}

// Call performance logging after page load
window.addEventListener('load', logPerformance);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'danger');
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}
