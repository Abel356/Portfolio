// Portfolio JavaScript - Modern Interactive Features
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupParticleSystem();
        this.setupTypewriter();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupProjectFiltering();
        this.setupSkillBars();
        this.setupContactForm();
        this.setupBackToTop();
        this.setupMobileMenu();
    }

    // Particle System for Hero Background
    setupParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;

        let particles = [];
        let mouse = { x: 0, y: 0 };

        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
                canvas.parent('particle-canvas');
                
                // Create particles
                for (let i = 0; i < 50; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 4)
                    });
                }
            };

            p.draw = () => {
                p.clear();
                
                // Update and draw particles
                particles.forEach((particle, i) => {
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;
                    
                    // Draw particle
                    p.fill(0, 102, 255, 100);
                    p.noStroke();
                    p.ellipse(particle.x, particle.y, particle.size);
                    
                    // Draw connections
                    particles.forEach((other, j) => {
                        if (i !== j) {
                            const distance = p.dist(particle.x, particle.y, other.x, other.y);
                            if (distance < 100) {
                                p.stroke(0, 102, 255, 50 * (1 - distance / 100));
                                p.strokeWeight(1);
                                p.line(particle.x, particle.y, other.x, other.y);
                            }
                        }
                    });
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(window.innerWidth, window.innerHeight);
            };

            p.mouseMoved = () => {
                mouse.x = p.mouseX;
                mouse.y = p.mouseY;
            };
        };

        new p5(sketch);
    }

    // Typewriter Effect for Hero Text
    setupTypewriter() {
        // Name typewriter
        if (document.getElementById('typed-name')) {
            new Typed('#typed-name', {
                strings: ['Abel Payyanickal'],
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 2000,
                loop: false,
                showCursor: false
            });
        }

        // Description typewriter
        if (document.getElementById('typed-description')) {
            setTimeout(() => {
                new Typed('#typed-description', {
                    strings: [
                        'Computer Science Student at York University',
                        'Specializing in Computer Security & AI',
                        'Passionate About Cybersecurity & Innovation',
                        'Building the Future of Technology'
                    ],
                    typeSpeed: 50,
                    backSpeed: 30,
                    backDelay: 2000,
                    loop: true,
                    showCursor: false
                });
            }, 2000);
        }
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });

        // Animate skill bars when skills section is visible
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const skillsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSkillBars();
                    }
                });
            }, { threshold: 0.3 });

            skillsObserver.observe(skillsSection);
        }
    }

    // Navigation Smooth Scrolling
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-400');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-blue-400');
            }
        });
    }

    // Project Filtering
    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active', 'bg-blue-500', 'text-white'));
                button.classList.add('active', 'bg-blue-500', 'text-white');

                const filter = button.getAttribute('data-filter');

                // Filter projects with animation
                projectCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    const shouldShow = filter === 'all' || category === filter;

                    if (shouldShow) {
                        setTimeout(() => {
                            card.style.display = 'block';
                            card.style.opacity = '0';
                            card.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                card.style.transition = 'all 0.3s ease';
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 100);
                    } else {
                        card.style.transition = 'all 0.3s ease';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Set initial active state
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) {
            allBtn.classList.add('active', 'bg-blue-500', 'text-white');
        }
    }

    // Skill Bars Animation
    setupSkillBars() {
        // This will be called when skills section is visible
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width');
            
            setTimeout(() => {
                bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
                bar.style.width = width + '%';
            }, index * 100);
        });
    }

    // Contact Form
    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            this.submitContactForm(data);
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Update field appearance
        if (isValid) {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
        } else {
            field.classList.remove('border-green-500');
            field.classList.add('border-red-500');
        }

        // Show/hide error message
        let errorDiv = field.parentNode.querySelector('.error-message');
        if (!isValid) {
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'error-message text-red-500 text-sm mt-1';
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = message;
        } else if (errorDiv) {
            errorDiv.remove();
        }

        return isValid;
    }

    async submitContactForm(data) {
        const submitBtn = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            document.getElementById('contact-form').reset();
            
            // Remove validation classes
            document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(field => {
                field.classList.remove('border-green-500', 'border-red-500');
            });
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        } else {
            notification.classList.add('bg-blue-500', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // Back to Top Button
    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.remove('opacity-0', 'invisible');
                backToTopBtn.classList.add('opacity-100', 'visible');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible');
                backToTopBtn.classList.remove('opacity-100', 'visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (!mobileMenuBtn || !mobileMenu) return;

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Initialize the portfolio app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add some additional utility functions
window.addEventListener('load', () => {
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }

    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    // Reinitialize particle system if needed
    // This is handled by p5.js windowResized function
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-dependent operations can be added here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);