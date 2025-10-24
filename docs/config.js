// CHIRON CONFIGURATION
// =============================================
// This is the ONLY configuration file you need to edit.
// All navigation, branding, and settings are controlled from here.

window.chironConfig = {
  // ============ CONFIGURATION DATA ============
  // Edit these values to customize your documentation site
  data: {
    "project": {
      "name": "go-timecache",
      "title": "go-timecache - Ultra-fast time caching for high-performance Go applications", 
      "description": "go-timecache provides zero-allocation access to cached time values, eliminating the performance overhead of repeated time.Now() calls in high-throughput scenarios like logging, metrics collection, and real-time data processing."
    },
    "branding": {
      "name": "go-timecache",
      "tagline": "Ultra-fast time caching for high-performance Go applications",
      "description": "go-timecache provides zero-allocation access to cached time values, eliminating the performance overhead of repeated time.Now() calls in high-throughput scenarios like logging, metrics collection, and real-time data processing.",
      "company": "Agilira",
      "company_url": "https://github.com/agilira",
      "colors": {
        "primary": "#3b82f6",
        "primary_dark": "#2563eb", 
        "accent": "#10b981"
      },
      "logo": {
        "src": "assets/logo-black.png",
        "src_dark": "assets/logo-white.png",
        "alt": "Agilira Logo",
        "footer_src": "assets/logo-footer.png",
        "footer_src_dark": "assets/logo-footer-white.png"
      }
    },
    "navigation": {
      "header": [
        {"label": "Documentation", "url": "index.html"}
      ],
      "header_actions": {
        "github_link": "https://github.com/agilira/go-timecache",
        "theme_toggle": true
      },
      "sidebar": [
        {
          "section": "Documentation",
          "items": [
            {"label": "Overview", "url": "index.html", "active": true},
            {"label": "API Reference", "url": "api-reference.html"},
            {"label": "GitHub Repository", "url": "https://github.com/agilira/go-timecache", "external": true},
            {"label": "License MPL 2.0", "url": "https://github.com/agilira/go-timecache/blob/main/LICENSE.md", "external": true},
            {"label": "Blog", "url": "https://agilira.one", "external": true},
            {"label": "Built with Chiron", "url": "https://github.com/agilira/chiron", "external": true},
          ]
        },
      ],
      "breadcrumb": {
        "enabled": true,
        "items": [
          {"label": "AGILira", "url": "https://github.com/agilira", "external": true},
          {"label": "go-timecache", "url": "https://github.com/agilira/go-timecache", "external": true},
          {"label": "Documentation", "url": "index.html"},
          {"label": "Current Page", "url": "", "current": true}
        ]
      }
    },
    "github": {
      "owner": "agilira",
      "repo": "go-timecache", 
      "branch": "main",
      "show_version": true,
      "current_version": "v1.0.0"
    },
    "opengraph": {
      "site_name": "go-timecache Documentation",
      "type": "website",
      "locale": "en_US",
      "image": {
        "url": "og-image.png",
        "width": 1200,
        "height": 630,
        "alt": "go-timecache Documentation"
      },
      "twitter": {
        "card": "summary_large_image",
        "site": "@agilirax",
        "creator": "@agilirax"
      }
    },
    "features": {
      "search": false,
      "code_copy": true,
      "table_of_contents": true,
      "breadcrumbs": true,
      "cookie_consent": true,
      "dark_mode": false,
      "print_styles": true
    }
  },

  // ============ CONFIGURATION MANAGER ============
  // Don't edit below this line unless you know what you're doing
  
  config: null,
  isLoaded: false,

  async load() {
    this.config = this.data;
    this.isLoaded = true;
    console.log('Configuration loaded successfully');
    return this.config;
  },

  apply() {
    if (!this.isLoaded) {
      console.error('Configuration not loaded successfully');
      return;
    }
    
    console.log('Applying configuration...');
    this.applyMetaTags();
    this.applyStructuredData();
    this.applyLogos();
    this.applyNavigation();
    this.applyBreadcrumb();
    this.applyFooter();
    this.applyFeatures();
    this.applyHomepageContent();
    console.log('Configuration applied');
  },

  applyMetaTags() {
    const { branding, github, opengraph } = this.config;
    
    if (!branding) {
      console.warn('Branding configuration not found');
      return;
    }
    
    // Update page title only if not already set
    if (document.title === 'Documentation Template' || document.title === '') {
      document.title = `${branding.name} - ${branding.tagline}`;
    }
    
    // Update meta description only if not already set
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && metaDescription.content === 'Modern and accessible documentation template for libraries and applications') {
      metaDescription.content = branding.description;
    }
    
    // Update author
    const metaAuthor = document.querySelector('meta[name="author"]');
    if (metaAuthor) {
      metaAuthor.content = branding.company;
    }
    
    // Update Open Graph tags
    this.updateOpenGraphTags(branding, github, opengraph);
    
    // Update Twitter Card tags
    this.updateTwitterTags(branding, github, opengraph);
    
    console.log('Meta tags updated');
  },

  updateOpenGraphTags(branding, github, opengraph) {
    const baseUrl = github ? `https://${github.owner}.github.io/${github.repo}/` : '';
    
    // Open Graph basic tags
    this.updateMetaTag('og:title', `${branding.name} - ${branding.tagline}`);
    this.updateMetaTag('og:description', branding.description);
    this.updateMetaTag('og:type', opengraph?.type || 'website');
    this.updateMetaTag('og:site_name', opengraph?.site_name || `${branding.name} Documentation`);
    this.updateMetaTag('og:locale', opengraph?.locale || 'en_US');
    
    if (baseUrl) {
      this.updateMetaTag('og:url', baseUrl);
    }
    
    // Open Graph image
    if (opengraph?.image) {
      const imageUrl = baseUrl ? `${baseUrl}${opengraph.image.url}` : opengraph.image.url;
      this.updateMetaTag('og:image', imageUrl);
      this.updateMetaTag('og:image:width', opengraph.image.width?.toString());
      this.updateMetaTag('og:image:height', opengraph.image.height?.toString());
      this.updateMetaTag('og:image:alt', opengraph.image.alt);
    }
  },

  updateTwitterTags(branding, github, opengraph) {
    const baseUrl = github ? `https://${github.owner}.github.io/${github.repo}/` : '';
    
    // Twitter Card tags
    this.updateMetaTag('twitter:card', opengraph?.twitter?.card || 'summary_large_image');
    this.updateMetaTag('twitter:title', `${branding.name} - ${branding.tagline}`);
    this.updateMetaTag('twitter:description', branding.description);
    
    if (opengraph?.twitter?.site) {
      this.updateMetaTag('twitter:site', opengraph.twitter.site);
    }
    
    if (opengraph?.twitter?.creator) {
      this.updateMetaTag('twitter:creator', opengraph.twitter.creator);
    }
    
    if (baseUrl) {
      this.updateMetaTag('twitter:url', baseUrl);
    }
    
    // Twitter image
    if (opengraph?.image) {
      const imageUrl = baseUrl ? `${baseUrl}${opengraph.image.url}` : opengraph.image.url;
      this.updateMetaTag('twitter:image', imageUrl);
    }
  },

  updateMetaTag(property, content) {
    const selector = property.startsWith('og:') || property.startsWith('twitter:') 
      ? `meta[property="${property}"]` 
      : `meta[name="${property}"]`;
    
    let metaTag = document.querySelector(selector);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        metaTag.setAttribute('property', property);
      } else {
        metaTag.setAttribute('name', property);
      }
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', content);
  },

  applyStructuredData() {
    const { branding, github } = this.config;
    
    if (!branding) {
      console.warn('Branding configuration not found for structured data');
      return;
    }
    
    const structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (structuredDataScript) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": branding.name,
        "description": branding.description,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Any",
        "softwareVersion": github ? github.current_version : "1.0.0",
        "author": {
          "@type": "Organization",
          "name": branding.company,
          "url": branding.company_url
        },
        "codeRepository": github ? `https://github.com/${github.owner}/${github.repo}` : null,
        "programmingLanguage": "JavaScript",
        "license": "https://opensource.org/licenses/MIT",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      };
      
      structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
    }
    
    console.log('Structured data updated');
  },

  applyLogos() {
    const { branding } = this.config;
    
    if (!branding || !branding.logo) {
      console.warn('Logo configuration not found');
      return;
    }
    
    // Update header logo
    const headerLogo = document.querySelector('.logo-img');
    if (headerLogo) {
      headerLogo.src = branding.logo.src;
      headerLogo.alt = branding.logo.alt;
      headerLogo.setAttribute('data-logo-light', branding.logo.src);
      headerLogo.setAttribute('data-logo-dark', branding.logo.src_dark);
    }
    
    // Update footer logo
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
      footerLogo.src = branding.logo.footer_src;
      footerLogo.alt = branding.logo.alt;
      footerLogo.setAttribute('data-logo-light', branding.logo.footer_src);
      footerLogo.setAttribute('data-logo-dark', branding.logo.footer_src_dark);
    }
    
    // Apply current theme to logos
    if (window.documentationApp) {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      window.documentationApp.updateLogosForTheme(currentTheme);
    }
    
    console.log('Logos configured');
  },

  applyNavigation() {
    const { navigation } = this.config;
    
    if (navigation && navigation.header) {
      this.applyHeaderNavigation(navigation.header);
    }
    
    if (navigation && navigation.header_actions) {
      this.applyHeaderActions(navigation.header_actions);
    }
    
    if (navigation && navigation.sidebar) {
      this.applySidebarNavigation(navigation.sidebar);
    }
  },

  applyHeaderNavigation(headerNav) {
    const headerNavElement = document.querySelector('.header-nav');
    if (!headerNavElement) return;
    
    headerNavElement.innerHTML = headerNav.map(item => {
      const activeClass = item.active ? ' active' : '';
      const target = item.external ? ' target="_blank" rel="noopener"' : '';
      return `<a href="${item.url}" class="nav-link${activeClass}"${target}>${item.label}</a>`;
    }).join('');
  },

  applyHeaderActions(actions) {
    const actionsContainer = document.querySelector('.header-actions');
    if (!actionsContainer) return;
    
    let html = '';
    
    if (actions.github_link) {
      html += `<a href="${actions.github_link}" class="header-action-btn" target="_blank" rel="noopener" aria-label="GitHub Repository">
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" fill="currentColor"/>
        </svg>
      </a>`;
    }
    
    if (actions.theme_toggle) {
      html += `<button class="header-action-btn theme-toggle" aria-label="Toggle theme">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="theme-icon-sun">
          <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="theme-icon-moon">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>`;
    }
    
    actionsContainer.innerHTML = html;
    
    // Re-initialize theme toggle if it was added
    if (actions.theme_toggle && window.documentationApp) {
      window.documentationApp.setupThemeToggle();
    }
  },

  applySidebarNavigation(sidebarNav) {
    const sidebarNavElement = document.querySelector('.sidebar-nav');
    if (!sidebarNavElement) return;
    
    // Add transition for smooth updates
    sidebarNavElement.style.opacity = '0.7';
    sidebarNavElement.style.transition = 'opacity 0.2s ease';
    
    // Auto-detect current page and update active states
    this.updateActiveStates(sidebarNav);
    
    const html = sidebarNav.map(section => {
      const itemsHtml = section.items.map(item => {
        const activeClass = item.active ? ' active' : '';
        const target = item.external ? ' target="_blank" rel="noopener"' : '';
        const href = item.url || item.anchor || '#';
        return `<li><a href="${href}" class="nav-item${activeClass}"${target}>${item.label}</a></li>`;
      }).join('');
      
      return `
        <div class="nav-section">
          <h3 class="nav-section-title">${section.section}</h3>
          <ul class="nav-list">${itemsHtml}</ul>
        </div>
      `;
    }).join('');
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      sidebarNavElement.innerHTML = html;
      sidebarNavElement.style.opacity = '1';
    });
  },

  updateActiveStates(sidebarNav) {
    const currentPage = this.getCurrentPageName();
    
    // Reset all active states
    sidebarNav.forEach(section => {
      section.items.forEach(item => {
        item.active = false;
      });
    });
    
    // Set active state for current page
    sidebarNav.forEach(section => {
      section.items.forEach(item => {
        if (item.url && this.getPageNameFromUrl(item.url) === currentPage) {
          item.active = true;
        }
      });
    });
  },

  getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    // Handle different page names
    const pageMap = {
      'index.html': 'index',
      'api-reference.html': 'api-reference',
      'privacy-policy.html': 'privacy-policy',
      'terms-of-service.html': 'terms-of-service',
      'cookie-policy.html': 'cookie-policy'
    };
    
    return pageMap[filename] || 'index';
  },

  getPageNameFromUrl(url) {
    if (!url || url.startsWith('http') || url.startsWith('#')) {
      return null;
    }
    
    const filename = url.split('/').pop();
    const pageMap = {
      'index.html': 'index',
      'api-reference.html': 'api-reference',
      'privacy-policy.html': 'privacy-policy',
      'terms-of-service.html': 'terms-of-service',
      'cookie-policy.html': 'cookie-policy'
    };
    
    return pageMap[filename] || null;
  },

  applyBreadcrumb() {
    const { navigation } = this.config;
    
    if (!navigation || !navigation.breadcrumb || !navigation.breadcrumb.enabled) {
      return;
    }
    
    const breadcrumbElement = document.querySelector('.breadcrumb-list');
    if (!breadcrumbElement) return;
    
    // Add transition class for smooth updates
    breadcrumbElement.style.opacity = '0.7';
    breadcrumbElement.style.transition = 'opacity 0.2s ease';
    
    // Auto-detect current page and update breadcrumb
    this.updateBreadcrumbForCurrentPage(navigation.breadcrumb);
    
    const html = navigation.breadcrumb.items
      .filter(item => item.label && item.label.trim() !== '') // Filter out hidden items
      .map((item, index, filteredItems) => {
        const isLast = index === filteredItems.length - 1;
        const currentClass = item.current ? ' current' : '';
        
        if (isLast) {
          return `<li class="breadcrumb-item${currentClass}">${item.label}</li>`;
        } else {
          const target = item.external ? ' target="_blank" rel="noopener"' : '';
          const href = item.url || '#';
          return `
            <li class="breadcrumb-item">
              <a href="${href}"${target}>${item.label}</a>
            </li>
            <li class="breadcrumb-separator">/</li>
          `;
        }
      }).join('');
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      breadcrumbElement.innerHTML = html;
      breadcrumbElement.style.opacity = '1';
      console.log('Breadcrumb updated');
    });
  },

  updateBreadcrumbForCurrentPage(breadcrumbConfig) {
    const currentPage = this.getCurrentPageName();
    
    // Reset all current states
    breadcrumbConfig.items.forEach(item => {
      item.current = false;
    });
    
    // Set current page based on page name
    const pageMap = {
      'index': 'Documentation',
      'api-reference': 'API Reference',
      'privacy-policy': 'Privacy Policy',
      'terms-of-service': 'Terms of Service',
      'cookie-policy': 'Cookie Policy'
    };
    
    const currentLabel = pageMap[currentPage] || 'Documentation';
    
    // Find the "Current Page" item and update it
    const currentItem = breadcrumbConfig.items.find(item => 
      item.label === 'Current Page'
    );
    
    // Find the Documentation item
    const docItem = breadcrumbConfig.items.find(item => 
      item.label === 'Documentation'
    );
    
    if (currentPage === 'index') {
      // On homepage: Documentation is current, hide "Current Page"
      if (docItem) {
        docItem.current = true;
        docItem.url = ''; // Current page has no URL
      }
      if (currentItem) {
        currentItem.current = false;
        currentItem.label = ''; // Hide current page item
      }
    } else {
      // On other pages: Documentation is a link, Current Page is current
      if (docItem) {
        docItem.current = false;
        docItem.url = 'index.html'; // Link to home
      }
      if (currentItem) {
        currentItem.current = true;
        currentItem.label = currentLabel;
        currentItem.url = ''; // Current page has no URL
      }
    }
  },

  applyFooter() {
    const { footer } = this.config;
    if (!footer) return;
    
    // Update footer description
    if (footer.description) {
      const footerDescription = document.querySelector('.footer-description');
      if (footerDescription) {
        footerDescription.textContent = footer.description;
      }
    }
    
    // Update social links
    if (footer.social && Array.isArray(footer.social)) {
      // Social links removed for professional docs footer
    }
    
    // Update copyright year
    const currentYear = new Date().getFullYear();
    const copyrightYearElement = document.querySelector('.copyright-year');
    if (copyrightYearElement) {
      copyrightYearElement.textContent = currentYear;
    }
  },



  applyFeatures() {
    // Features application logic here if needed
  },

  applyHomepageContent() {
    const { branding, github } = this.config;
    
    if (!branding) {
      console.warn('Branding configuration not found for homepage content');
      return;
    }
    
    // Update project name in header
    const projectNameLink = document.querySelector('.project-name');
    if (projectNameLink) {
      projectNameLink.textContent = branding.name;
      if (github) {
        projectNameLink.href = `https://github.com/${github.owner}/${github.repo}`;
      }
    }
    
    // Update main hero section if exists
    const heroTitle = document.querySelector('.hero-title, h1');
    if (heroTitle && heroTitle.textContent.includes('Documentation Template')) {
      heroTitle.innerHTML = heroTitle.innerHTML.replace('Documentation Template', branding.name);
    }
    
    // Update breadcrumbs
    const breadcrumbProject = document.querySelector('.breadcrumb a[href*="chiron"]');
    if (breadcrumbProject) {
      breadcrumbProject.textContent = branding.name;
      if (github) {
        breadcrumbProject.href = `https://github.com/${github.owner}/${github.repo}`;
      }
    }
    
    // Update installation command if present
    const installCommand = document.querySelector('code');
    if (installCommand && installCommand.textContent.includes('git clone')) {
      if (github) {
        installCommand.textContent = `git clone https://github.com/${github.owner}/${github.repo}.git`;
      }
    }
    
    // Update any hardcoded GitHub links
    const githubLinks = document.querySelectorAll('a[href*="agilira/chiron"]');
    if (github) {
      githubLinks.forEach(link => {
        const newHref = link.href.replace('agilira/chiron', `${github.owner}/${github.repo}`);
        link.href = newHref;
      });
    }
    
    // Update company links (exclude repository links)
    const companyLinks = document.querySelectorAll('a[href="https://github.com/agilira"]');
    if (branding.company_url) {
      companyLinks.forEach(link => {
        link.href = branding.company_url;
      });
    }
    
    console.log('Homepage content updated');
  },

  generateSitemap() {
    const { github, navigation } = this.config;
    
    if (!github) {
      console.warn('GitHub configuration not found for sitemap generation');
      return;
    }
    
    const baseUrl = `https://${github.owner}.github.io/${github.repo}/`;
    const currentDate = new Date().toISOString();
    
    // Get all pages from navigation
    const pages = [];
    
    // Add homepage
    pages.push({
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    });
    
    // Add pages from sidebar navigation
    if (navigation && navigation.sidebar) {
      navigation.sidebar.forEach(section => {
        if (section.items) {
          section.items.forEach(item => {
            if (item.url && !item.external && !item.url.startsWith('http') && !item.url.startsWith('#')) {
              pages.push({
                url: `${baseUrl}${item.url}`,
                lastmod: currentDate,
                changefreq: 'monthly',
                priority: '0.8'
              });
            }
          });
        }
      });
    }
    
    // Add header navigation pages
    if (navigation && navigation.header) {
      navigation.header.forEach(item => {
        if (item.url && !item.external && !item.url.startsWith('http') && !item.url.startsWith('#')) {
          pages.push({
            url: `${baseUrl}${item.url}`,
            lastmod: currentDate,
            changefreq: 'monthly',
            priority: '0.9'
          });
        }
      });
    }
    
    // Remove duplicates
    const uniquePages = pages.filter((page, index, self) => 
      index === self.findIndex(p => p.url === page.url)
    );
    
    // Generate sitemap XML
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Create and download sitemap
    this.downloadSitemap(sitemapXml);
    
    console.log('Sitemap generated with', uniquePages.length, 'pages');
  },

  downloadSitemap(sitemapXml) {
    // Create a blob with the sitemap content
    const blob = new Blob([sitemapXml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    // Show the sitemap URL for SEO configuration
    const { github } = this.config;
    if (github) {
      const sitemapUrl = `https://${github.owner}.github.io/${github.repo}/sitemap.xml`;
      console.log('📄 Sitemap generated!');
      console.log('🔗 Sitemap URL for SEO:', sitemapUrl);
      console.log('💡 Add this URL to your robots.txt and submit to Google Search Console');
      
      // Show URL in a toast notification
      if (window.documentationApp && window.documentationApp.showToast) {
        window.documentationApp.showToast(`Sitemap generated! URL: ${sitemapUrl}`, 'success');
      }
    }
  },

  generateRobotsTxt() {
    const { github } = this.config;
    
    if (!github) {
      console.warn('GitHub configuration not found for robots.txt generation');
      return;
    }
    
    const baseUrl = `https://${github.owner}.github.io/${github.repo}/`;
    const sitemapUrl = `${baseUrl}sitemap.xml`;
    
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${sitemapUrl}`;
    
    // Create and download robots.txt
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('🤖 Robots.txt generated!');
    console.log('🔗 Sitemap URL:', sitemapUrl);
  },


  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};

// Initialize the global instance
window.chironConfig = window.chironConfig;