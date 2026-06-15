// ================================
// THEME MANAGEMENT
// ================================

const initTheme = () => {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', toggleTheme);
};

const toggleTheme = () => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

const updateThemeIcon = (theme) => {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'light' ? '☀️' : '🌙';
};

// ================================
// MOBILE MENU TOGGLE
// ================================

const initMobileMenu = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navMenu.contains(e.target);
        const isClickOnHamburger = hamburger.contains(e.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
};

// ================================
// CONTACT FORM HANDLING
// ================================

const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        subject: form.querySelector('#subject').value,
        message: form.querySelector('#message').value,
    };

    // Validate form data
    if (!validateFormData(formData)) {
        showNotification('Please fill in all fields correctly', 'error');
        return;
    }

    // Simulate form submission
    submitForm(formData);
};

const validateFormData = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
        data.name.trim().length > 0 &&
        emailRegex.test(data.email) &&
        data.subject.trim().length > 0 &&
        data.message.trim().length > 0
    );
};

const submitForm = (data) => {
    // Simulate API call with setTimeout
    const submitBtn = document.querySelector('.contact-form .btn-primary');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Restore button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Log the form data (in real app, send to server)
        console.log('Form submitted:', data);
    }, 1500);
};

const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles for notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    });

    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#6366f1';
        notification.style.color = 'white';
    }

    document.body.appendChild(notification);

    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
};

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(40px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(40px);
        }
    }
`;
document.head.appendChild(style);

// ================================
// SMOOTH SCROLL BEHAVIOR
// ================================

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignore if href is just '#'
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// ================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ================================

const initIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
    });

    // Observe cards and sections
    document.querySelectorAll('.skill-card, .project-card, .contact-item').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
};

// ================================
// ACTIVE NAV LINK INDICATOR
// ================================

const initActiveNavLink = () => {
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
};

// ================================
// SCROLL TO TOP BUTTON
// ================================

const initScrollToTop = () => {
    // Create scroll-to-top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');

    // Add styles
    Object.assign(scrollToTopBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--color-primary)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'none',
        zIndex: '999',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.3s ease-out',
    });

    document.body.appendChild(scrollToTopBtn);

    // Show button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
            scrollToTopBtn.style.alignItems = 'center';
            scrollToTopBtn.style.justifyContent = 'center';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Button hover effects
    scrollToTopBtn.addEventListener('mouseover', () => {
        scrollToTopBtn.style.backgroundColor = 'var(--color-secondary)';
        scrollToTopBtn.style.transform = 'scale(1.1)';
    });

    scrollToTopBtn.addEventListener('mouseout', () => {
        scrollToTopBtn.style.backgroundColor = 'var(--color-primary)';
        scrollToTopBtn.style.transform = 'scale(1)';
    });
};

// ================================
// COUNTER ANIMATION
// ================================

const initCounterAnimation = () => {
    const stats = document.querySelectorAll('.stat h3');
    let hasAnimated = false;

    const animateCounters = () => {
        if (hasAnimated) return;

        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = Math.ceil(finalValue / 50);

            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue;
                    clearInterval(counter);
                } else {
                    stat.textContent = currentValue;
                }
            }, 30);
        });

        hasAnimated = true;
    };

    // Trigger animation when stats section is in view
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(statsSection);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
};

// ================================
// KEYBOARD NAVIGATION
// ================================

const initKeyboardNavigation = () => {
    document.addEventListener('keydown', (e) => {
        // Esc key to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.getElementById('hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }

        // Ctrl/Cmd + Shift + D to toggle dark mode
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            toggleTheme();
        }
    });
};

// ================================
// PERFORMANCE: LAZY LOAD IMAGES
// ================================

const initLazyLoad = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initContactForm();
    initSmoothScroll();
    initIntersectionObserver();
    initActiveNavLink();
    initScrollToTop();
    initCounterAnimation();
    initKeyboardNavigation();
    initLazyLoad();

    console.log('✨ Portfolio initialized successfully!');
});

// ================================
// DEVELOPMENT UTILITIES
// ================================

// Log theme preference changes
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('data-theme', e.newValue);
        updateThemeIcon(e.newValue);
    }
});

// Performance monitoring
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`📊 Page load time: ${pageLoadTime}ms`);
    });
}
