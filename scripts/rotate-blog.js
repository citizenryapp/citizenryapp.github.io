/**
 * Blog Rotation Script (Jekyll-Compatible)
 * 
 * This script rotates blog articles to make the blog appear fresh.
 * It moves articles in a rotation pattern and updates dates to maintain
 * the appearance of twice-weekly publishing.
 * 
 * Updated for Jekyll: Generates files with front matter that use layouts.
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
    return `                <article class="blog-post-card">
                    <div class="post-content">
                        <h3 data-en="${article.title_en}" data-es="${article.title_es}">${article.title_en}</h3>
                        <div class="post-meta"><time datetime="${formatDateISO(date)}">${formatDateDisplay(date)}</time></div>
                        <p class="excerpt" data-en="${article.excerpt_en}" data-es="${article.excerpt_es}">${article.excerpt_en}</p>
                        <a href="/blog/${path.basename(article.file)}" class="read-more-link" data-en="Read More →" data-es="Leer Más →">Read More →</a>
                    </div>
                </article>`;
}

// Generate pagination HTML with truncated ellipsis (max 4 page numbers)
function generatePagination(currentPage, totalPages) {
    let html = '            <nav class="pagination" aria-label="Blog pagination">\n';
    
    // Previous link
    if (currentPage > 1) {
        const prevPage = currentPage === 2 ? '/blog.html' : `/blog-page-${currentPage - 1}.html`;
        html += `                <a href="${prevPage}" class="pagination-prev" data-en="← Previous" data-es="← Anterior">← Previous</a>\n`;
    }
    
    // Truncated pagination logic: max 4 page numbers
    const pagesToShow = new Set();
    pagesToShow.add(1);
    if (totalPages > 1) pagesToShow.add(totalPages);
    pagesToShow.add(currentPage);
    
    if (currentPage === 1) {
        if (totalPages > 1) pagesToShow.add(2);
    } else if (currentPage === totalPages) {
        pagesToShow.add(totalPages - 1);
    } else if (currentPage === 2) {
        pagesToShow.add(3);
    } else if (currentPage === 3) {
        pagesToShow.add(2);
    } else {
        if (currentPage + 1 < totalPages) {
            pagesToShow.add(currentPage + 1);
        } else {
            pagesToShow.add(currentPage - 1);
        }
    }
    
    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);
    
    let lastPage = 0;
    for (let i = 0; i < sortedPages.length; i++) {
        const page = sortedPages[i];
        
        if (page - lastPage > 1 && lastPage > 0) {
            html += `                <span class="pagination-ellipsis">...</span>\n`;
        }
        
        const pageFile = page === 1 ? '/blog.html' : `/blog-page-${page}.html`;
        if (page === currentPage) {
            html += `                <span class="pagination-current">${page}</span>\n`;
        } else {
            html += `                <a href="${pageFile}" class="pagination-link">${page}</a>\n`;
        }
        
        lastPage = page;
    }
    
    if (currentPage < totalPages) {
        html += `                <a href="/blog-page-${currentPage + 1}.html" class="pagination-next" data-en="Next →" data-es="Siguiente →">Next →</a>\n`;
    }
    
    html += '            </nav>';
    return html;
}

// Generate the main blog.html (page 1 with featured article) - Jekyll format
function generateBlogPage1(articles, dates) {
    const featured = articles[0];
    const featuredDate = dates[0];
    const regularArticles = articles.slice(1, 1 + ARTICLES_PER_PAGE);
    const regularDates = dates.slice(1, 1 + ARTICLES_PER_PAGE);
    
    const nonFeaturedCount = articles.length - 1;
    const totalPages = Math.ceil(nonFeaturedCount / ARTICLES_PER_PAGE);
    
    const articleCards = regularArticles.map((article, i) => 
        generateArticleCard(article, regularDates[i])
    ).join('\n\n');
    
    const pagination = generatePagination(1, totalPages);

    // Jekyll front matter + content only (no header/footer - handled by layout)
    return `---
layout: blog-list
title: US Citizenship Test Guide & Tips - Citizenry Blog
meta_title: US Citizenship Test Guide & Tips - Citizenry Blog
description: Expert tips and guides for passing your US citizenship test. Learn about the 2025 civics test, N-400 interview preparation, and naturalization requirements.
keywords: US citizenship test tips, civics test guide, N-400 interview, naturalization test, citizenship blog
---

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
                <img src="/assets/images/hero-screenshot-en.png" alt="${featured.title_en}" id="featuredImage" data-en="/assets/images/hero-screenshot-en.png" data-es="/assets/images/hero-screenshot-es.png">
            </div>
            <div class="featured-text">
                <div class="featured-badge-large" data-en="Featured Article" data-es="Artículo Destacado">Featured Article</div>
                <h2 data-en="${featured.title_en}" data-es="${featured.title_es}">${featured.title_en}</h2>
                <div class="post-meta">
                    <time datetime="${formatDateISO(featuredDate)}">${formatDateDisplay(featuredDate)}</time>
                </div>
                <p class="featured-excerpt" data-en="${featured.excerpt_en}" data-es="${featured.excerpt_es}">${featured.excerpt_en}</p>
                <a href="/blog/${path.basename(featured.file)}" class="read-more-link large" data-en="Read More →" data-es="Leer Más →">Read More →</a>
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
        <div class="store-badges">
            <a href="{{ site.app_store_url }}" class="download-btn-large" target="_blank" rel="noopener">
                <img src="/assets/images/app-store-badge-en.svg" alt="Download on the App Store" id="blogCtaBadge" data-en="/assets/images/app-store-badge-en.svg" data-es="/assets/images/app-store-badge-es.svg">
            </a>
            <a href="{{ site.play_store_url }}" class="download-btn-large" target="_blank" rel="noopener">
                <img src="/assets/images/google_play_badge_en.svg" alt="Get it on Google Play" id="blogCtaPlayBadge" data-en="/assets/images/google_play_badge_en.svg" data-es="/assets/images/google_play_badge_es.svg">
            </a>
        </div>
    </div>
</section>
`;
}

// Generate subsequent blog pages (page 2, 3, 4, etc.) - Jekyll format
function generateBlogPageN(pageNum, articles, dates, totalPages) {
    const startIndex = 1 + (pageNum - 1) * ARTICLES_PER_PAGE;
    const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, articles.length);
    
    const pageArticles = articles.slice(startIndex, endIndex);
    const pageDates = dates.slice(startIndex, endIndex);
    
    const articleCards = pageArticles.map((article, i) => 
        generateArticleCard(article, pageDates[i])
    ).join('\n\n');
    
    const pagination = generatePagination(pageNum, totalPages);

    // Jekyll front matter + content only (no header/footer - handled by layout)
    return `---
layout: blog-list
title: US Citizenship Test Guide & Tips - Page ${pageNum} - Citizenry Blog
description: Expert tips and guides for passing your US citizenship test. Page ${pageNum} of our citizenship test preparation articles.
---

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
        <div class="store-badges">
            <a href="{{ site.app_store_url }}" class="download-btn-large" target="_blank" rel="noopener">
                <img src="/assets/images/app-store-badge-en.svg" alt="Download on the App Store" data-en="/assets/images/app-store-badge-en.svg" data-es="/assets/images/app-store-badge-es.svg">
            </a>
            <a href="{{ site.play_store_url }}" class="download-btn-large" target="_blank" rel="noopener">
                <img src="/assets/images/google_play_badge_en.svg" alt="Get it on Google Play" data-en="/assets/images/google_play_badge_en.svg" data-es="/assets/images/google_play_badge_es.svg">
            </a>
        </div>
    </div>
</section>
`;
}

// Update individual article file with new date (Jekyll front matter format)
function updateArticleDate(filePath, date) {
    const fullPath = path.join(__dirname, '..', filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.log(`  Skipping ${filePath} (file not found)`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if file has Jekyll front matter
    if (content.startsWith('---')) {
        // Update date in front matter
        content = content.replace(
            /^(---[\s\S]*?date:\s*)\d{4}-\d{2}-\d{2}/m,
            `$1${formatDateISO(date)}`
        );
    }
    
    // Update datetime attribute in time tag (for any remaining inline dates)
    content = content.replace(
        /<time datetime="[^"]*">[^<]*<\/time>/g,
        `<time datetime="${formatDateISO(date)}">${formatDateDisplay(date)}</time>`
    );
    
    // Update datePublished in JSON-LD (if present)
    content = content.replace(
        /"datePublished":\s*"[^"]*"/g,
        `"datePublished": "${formatDateISO(date)}"`
    );
    
    fs.writeFileSync(fullPath, content);
    console.log(`  Updated ${filePath} → ${formatDateDisplay(date)}`);
}

// Main execution
function main() {
    console.log('🔄 Blog Rotation Script (Jekyll-Compatible)');
    console.log('==========================================\n');
    
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
    
    // Step 5: Generate blog pages (Jekyll format with front matter)
    console.log('\nStep 4: Generating Jekyll blog pages...');
    
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
    console.log('\n   Note: Files use Jekyll layouts - header/footer from _includes/');
}

main();
