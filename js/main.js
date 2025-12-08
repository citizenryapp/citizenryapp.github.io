// ============================================
// Citizenry Website JavaScript
// Language Toggle + Mobile Menu + Interactions
// ============================================

(function() {
    'use strict';

    // ============================================
    // Language Management
    // ============================================
    const LANG_KEY = 'citizenry_language';
    let currentLang = localStorage.getItem(LANG_KEY) || getPreferredLanguage();

    function getPreferredLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('lang') === 'es') return 'es';
        
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang && browserLang.startsWith('es')) return 'es';
        
        return 'en';
    }

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem(LANG_KEY, lang);
        document.documentElement.lang = lang;
        
        // Update all translatable elements
        document.querySelectorAll('[data-en][data-es]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'IMG') {
                    // Force image reload by temporarily clearing src
                    el.src = '';
                    el.src = text;
                } else {
                    // Use innerHTML to support HTML tags like <strong> in translations
                    el.innerHTML = text;
                }
            }
        });
        
        // Update language toggle display
        updateLangToggle();
        
        // Update URL without reload
        const url = new URL(window.location);
        if (lang === 'es') {
            url.searchParams.set('lang', 'es');
        } else {
            url.searchParams.delete('lang');
        }
        window.history.replaceState({}, '', url);
    }

    function updateLangToggle() {
        // Language toggle text is handled by data-en/data-es attributes
        // No additional updates needed
    }

    function toggleLanguage() {
        const newLang = currentLang === 'en' ? 'es' : 'en';
        setLanguage(newLang);
    }

    // ============================================
    // Mobile Menu
    // ============================================
    function initMobileMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        if (!menuToggle || !mobileMenu) return;

        function openMenu() {
            mobileMenu.classList.add('active');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
            menuToggle.classList.add('active');
            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            mobileMenu.classList.remove('active');
            if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }

        menuToggle.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMenu);
        }

        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMenu);
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ============================================
    // Screenshot Carousel (Horizontal Sliding)
    // ============================================
    function initCarousel() {
        const carousel = document.getElementById('screenshotCarousel');
        const track = document.getElementById('carouselTrack');
        if (!carousel || !track) return;

        const images = track.querySelectorAll('.carousel-image');
        const dots = document.querySelectorAll('.carousel-dot');
        const totalSlides = images.length;
        let currentIndex = 0;
        let intervalId = null;

        function goToSlide(index) {
            // Handle wrapping for infinite carousel
            if (index >= totalSlides) {
                index = 0;
            } else if (index < 0) {
                index = totalSlides - 1;
            }
            
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        // Auto-rotate every 2.5 seconds
        function startAutoRotate() {
            intervalId = setInterval(nextSlide, 2500);
        }

        function stopAutoRotate() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }

        // Click handlers for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopAutoRotate();
                goToSlide(index);
                startAutoRotate();
            });
        });

        // Start auto-rotation
        startAutoRotate();
    }

    // ============================================
    // Smooth Scrolling
    // ============================================
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            item.addEventListener('toggle', function() {
                if (this.open) {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== this && otherItem.open) {
                            otherItem.open = false;
                        }
                    });
                }
            });
        });
    }

    // ============================================
    // Header Scroll Effect
    // ============================================
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        // Set initial language
        setLanguage(currentLang);
        
        // Add language toggle listeners
        document.querySelectorAll('.lang-toggle').forEach(toggle => {
            toggle.addEventListener('click', toggleLanguage);
        });
        
        // Initialize components
        initMobileMenu();
        initCarousel();
        initSmoothScrolling();
        initFAQAccordion();
        initHeaderScroll();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
