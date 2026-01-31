#!/usr/bin/env python3
"""
Script to convert existing HTML blog articles to Jekyll format.
This extracts the content and adds front matter.
"""

import os
import re
from pathlib import Path

def extract_meta(html, pattern, group=1):
    """Extract content using regex pattern."""
    match = re.search(pattern, html, re.DOTALL)
    return match.group(group).strip() if match else ""

def convert_blog_article(filepath):
    """Convert a blog article to Jekyll format."""
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Extract metadata
    title = extract_meta(html, r'<title>([^<]+) - Citizenry</title>')
    if not title:
        title = extract_meta(html, r'<h1[^>]*>([^<]+)</h1>')
    
    description = extract_meta(html, r'<meta name="description" content="([^"]+)"')
    keywords = extract_meta(html, r'<meta name="keywords" content="([^"]+)"')
    date = extract_meta(html, r'<time datetime="([^"]+)"')
    
    # Extract title_es from data-es attribute
    title_es_match = re.search(r'<h1[^>]*data-es="([^"]+)"', html)
    title_es = title_es_match.group(1) if title_es_match else ""
    
    # Extract main content (between post-content div and post-cta)
    content_match = re.search(
        r'<div class="post-content">\s*(.*?)\s*<div class="post-cta">',
        html, 
        re.DOTALL
    )
    
    if not content_match:
        # Try without post-cta (some articles might not have it)
        content_match = re.search(
            r'<div class="post-content">\s*(.*?)\s*</div>\s*</div>\s*</article>',
            html,
            re.DOTALL
        )
    
    content = content_match.group(1).strip() if content_match else ""
    
    # Build front matter
    front_matter = f"""---
layout: blog-post
title: "{title}"
title_es: "{title_es}"
description: "{description}"
keywords: "{keywords}"
date: {date}
---

"""
    
    # Write converted file
    new_content = front_matter + content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Converted: {filepath}")

def convert_blog_pagination(filepath):
    """Convert a blog pagination page to Jekyll format."""
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Extract page number from filename
    filename = os.path.basename(filepath)
    page_num = re.search(r'blog-page-(\d+)', filename)
    page_num = page_num.group(1) if page_num else "1"
    
    # Extract the main content section
    content_match = re.search(
        r'<main id="main-content">\s*(.*?)\s*</main>',
        html,
        re.DOTALL
    )
    content = content_match.group(1).strip() if content_match else ""
    
    # Fix asset paths (remove relative paths)
    content = re.sub(r'href="blog/', 'href="/blog/', content)
    content = re.sub(r'href="blog-page', 'href="/blog-page', content)
    content = re.sub(r'href="blog\.html"', 'href="/blog.html"', content)
    content = re.sub(r'src="assets/', 'src="/assets/', content)
    content = re.sub(r'data-en="assets/', 'data-en="/assets/', content)
    content = re.sub(r'data-es="assets/', 'data-es="/assets/', content)
    
    # Replace hardcoded store URLs with site variables
    content = re.sub(
        r'href="https://apps\.apple\.com/us/app/us-citizenship-test-2026-uscis/id6451455299"',
        'href="{{ site.app_store_url }}"',
        content
    )
    content = re.sub(
        r'href="https://play\.google\.com/store/apps/details\?id=com\.citizenryapp\.citizenryandroid"',
        'href="{{ site.play_store_url }}"',
        content
    )
    
    front_matter = f"""---
layout: blog-list
title: US Citizenship Test Guide & Tips - Page {page_num} - Citizenry Blog
description: Expert tips and guides for passing your US citizenship test. Page {page_num} of our citizenship test preparation articles.
---

"""
    
    new_content = front_matter + content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Converted: {filepath}")

def main():
    base_dir = Path(__file__).parent.parent
    
    # Convert blog articles
    blog_dir = base_dir / "blog"
    for filepath in blog_dir.glob("*.html"):
        convert_blog_article(filepath)
    
    # Convert pagination pages
    for i in range(2, 8):
        filepath = base_dir / f"blog-page-{i}.html"
        if filepath.exists():
            convert_blog_pagination(filepath)
    
    print("\nConversion complete!")
    print("Note: You may need to manually review and fix some converted files.")

if __name__ == "__main__":
    main()
