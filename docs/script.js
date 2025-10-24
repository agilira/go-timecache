// Chiron Documentation Template JavaScript
// Features: mobile sidebar, search, navigation, accessibility

class DocumentationApp {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.mobileOverlay = document.getElementById('mobileOverlay');
        this.searchInput = document.getElementById('searchInput');
        this.editPageBtn = document.getElementById('editPageBtn');
        
        this.init();
    }

    init() {
        this.setupMobileSidebar();
        this.setupSearch();
        this.setupNavigation();
        this.setupAccessibility();
        this.setupCodeBlocks();
        this.setupTableOfContents();
        this.setupKeyboardNavigation();
        this.setupThemeToggle();
        this.setupCookieConsent();
        this.setupSitemapGeneration();
        this.setupRobotsGeneration();
        this.setupDeveloperTools();
        this.setupScrollToTop();
    }

    // Sidebar mobile
    setupMobileSidebar() {
        if (!this.sidebarToggle || !this.mobileOverlay) return;

        // Focus management helpers
        let lastFocusedElement = null;

        const getFocusableElements = (container) => {
            return container.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        };

        const openSidebar = () => {
            lastFocusedElement = document.activeElement;
            this.sidebar.classList.add('open');
            this.mobileOverlay.classList.add('open');

            // ARIA
            this.sidebar.setAttribute('aria-hidden', 'false');
            this.sidebarToggle.setAttribute('aria-expanded', 'true');

            // Block body scroll when sidebar is open
            document.body.style.overflow = 'hidden';

            // Focus first focusable element inside sidebar
            const focusables = getFocusableElements(this.sidebar);
            if (focusables.length) focusables[0].focus();
        };

        const closeSidebar = () => {
            this.sidebar.classList.remove('open');
            this.mobileOverlay.classList.remove('open');

            // ARIA
            this.sidebar.setAttribute('aria-hidden', 'true');
            this.sidebarToggle.setAttribute('aria-expanded', 'false');

            // Restore body scroll
            document.body.style.overflow = '';

            // Restore focus
            if (lastFocusedElement) lastFocusedElement.focus();
        };

        const toggleSidebar = () => {
            if (this.sidebar.classList.contains('open')) closeSidebar();
            else openSidebar();
        };

        this.sidebarToggle.addEventListener('click', toggleSidebar);
        this.mobileOverlay.addEventListener('click', closeSidebar);

        // Basic focus trap
        document.addEventListener('keydown', (e) => {
            if (!this.sidebar.classList.contains('open')) return;
            if (e.key === 'Escape') {
                closeSidebar();
                return;
            }

            if (e.key === 'Tab') {
                const focusables = Array.from(getFocusableElements(this.sidebar));
                if (!focusables.length) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        // Auto-close on resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.sidebar.classList.remove('open');
                this.mobileOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // Search system
    setupSearch() {
        // Search removed for GitHub Pages - replaced with version link
        return;
    }

    createSearchResults() {
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'search-results';
        resultsContainer.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid var(--gray-200);
            border-top: none;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
            box-shadow: var(--shadow-lg);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;
        
        this.searchInput.parentNode.appendChild(resultsContainer);
        return resultsContainer;
    }

    performSearch(query, resultsContainer) {
        // Search simulation - in a real implementation, this would be an API call
        const mockResults = [
            { title: 'Installation', url: '#installation', excerpt: 'Complete guide to install the libraries...' },
            { title: 'Configuration', url: '#configuration', excerpt: 'How to configure the application settings...' },
            { title: 'API Reference', url: '#api-reference', excerpt: 'Complete documentation of available APIs...' },
            { title: 'Examples', url: '#examples', excerpt: 'Code examples to get started quickly...' }
        ].filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.excerpt.toLowerCase().includes(query.toLowerCase())
        );

        this.displaySearchResults(mockResults, resultsContainer);
        this.showSearchResults();
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = '<div class="search-no-results">Nessun risultato trovato</div>';
            return;
        }

        container.innerHTML = results.map(result => `
            <div class="search-result-item">
                <div class="search-result-title">${this.highlightQuery(result.title, this.searchInput.value)}</div>
                <div class="search-result-excerpt">${result.excerpt}</div>
            </div>
        `).join('');

        // Add event listeners to results
        container.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                // In a real implementation, it would navigate to the page
                console.log('Navigate to:', results[index].url);
                this.hideSearchResults();
                this.searchInput.value = '';
            });
        });
    }

    highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    showSearchResults() {
        const results = document.querySelector('.search-results');
        if (results) results.style.display = 'block';
    }

    hideSearchResults() {
        const results = document.querySelector('.search-results');
        if (results) results.style.display = 'none';
    }

    // Navigation
    setupNavigation() {
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Aggiorna URL senza ricaricare la pagina
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });

        // Handle active state for navigation
        this.updateActiveNavigation();
        window.addEventListener('scroll', this.throttle(() => {
            this.updateActiveNavigation();
        }, 100));
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-item[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (rect.top <= headerHeight + 50 && rect.bottom > headerHeight + 50) {
                currentSection = section.id;
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    // Accessibility
    setupAccessibility() {
        // Skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Salta al contenuto principale';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-600);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);

        // ARIA labels
        if (this.sidebarToggle) {
            this.sidebarToggle.setAttribute('aria-label', 'Toggle sidebar navigation');
            this.sidebarToggle.setAttribute('aria-expanded', 'false');
        }

        if (this.searchInput) {
            this.searchInput.setAttribute('aria-label', 'Search documentation');
        }

        // Focus management
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    closeModals() {
        // Chiudi sidebar se aperta
        if (this.sidebar && this.sidebar.classList.contains('open')) {
            this.sidebar.classList.remove('open');
            this.mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }
        
        // Nascondi risultati ricerca
        this.hideSearchResults();
        if (this.searchInput) {
            this.searchInput.blur();
        }
    }

    // Code blocks
    setupCodeBlocks() {
        // Lazy load Prism.js only when code blocks are present
        this.lazyLoadPrism();
        
        document.querySelectorAll('.code-copy').forEach(button => {
            button.addEventListener('click', async () => {
                const codeBlock = button.closest('.code-block');
                const code = codeBlock.querySelector('code');
                const text = code.textContent;

                try {
                    await navigator.clipboard.writeText(text);
                    this.showToast('Code copied to clipboard!', 'success');
                    
                    // Feedback visivo
                    const originalText = button.textContent;
                    button.textContent = 'Copied!';
                    setTimeout(() => {
                        button.textContent = originalText;
                    }, 2000);
                } catch (err) {
                    this.showToast('Errore nella copia del codice', 'error');
                }
            });
        });
    }

    // Lazy load Prism.js for syntax highlighting
    lazyLoadPrism() {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"], code[class*="language-"]');
        if (codeBlocks.length === 0) return;

        // Check if Prism is already loaded
        if (window.Prism) {
            this.initializePrism();
            return;
        }

        // Load Prism.js dynamically
        const loadPrism = () => {
            const scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/toolbar/prism-toolbar.min.js'
            ];

            let loadedCount = 0;
            scripts.forEach((src, index) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loadedCount++;
                    if (loadedCount === scripts.length) {
                        this.initializePrism();
                    }
                };
                document.head.appendChild(script);
            });
        };

        // Load Prism when code blocks come into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadPrism();
                    observer.disconnect();
                }
            });
        });

        codeBlocks.forEach(block => observer.observe(block));
    }

    initializePrism() {
        if (window.Prism) {
            Prism.highlightAll();
            console.log('Prism.js initialized with lazy loading');
        }
    }

    // Table of contents
    setupTableOfContents() {
        const toc = document.querySelector('.table-of-contents');
        if (!toc) return;

        // Genera automaticamente il TOC se non esiste
        const headings = document.querySelectorAll('h2, h3');
        if (headings.length > 0 && !toc.querySelector('.toc-list').children.length) {
            const tocList = toc.querySelector('.toc-list');
            tocList.innerHTML = '';

            headings.forEach(heading => {
                if (!heading.id) {
                    heading.id = heading.textContent.toLowerCase()
                        .replace(/[^a-z0-9\s]/g, '')
                        .replace(/\s+/g, '-');
                }

                const level = heading.tagName === 'H2' ? '' : '  ';
                const link = document.createElement('a');
                link.href = `#${heading.id}`;
                link.textContent = level + heading.textContent;
                
                const li = document.createElement('li');
                li.appendChild(link);
                tocList.appendChild(li);
            });
        }

        // Highlight current section in TOC
        window.addEventListener('scroll', this.throttle(() => {
            this.updateTOCHighlight();
        }, 100));
    }

    updateTOCHighlight() {
        const tocLinks = document.querySelectorAll('.toc-list a');
        const sections = document.querySelectorAll('h2[id], h3[id]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (rect.top <= headerHeight + 100) {
                currentSection = section.id;
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Keyboard navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + / to toggle sidebar
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                if (this.sidebarToggle) {
                    this.sidebarToggle.click();
                }
            }
        });
    }

    // Utility functions
    throttle(func, wait) {
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

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-500)' : 'var(--error-500)'};
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    // Theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;
        
        this.setTheme(currentTheme);

        // Toggle theme on button click
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Show feedback
            this.showToast(`Switched to ${newTheme} mode`, 'success');
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Set theme helper function
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.setAttribute('data-theme', theme);
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            );
        }
        
        // Update logos based on theme
        this.updateLogosForTheme(theme);
    }

    // Update logos based on current theme
    updateLogosForTheme(theme) {
        const logos = document.querySelectorAll('.logo-img, .footer-logo');
        
        logos.forEach(logo => {
            const lightSrc = logo.getAttribute('data-logo-light');
            const darkSrc = logo.getAttribute('data-logo-dark');
            
            if (theme === 'dark' && darkSrc) {
                logo.src = darkSrc;
            } else if (lightSrc) {
                logo.src = lightSrc;
            }
        });
    }

    // Cookie consent
    setupCookieConsent() {
        const cookieBanner = document.getElementById('cookieBanner');
        const cookieAcceptBtn = document.getElementById('cookieAcceptBtn');
        const cookieDeclineBtn = document.getElementById('cookieDeclineBtn');
        const cookieConsentBtn = document.getElementById('cookieConsentBtn');

        if (!cookieBanner) return;

        // Check if user has already given consent
        const hasConsented = localStorage.getItem('cookieConsent');
        
        if (!hasConsented) {
            // Show banner after a brief delay
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }

        // Handle acceptance
        if (cookieAcceptBtn) {
            cookieAcceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieBanner.classList.remove('show');
                this.showToast('Cookie preferences saved', 'success');
            });
        }

        // Handle decline
        if (cookieDeclineBtn) {
            cookieDeclineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'declined');
                cookieBanner.classList.remove('show');
                this.showToast('Non-essential cookies disabled', 'success');
            });
        }

        // Handle manage cookies button
        if (cookieConsentBtn) {
            cookieConsentBtn.addEventListener('click', () => {
                // Show banner again to allow changing preferences
                cookieBanner.classList.add('show');
            });
        }
    }

    // Sitemap generation
    setupSitemapGeneration() {
        const sitemapBtn = document.getElementById('sitemapGenerateBtn');
        if (!sitemapBtn) return;

        sitemapBtn.addEventListener('click', () => {
            if (window.chironConfig && window.chironConfig.generateSitemap) {
                window.chironConfig.generateSitemap();
            } else {
                console.warn('ChironConfig not available for sitemap generation');
            }
        });
    }

    // Robots.txt generation
    setupRobotsGeneration() {
        const robotsBtn = document.getElementById('robotsGenerateBtn');
        if (!robotsBtn) return;

        robotsBtn.addEventListener('click', () => {
            if (window.chironConfig && window.chironConfig.generateRobotsTxt) {
                window.chironConfig.generateRobotsTxt();
            } else {
                console.warn('ChironConfig not available for robots.txt generation');
            }
        });
    }

    // Developer tools
    setupDeveloperTools() {
        const developerTools = document.getElementById('developerTools');
        if (!developerTools) return;

        // Show/hide developer tools with Ctrl+Shift+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                const isVisible = developerTools.style.display !== 'none';
                developerTools.style.display = isVisible ? 'none' : 'block';
                
                if (!isVisible) {
                    console.log('🛠️ Developer tools activated! Press Ctrl+Shift+D to hide.');
                }
            }
        });

        // Add dark mode styles for developer tools
        const observer = new MutationObserver(() => {
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                developerTools.style.background = 'var(--bg-secondary)';
                developerTools.style.borderColor = 'var(--border-primary)';
                developerTools.style.color = 'var(--text-primary)';
            } else {
                developerTools.style.background = 'var(--gray-100)';
                developerTools.style.borderColor = 'var(--gray-300)';
                developerTools.style.color = 'var(--gray-700)';
            }
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    // Scroll to Top Button - WCAG 2.2 AA Compliant
    setupScrollToTop() {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (!scrollToTopBtn) return;

        // Show/hide button based on scroll position
        const toggleScrollButton = () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        };

        // Smooth scroll to top
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        // Event listeners
        window.addEventListener('scroll', toggleScrollButton, { passive: true });
        scrollToTopBtn.addEventListener('click', scrollToTop);

        // Keyboard accessibility
        scrollToTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });

        // Initial state
        toggleScrollButton();
    }
}

// DocumentationApp class ends here
// Note: DocumentationApp is now initialized after configuration is loaded

// Service Worker removed - PWA features not needed for now
