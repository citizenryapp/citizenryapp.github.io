/**
 * Blog Rotation Script
 * 
 * This script rotates blog articles to make the blog appear fresh.
 * It moves articles in a rotation pattern and updates dates to maintain
 * the appearance of twice-weekly publishing.
 * 
 * Run manually: node scripts/rotate-blog.js
 * Or automatically via GitHub Actions every 3-4 days
 */

const fs = require('fs');
const path = require('path');

// Configuration
const ARTICLES_PER_PAGE = 4;
const DAYS_BETWEEN_POSTS = 3.5; // Average days between posts (twice weekly)

// Read the articles data
const articlesPath = path.join(__dirname, '..', 'blog-articles.json');
const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

// Rotate articles: move the last non-featured article to position 1 (after featured)
function rotateArticles(articles) {
    // Find the featured article (stays at position 0)
    const featuredIndex = articles.findIndex(a => a.featured);
    const featured = featuredIndex >= 0 ? articles[featuredIndex] : null;
    
    // Get non-featured articles
    const nonFeatured = articles.filter(a => !a.featured);
    
    // Rotate: move last article to first position
    const lastArticle = nonFeatured.pop();
    nonFeatured.unshift(lastArticle);
    
    // Rebuild array with featured first
    if (featured) {
        return [featured, ...nonFeatured];
    }
    return nonFeatured;
}

// Calculate dates working backwards from today
function calculateDates(articles) {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < articles.length; i++) {
        const daysAgo = Math.round(i * DAYS_BETWEEN_POSTS);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);
        dates.push(date);
    }
    
    return dates;
}

// Format date for display (e.g., "January 23, 2025")
function formatDateDisplay(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Format date for datetime attribute (e.g., "2025-01-23")
function formatDateISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Generate article card HTML
function generateArticleCard(article, date) {
    return `                        <article class="blog-post-card">
                            <div class="post-content">
                                <h3 data-en="${article.title_en}" data-es="${article.title_es}">${article.title_en}</h3>
                                <div class="post-meta"><time datetime="${formatDateISO(date)}">${formatDateDisplay(date)}</time></div>
                                <p class="excerpt" data-en="${article.excerpt_en}" data-es="${article.excerpt_es}">${article.excerpt_en}</p>
                                <a href="${article.file}" class="read-more-link" data-en="Read More →" data-es="Leer Más →">Read More →</a>
                            </div>
                        </article>`;
}

// Generate pagination HTML
function generatePagination(currentPage, totalPages) {
    let html = '                    <nav class="pagination" aria-label="Blog pagination">\n';
    
    // Previous link
    if (currentPage > 1) {
        const prevPage = currentPage === 2 ? 'blog.html' : `blog-page-${currentPage - 1}.html`;
        html += `                        <a href="${prevPage}" class="pagination-prev" data-en="← Previous" data-es="← Anterior">← Previous</a>\n`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageFile = i === 1 ? 'blog.html' : `blog-page-${i}.html`;
        if (i === currentPage) {
            html += `                        <span class="pagination-current">${i}</span>\n`;
        } else {
            html += `                        <a href="${pageFile}" class="pagination-link">${i}</a>\n`;
        }
    }
    
    // Next link
    if (currentPage < totalPages) {
        html += `                        <a href="blog-page-${currentPage + 1}.html" class="pagination-next" data-en="Next →" data-es="Siguiente →">Next →</a>\n`;
    }
    
    html += '                    </nav>';
    return html;
}

// Generate the main blog.html (page 1 with featured article)
function generateBlogPage1(articles, dates) {
    const featured = articles[0];
    const featuredDate = dates[0];
    const regularArticles = articles.slice(1, 1 + ARTICLES_PER_PAGE);
    const regularDates = dates.slice(1, 1 + ARTICLES_PER_PAGE);
    const totalPages = Math.ceil((articles.length - 1) / ARTICLES_PER_PAGE) + (articles[0].featured ? 0 : 0);
    const actualTotalPages = Math.ceil((articles.length) / (ARTICLES_PER_PAGE + 1));
    
    // Calculate total pages properly
    const nonFeaturedCount = articles.length - 1;
    const pages = Math.ceil(nonFeaturedCount / ARTICLES_PER_PAGE);
    
    const articleCards = regularArticles.map((article, i) => 
        generateArticleCard(article, regularDates[i])
    ).join('\n\n');
    
    const pagination = generatePagination(1, pages);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>US Citizenship Test Guide & Tips - Citizenry Blog</title>
    <meta name="title" content="US Citizenship Test Guide & Tips - Citizenry Blog">
    <meta name="description" content="Expert tips and guides for passing your US citizenship test. Learn about the 2025 civics test, N-400 interview preparation, and naturalization requirements.">
    <meta name="keywords" content="US citizenship test tips, civics test guide, N-400 interview, naturalization test, citizenship blog">
    <meta name="robots" content="index, follow">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://citizenryapp.com/blog">
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://citizenryapp.com/blog">
    <meta property="og:title" content="US Citizenship Test Guide & Tips - Citizenry Blog">
    <meta property="og:description" content="Expert tips and guides for passing your US citizenship test.">
    
    <!-- Alternate Language -->
    <link rel="alternate" hreflang="en" href="https://citizenryapp.com/blog">
    <link rel="alternate" hreflang="es" href="https://citizenryapp.com/blog?lang=es">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/images/favicon.png">
    <link rel="apple-touch-icon" href="assets/images/favicon.png">
    
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/blog.css">
    
    <!-- Blog Schema -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Citizenry Blog",
        "description": "Expert tips and guides for passing your US citizenship test",
        "url": "https://citizenryapp.com/blog",
        "publisher": {
            "@type": "Organization",
            "name": "Citizenry",
            "logo": "https://citizenryapp.com/assets/images/citizenry-logo.png"
        }
    }
    </script>
</head>
<body>
    <!-- Skip to content -->
    <a href="#main-content" class="skip-link" data-en="Skip to content" data-es="Saltar al contenido">Skip to content</a>

    <!-- Header/Navigation -->
    <header class="header">
        <nav class="navbar">
            <div class="container">
                <div class="nav-wrapper">
                    <a href="index.html" class="logo">
                        <img src="assets/images/citizenry-logo.png" alt="Citizenry" height="40">
                    </a>
                    
                    <div class="nav-center">
                        <ul class="nav-menu" id="navMenu">
                            <li><a href="index.html" data-en="Home" data-es="Inicio">Home</a></li>
                            <li><a href="index.html#features" data-en="Features" data-es="Características">Features</a></li>
                            <li><a href="index.html#testimonials" data-en="Testimonials" data-es="Testimonios">Testimonials</a></li>
                            <li><a href="blog.html" class="active" data-en="Blog" data-es="Blog">Blog</a></li>
                        </ul>
                    </div>
                    
                    <div class="nav-right">
                        <!-- Language Toggle -->
                        <button type="button" class="lang-toggle" aria-label="Switch language">
                            <span class="lang-text" data-en="Español" data-es="English">Español</span>
                        </button>
                        
                        <!-- Header App Store Badge -->
                        <a href="https://apps.apple.com/us/app/us-citizenship-test-2026-uscis/id6451455299" class="header-download" target="_blank" rel="noopener">
                            <img src="assets/images/app-store-badge-en.svg" alt="Download on the App Store" class="header-badge" id="headerBadge" data-en="assets/images/app-store-badge-en.svg" data-es="assets/images/app-store-badge-es.svg">
                        </a>
                        
                        <!-- Mobile Menu Toggle -->
                        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu" aria-expanded="false">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        
        <!-- Mobile Slide Menu -->
        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-menu-header">
                <img src="assets/images/citizenry-logo.png" alt="Citizenry" height="32">
                <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">&times;</button>
            </div>
            <ul class="mobile-nav-links">
                <li><a href="index.html" data-en="Home" data-es="Inicio">Home</a></li>
                <li><a href="index.html#features" data-en="Features" data-es="Características">Features</a></li>
                <li><a href="index.html#testimonials" data-en="Testimonials" data-es="Testimonios">Testimonials</a></li>
                <li><a href="blog.html" data-en="Blog" data-es="Blog">Blog</a></li>
            </ul>
            <a href="https://apps.apple.com/us/app/us-citizenship-test-2026-uscis/id6451455299" class="mobile-download-btn" target="_blank" rel="noopener">
                <img src="assets/images/app-store-badge-en.svg" alt="Download on the App Store" id="mobileBadge" data-en="assets/images/app-store-badge-en.svg" data-es="assets/images/app-store-badge-es.svg">
            </a>
        </div>
        <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
    </header>

    <!-- Main Content -->
    <main id="main-content">
        <!-- Blog Header -->
        <section class="blog-header">
            <div class="container">
                <h1 data-en="US Citizenship Test Guide & Tips" data-es="Guía y Consejos para el Examen de Ciudadanía">US Citizenship Test Guide & Tips</h1>
                <p data-en="Everything you need to know to pass your citizenship test" data-es="Todo lo que necesitas saber para aprobar tu examen de ciudadanía">Everything you need to know to pass your citizenship test</p>
            </div>
        </section>

        <!-- Featured Article Section -->
        <section class="featured-article">
            <div class="container">
                <div class="featured-content">
                    <div class="featured-image">
                        <img src="assets/images/hero-screenshot-en.png" alt="${featured.title_en}" id="featuredImage" data-en="assets/images/hero-screenshot-en.png" data-es="assets/images/hero-screenshot-es.png">
                    </div>
                    <div class="featured-text">
                        <div class="featured-badge-large" data-en="Featured Article" data-es="Artículo Destacado">Featured Article</div>
                        <h2 data-en="${featured.title_en}" data-es="${featured.title_es}">${featured.title_en}</h2>
                        <div class="post-meta">
                            <time datetime="${formatDateISO(featuredDate)}">${formatDateDisplay(featuredDate)}</time>
                        </div>
                        <p class="featured-excerpt" data-en="${featured.excerpt_en}" data-es="${featured.excerpt_es}">${featured.excerpt_en}</p>
                        <a href="${featured.file}" class="read-more-link large" data-en="Read More →" data-es="Leer Más →">Read More →</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- Blog Posts Grid -->
        <section class="blog-content">
            <div class="container">
                <div class="blog-layout">
                    <!-- Main Blog Posts -->
                    <div class="blog-posts-grid">
${articleCards}
                    </div>
                    
                    <!-- Pagination -->
${pagination}
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="blog-cta-section">
            <div class="container">
                <h2 data-en="Ready to Start Practicing?" data-es="¿Listo para Empezar a Practicar?">Ready to Start Practicing?</h2>
                <p data-en="Download Citizenry and practice with AI-powered mock interviews" data-es="Descarga Citizenry y practica con entrevistas simuladas con IA">Download Citizenry and practice with AI-powered mock interviews</p>
                <a href="https://apps.apple.com/us/app/us-citizenship-test-2026-uscis/id6451455299" class="download-btn-large" target="_blank" rel="noopener">
                    <img src="assets/images/app-store-badge-en.svg" alt="Download on the App Store" id="blogCtaBadge" data-en="assets/images/app-store-badge-en.svg" data-es="assets/images/app-store-badge-es.svg">
                </a>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <img src="assets/images/citizenry-logo.png" alt="Citizenry" height="32">
                </div>
                <div class="footer-links">
                    <a href="privacy-policy.html" data-en="Privacy Policy" data-es="Política de Privacidad">Privacy Policy</a>
                    <a href="terms-of-service.html" data-en="Terms of Service" data-es="Términos de Servicio">Terms of Service</a>
                </div>
                <p class="footer-copyright">&copy; 2025 Citizenry. <span data-en="All rights reserved." data-es="Todos los derechos reservados.">All rights reserved.</span></p>
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
</body>
</html>`;
}

// Generate subsequent blog pages (page 2, 3, 4, etc.)
function generateBlogPageN(pageNum, articles, dates, totalPages) {
    // Calculate which articles to show on this page
    // Page 1 has featured + 4 articles (indices 0-4)
    // Page 2 starts at index 5, shows 4 articles (indices 5-8)
    // Page 3 starts at index 9, shows 4 articles (indices 9-12)
    const startIndex = 1 + (pageNum - 1) * ARTICLES_PER_PAGE;
    const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, articles.length);
    
    const pageArticles = articles.slice(startIndex, endIndex);
    const pageDates = dates.slice(startIndex, endIndex);
    
    const articleCards = pageArticles.map((article, i) => 
        generateArticleCard(article, pageDates[i])
    ).join('\n\n');
    
    const pagination = generatePagination(pageNum, totalPages);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>US Citizenship Test Guide & Tips - Page ${pageNum} - Citizenry Blog</title>
    <meta name="description" content="Expert tips and guides for passing your US citizenship test. Page ${pageNum} of our citizenship test preparation articles.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://citizenryapp.com/blog-page-${pageNum}">
    <link rel="icon" type="image/png" href="assets/images/favicon.png">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/blog.css">
</head>
<body>
    <a href="#main-content" class="skip-link" data-en="Skip to content" data-es="Saltar al contenido">Skip to content</a>

    <header class="header">
        <nav class="navbar">
            <div class="container">
                <div class="nav-wrapper">
                    <a href="index.html" class="logo"><img src="assets/images/citizenry-logo.png" alt="Citizenry" height="40"></a>
                    <div class="nav-center">
                        <ul class="nav-menu">
                            <li><a href="index.html" data-en="Home" data-es="Inicio">Home</a></li>
                            <li><a href="index.html#features" data-en="Features" data-es="Características">Features</a></li>
                            <li><a href="index.html#testimonials" data-en="Testimonials" data-es="Testimonios">Testimonials</a></li>
                            <li><a href="blog.html" class="active" data-en="Blog" data-es="Blog">Blog</a></li>
                        </ul>
                    </div>
                    <div class="nav-right">
                        <button type="button" class="lang-toggle" aria-label="Switch language"><span class="lang-text" data-en="Español" data-es="English">Español</span></button>
                        <a href="https://apps.apple.com/us/app/us-citizenship-test-2026-uscis/id6451455299" class="header-download" target="_blank" rel="noopener"><img src="assets/images/app-store-badge-en.svg" alt="Download on the App Store" class="header-badge" data-en="assets/images/app-store-badge-en.svg" data-es="assets/images/app-store-badge-es.svg"></a>
                        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
                    </div>
                </div>
            </div>
        </nav>
        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-menu-header"><img src="assets/images/citizenry-logo.png" alt="Citizenry" height="32"><button class="mobile-menu-close" id="mobileMenuClose">&times;</button></div>
            <ul class="mobile-nav-links">
                <li><a href="index.html" data-en="Home" data-es="Inicio">Home</a></li>
                <li><a href="index.html#features" data-en="Features" data-es="Características">Features</a></li>
                <li><a href="index.html#testimonials" data-en="Testimonials" data-es="Testimonios">Testimonials</a></li>
                <li><a href="blog.html" data-en="Blog" data-es="Blog">Blog</a></li>
            </ul>
            <a href="https://apps.apple.com/us/app/us-citizenship-test-2026-uscis/id6451455299" class="mobile-download-btn" target="_blank"><img src="assets/images/app-store-badge-en.svg" alt="Download on the App Store" data-en="assets/images/app-store-badge-en.svg" data-es="assets/images/app-store-badge-es.svg"></a>
        </div>
        <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
    </header>

    <main id="main-content">
        <section class="blog-header">
            <div class="container">
                <h1 data-en="US Citizenship Test Guide & Tips" data-es="Guía y Consejos para el Examen de Ciudadanía">US Citizenship Test Guide & Tips</h1>
                <p data-en="Everything you need to know to pass your citizenship test" data-es="Todo lo que necesitas saber para aprobar tu examen de ciudadanía">Everything you need to know to pass your citizenship test</p>
            </div>
        </section>

        <section class="blog-content">
            <div class="container">
                <div class="blog-layout">
                    <div class="blog-posts-grid">
${articleCards}
                    </div>
                    
${pagination}
                </div>
            </div>
        </section>

        <section class="blog-cta-section">
            <div class="container">
                <h2 data-en="Ready to Start Practicing?" data-es="¿Listo para Empezar a Practicar?">Ready to Start Practicing?</h2>
                <p data-en="Download Citizenry and practice with AI-powered mock interviews" data-es="Descarga Citizenry y practica con entrevistas simuladas con IA">Download Citizenry and practice with AI-powered mock interviews</p>
                <a href="https://apps.apple.com/us/app/us-citizenship-test-2026-uscis/id6451455299" class="download-btn-large" target="_blank" rel="noopener"><img src="assets/images/app-store-badge-en.svg" alt="Download on the App Store" data-en="assets/images/app-store-badge-en.svg" data-es="assets/images/app-store-badge-es.svg"></a>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand"><img src="assets/images/citizenry-logo.png" alt="Citizenry" height="32"></div>
                <div class="footer-links">
                    <a href="privacy-policy.html" data-en="Privacy Policy" data-es="Política de Privacidad">Privacy Policy</a>
                    <a href="terms-of-service.html" data-en="Terms of Service" data-es="Términos de Servicio">Terms of Service</a>
                </div>
                <p class="footer-copyright">&copy; 2025 Citizenry. <span data-en="All rights reserved." data-es="Todos los derechos reservados.">All rights reserved.</span></p>
            </div>
        </div>
    </footer>
    <script src="js/main.js"></script>
</body>
</html>`;
}

// Update individual article file with new date
function updateArticleDate(filePath, date) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`  Skipping ${filePath} (file not found)`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Update datetime attribute in time tag
    content = content.replace(
        /<time datetime="[^"]*">[^<]*<\/time>/g,
        `<time datetime="${formatDateISO(date)}">${formatDateDisplay(date)}</time>`
    );
    
    // Update datePublished in JSON-LD
    content = content.replace(
        /"datePublished":\s*"[^"]*"/g,
        `"datePublished": "${formatDateISO(date)}"`
    );
    
    // Update dateModified in JSON-LD
    content = content.replace(
        /"dateModified":\s*"[^"]*"/g,
        `"dateModified": "${formatDateISO(date)}"`
    );
    
    fs.writeFileSync(fullPath, content);
    console.log(`  Updated ${filePath} → ${formatDateDisplay(date)}`);
}

// Main execution
function main() {
    console.log('🔄 Blog Rotation Script');
    console.log('=======================\n');
    
    // Step 1: Rotate articles
    console.log('Step 1: Rotating articles...');
    const rotatedArticles = rotateArticles(data.articles);
    
    // Step 2: Calculate new dates
    console.log('Step 2: Calculating dates...');
    const dates = calculateDates(rotatedArticles);
    
    // Step 3: Save updated article order
    console.log('Step 3: Saving article order...');
    data.articles = rotatedArticles;
    fs.writeFileSync(articlesPath, JSON.stringify(data, null, 2));
    
    // Step 4: Calculate total pages
    const nonFeaturedCount = rotatedArticles.length - 1;
    const totalPages = Math.ceil(nonFeaturedCount / ARTICLES_PER_PAGE);
    console.log(`  Total articles: ${rotatedArticles.length}`);
    console.log(`  Total pages: ${totalPages}`);
    
    // Step 5: Generate blog pages
    console.log('\nStep 4: Generating blog pages...');
    
    // Generate page 1 (with featured article)
    const page1 = generateBlogPage1(rotatedArticles, dates);
    fs.writeFileSync(path.join(__dirname, '..', 'blog.html'), page1);
    console.log('  Generated blog.html');
    
    // Generate subsequent pages
    for (let i = 2; i <= totalPages; i++) {
        const pageContent = generateBlogPageN(i, rotatedArticles, dates, totalPages);
        fs.writeFileSync(path.join(__dirname, '..', `blog-page-${i}.html`), pageContent);
        console.log(`  Generated blog-page-${i}.html`);
    }
    
    // Step 6: Update individual article files
    console.log('\nStep 5: Updating article dates...');
    rotatedArticles.forEach((article, index) => {
        updateArticleDate(article.file, dates[index]);
    });
    
    console.log('\n✅ Blog rotation complete!');
    console.log(`   Featured article: ${rotatedArticles[0].title_en}`);
    console.log(`   Most recent date: ${formatDateDisplay(dates[0])}`);
}

main();


