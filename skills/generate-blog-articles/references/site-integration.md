# Site Integration Guide

After generating a Markdown draft in `blog-drafts/`, use the build script to compile it to HTML and integrate with the site.

## 0. Build HTML from Markdown

Convert Markdown drafts to bilingual HTML:

```bash
# Build one article (no site integration — good for rebuilds)
node scripts/build-blog-article.js blog-drafts/my-article.md

# Build and integrate (updates blog-articles.json, sitemap.xml, llms.txt)
node scripts/build-blog-article.js blog-drafts/my-article.md --integrate

# Build multiple articles at once
node scripts/build-blog-article.js blog-drafts/article-1.md blog-drafts/article-2.md --integrate
```

The build script:
- Reads `blog-drafts/{slug}.md` (English Markdown)
- If `blog-drafts/{slug}.es.md` exists, merges Spanish translations
- Generates `blog/{slug}.html` with bilingual `data-en`/`data-es` attributes
- With `--integrate`: also runs `add-blog-article.sh` to update supporting files

Use `--integrate` for new articles. Omit it when rebuilding existing articles that are already in blog-articles.json, sitemap.xml, and llms.txt.

The following sections document what the integration script does (for reference).

## 1. blog-articles.json

Add a new entry to the `articles` array. Insert at position 1 (after the featured article at index 0).

### Entry Format

```json
{
  "id": "kebab-case-slug",
  "file": "blog/kebab-case-slug.html",
  "title_en": "Full English Title",
  "title_es": "Full Spanish Title",
  "excerpt_en": "1-2 sentence English excerpt for blog listing cards. Should entice the reader to click.",
  "excerpt_es": "1-2 sentence Spanish excerpt matching the English."
}
```

### Rules

- `id` matches the filename without extension
- `file` is the relative path from repository root
- `excerpt_en` / `excerpt_es` are shorter than `description`; optimized for card display
- Do NOT add `featured: true` unless explicitly requested
- Insert new articles near the top of the array (after any featured article)

## 2. sitemap.xml

Add a `<url>` block in the `<!-- Blog Articles -->` section, maintaining alphabetical order by filename.

### Entry Format

```xml
  <url>
    <loc>https://citizenryapp.com/blog/kebab-case-slug.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
```

### Rules

- Use `monthly` changefreq and `0.7` priority (matching existing articles)
- Maintain alphabetical order within the Blog Articles section
- Full URL with `https://citizenryapp.com` prefix

## 3. llms.txt

Add a markdown link in the appropriate category section.

### Available Sections

- `## Blog Articles - Test Preparation` -- study tips, test strategies, practice advice
- `## Blog Articles - Eligibility & Requirements` -- requirements, rules, exceptions
- `## Blog Articles - Application Process` -- how to apply, fees, timelines, status
- `## Blog Articles - Special Situations` -- denials, special cases, edge cases
- `## Blog Articles - After the Test` -- post-test steps, oath ceremony, next steps

### Entry Format

```markdown
- [Full English Title](https://citizenryapp.com/blog/kebab-case-slug.html): Brief description of what the article covers
```

### Rules

- Place in the most relevant section
- Description after the colon should be concise (under 100 characters)
- Match the style of existing entries in that section

## 4. Run Rotation Script

After all articles are added to the three files above, run:

```bash
node scripts/rotate-blog.js
```

This script:
- Rotates article order in `blog-articles.json`
- Recalculates dates for all articles
- Regenerates `blog.html` and all `blog-page-N.html` files
- Updates date front matter in individual article files

Run this ONCE after all new articles are added (not once per article).
