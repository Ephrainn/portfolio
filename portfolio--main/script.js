// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 80);
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorFollower.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hover'));
    });
}

// Page load reveal
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// Scroll progress bar
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
}, { passive: true });

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
}, { passive: true });

// Mobile menu toggle
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for anchor links
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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.sk-bar-fill');
                if (progressBar) {
                    const progress = progressBar.dataset.progress;
                    setTimeout(() => {
                        progressBar.style.width = progress + '%';
                    }, 300);
                }
            }
        }
    });
}, observerOptions);

// Observe skill cards
document.querySelectorAll('.skill-card').forEach(card => {
    observer.observe(card);
});

// Animate stats counter
const animateCounter = (element, target, suffix = '') => {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.count);
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// Form handling - submits silently to Google Forms
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        const originalBg = btn.style.background;

        const name = contactForm.querySelector('#name').value.trim();
        const email = contactForm.querySelector('#email').value.trim();
        const message = contactForm.querySelector('#message').value.trim();

        btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const FORM_ID = '1FAIpQLSc8BTTQtSye2VHhshLqtX7ApY_hNZ5Xi6XiydQhaGxYM0o7lQ';
        const url = `https://docs.google.com/forms/d/e/${FORM_ID}/formResponse`;

        const body = new URLSearchParams({
            'entry.1180442235': name,
            'entry.1680986548': email,
            'entry.753881289': message
        });

        try {
            // Google Forms doesn't support CORS, so we use no-cors mode
            // The request goes through but we can't read the response — that's expected
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString()
            });

            // no-cors always resolves (opaque response), so we treat it as success
            btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            contactForm.reset();

        } catch (error) {
            btn.innerHTML = '<span>Error</span><i class="fas fa-exclamation-triangle"></i>';
            btn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            alert('Something went wrong. Please contact me directly at asedaquarshie@gmail.com');
        }

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = originalBg;
            btn.disabled = false;
        }, 3000);
    });
}

// Parallax effect for hero spheres
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const spheres = document.querySelectorAll('.gradient-sphere');

    spheres.forEach((sphere, index) => {
        const speed = (index + 1) * 0.1;
        sphere.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add stagger animation delay to skill cards
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Project cards hover tilt effect (desktop only)
// Only apply tilt effect on devices that support hover
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Ensure mobile tap opens project links
// Handle touch events to distinguish taps from scrolls
// Run when DOM is ready
(function () {
    const initProjectCards = () => {
        document.querySelectorAll('a.project-card').forEach(card => {
            const href = card.getAttribute('href');

            // Only process if it's an external link
            if (href && !href.startsWith('#')) {
                let touchStartX = 0;
                let touchStartY = 0;
                let touchStartTime = 0;
                let isScrolling = false;
                let touchTarget = null;

                // Track touch start
                card.addEventListener('touchstart', (e) => {
                    // Don't handle if clicking on case-study-link
                    if (e.target.closest('.case-study-link')) {
                        return;
                    }

                    touchTarget = e.target;
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    touchStartTime = Date.now();
                    isScrolling = false;
                }, { passive: true });

                // Track touch move to detect scrolling
                card.addEventListener('touchmove', (e) => {
                    if (!touchStartX || !touchStartY) return;

                    const touchCurrentX = e.touches[0].clientX;
                    const touchCurrentY = e.touches[0].clientY;
                    const deltaX = Math.abs(touchCurrentX - touchStartX);
                    const deltaY = Math.abs(touchCurrentY - touchStartY);

                    // If movement is significant, it's a scroll
                    if (deltaX > 10 || deltaY > 10) {
                        isScrolling = true;
                    }
                }, { passive: true });

                // Handle touch end - open link if it was a tap, not a scroll
                card.addEventListener('touchend', (e) => {
                    // Don't handle if clicking on case-study-link
                    if (e.target.closest('.case-study-link') || touchTarget?.closest('.case-study-link')) {
                        touchStartX = 0;
                        touchStartY = 0;
                        touchTarget = null;
                        return;
                    }

                    // If it was a scroll, don't open the link
                    if (isScrolling) {
                        touchStartX = 0;
                        touchStartY = 0;
                        touchTarget = null;
                        return;
                    }

                    // Check if it was a quick tap (less than 500ms)
                    const touchDuration = Date.now() - touchStartTime;
                    if (touchDuration < 500 && touchStartX && touchStartY) {
                        // It's a tap, open the link
                        e.preventDefault();
                        e.stopPropagation();
                        // Try to open in new tab, fallback to same window if blocked
                        const newWindow = window.open(href, '_blank');
                        // If popup blocked, fallback to same window navigation
                        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                            window.location.href = href;
                        }
                    }

                    touchStartX = 0;
                    touchStartY = 0;
                    touchTarget = null;
                }, { passive: false });

                // Also handle regular click for desktop and as fallback
                // This ensures clicks work even if touch events don't fire
                card.addEventListener('click', (e) => {
                    // Don't handle if clicking on case-study-link
                    if (e.target.closest('.case-study-link')) {
                        return;
                    }
                    // On mobile, if touch events didn't fire, ensure the link works
                    // The default <a> behavior should work, but we ensure it
                    const href = card.getAttribute('href');
                    if (href && !href.startsWith('#')) {
                        // Allow default behavior - it will open in new tab (target="_blank")
                        // This is a backup in case touch events don't work
                    }
                });
            }
        });
    };

    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProjectCards);
    } else {
        initProjectCards();
    }
})();

// Case study link inside project card: stop bubbling and scroll
document.querySelectorAll('.case-study-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const targetSel = link.getAttribute('data-target') || '#case-study';
        const target = document.querySelector(targetSel);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Typing effect for hero (optional enhancement)
const createTypingEffect = (element, texts, speed = 100) => {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => isDeleting = true, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }

        const typeSpeed = isDeleting ? speed / 2 : speed;
        setTimeout(type, typeSpeed);
    };

    type();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Hide scroll indicator after scrolling
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }
});
