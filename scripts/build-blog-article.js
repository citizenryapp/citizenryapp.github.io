#!/usr/bin/env node
/**
 * Build Blog Article
 *
 * Converts Markdown draft files in blog-drafts/ to bilingual HTML files in blog/.
 * Optionally merges Spanish translations from a companion .es.md file.
 *
 * Usage:
 *   node scripts/build-blog-article.js blog-drafts/my-article.md
 *   node scripts/build-blog-article.js blog-drafts/*.md
 *   node scripts/build-blog-article.js blog-drafts/*.md --integrate
 *
 * Options:
 *   --integrate   Also run add-blog-article.sh to update blog-articles.json,
 *                 sitemap.xml, and llms.txt (skipped by default for rebuilds)
 *
 * Spanish translations:
 *   Place a file named {slug}.es.md alongside the English .md file.
 *   It must have the same block structure (same headings, paragraphs, lists in
 *   the same order). The build script pairs blocks by position.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Markdown parser — turns a .md string into an ordered list of blocks
// ---------------------------------------------------------------------------

function parseFrontMatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const rawMeta = match[1];
  const body = match[2];
  const meta = {};

  // Parse simple YAML (key: value, key: "value", and related: list)
  let currentKey = null;
  let listItems = [];

  for (const line of rawMeta.split('\n')) {
    // List item: "  - something"
    const listItemMatch = line.match(/^\s+-\s+(.*)/);
    if (listItemMatch && currentKey) {
      listItems.push(listItemMatch[1].trim());
      continue;
    }

    // Multi-line list item: "    key: value" (indented, no leading "-") appends to last item
    if (currentKey && listItems.length > 0 && line.match(/^\s{2,}\S/) && !line.match(/^\s+-\s+/)) {
      listItems[listItems.length - 1] += ' ' + line.trim();
      continue;
    }

    // Flush previous list if we had one
    if (currentKey && listItems.length > 0) {
      meta[currentKey] = listItems;
      listItems = [];
      currentKey = null;
    }

    // Key: value
    const kvMatch = line.match(/^(\w[\w_]*)\s*:\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      if (value === '' || value === '|' || value === '>') {
        // This might be a list or multiline — track the key
        currentKey = key;
        listItems = [];
        continue;
      }

      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      meta[key] = value;
      currentKey = null;
    }
  }

  // Flush trailing list
  if (currentKey && listItems.length > 0) {
    meta[currentKey] = listItems;
  }

  return { meta, body };
}

/**
 * Parse related articles from front matter list items.
 * Each item is a YAML-like string: slug: foo  title: "Bar"
 * Or two consecutive lines: - slug: foo \n   title: "Bar"
 */
function parseRelated(rawRelated) {
  if (!rawRelated || !Array.isArray(rawRelated)) return [];

  const articles = [];
  let current = {};

  for (const item of rawRelated) {
    const slugMatch = item.match(/slug:\s*["']?([^"'\s,]+)["']?/);
    // Match title with consistent quote type (don't let apostrophes close double quotes)
    const titleMatch = item.match(/title:\s*"([^"]+)"/) || item.match(/title:\s*'([^']+)'/);

    if (slugMatch) current.slug = slugMatch[1];
    if (titleMatch) current.title = titleMatch[1];

    // If we have both slug and title, push and reset
    if (current.slug && current.title) {
      articles.push({ ...current });
      current = {};
    }
  }

  return articles;
}

/**
 * Parse Markdown body into ordered blocks.
 * Block types: intro_p, h2, h3, p, ul_start, ol_start, li, ul_end, ol_end
 */
function parseMarkdownBlocks(body) {
  const lines = body.split('\n');
  const blocks = [];
  let seenHeading = false;
  let inList = false;
  let listType = null; // 'ul' or 'ol'
  let pendingParagraph = [];

  function flushParagraph() {
    if (pendingParagraph.length === 0) return;
    const text = pendingParagraph.join(' ').trim();
    if (text) {
      blocks.push({ type: seenHeading ? 'p' : 'intro_p', text });
    }
    pendingParagraph = [];
  }

  function closeList() {
    if (inList) {
      blocks.push({ type: listType === 'ol' ? 'ol_end' : 'ul_end' });
      inList = false;
      listType = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // H2
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flushParagraph();
      closeList();
      seenHeading = true;
      blocks.push({ type: 'h2', text: line.replace(/^## /, '').trim() });
      continue;
    }

    // H3
    if (line.startsWith('### ')) {
      flushParagraph();
      closeList();
      seenHeading = true;
      blocks.push({ type: 'h3', text: line.replace(/^### /, '').trim() });
      continue;
    }

    // Unordered list item
    if (line.match(/^- /)) {
      flushParagraph();
      if (!inList || listType !== 'ul') {
        closeList();
        blocks.push({ type: 'ul_start' });
        inList = true;
        listType = 'ul';
      }
      blocks.push({ type: 'li', text: line.replace(/^- /, '').trim() });
      continue;
    }

    // Ordered list item
    if (line.match(/^\d+\.\s/)) {
      flushParagraph();
      if (!inList || listType !== 'ol') {
        closeList();
        blocks.push({ type: 'ol_start' });
        inList = true;
        listType = 'ol';
      }
      blocks.push({ type: 'li', text: line.replace(/^\d+\.\s/, '').trim() });
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      flushParagraph();
      if (inList) closeList();
      continue;
    }

    // Regular text line — accumulate into paragraph
    pendingParagraph.push(line.trim());
  }

  flushParagraph();
  closeList();

  return blocks;
}

// ---------------------------------------------------------------------------
// HTML generation
// ---------------------------------------------------------------------------

const INDENT = '                    '; // 20 spaces
const LI_INDENT = '                        '; // 24 spaces

/**
 * Process inline Markdown formatting:
 *   **text**  → <strong>text</strong>
 *   *text*    → <em>text</em>
 *   <br>      → passed through as-is (works in both inner HTML and data attributes)
 */
function processInline(text) {
  // Bold: **text** → <strong>text</strong>  (process before italic)
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text* → <em>text</em>
  text = text.replace(/(?<!\w)\*(.+?)\*(?!\w)/g, '<em>$1</em>');
  return text;
}

function escapeAttr(text) {
  return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function generateHTML(meta, enBlocks, esBlocks) {
  const date = meta.date || new Date().toISOString().slice(0, 10);
  const titleEs = (esBlocks && esBlocks._meta && esBlocks._meta.title_es) || '';

  // Build front matter
  let html = '---\n';
  html += `layout: blog-post\n`;
  html += `title: "${meta.title}"\n`;
  html += `title_es: "${titleEs}"\n`;
  html += `description: "${meta.description || ''}"\n`;
  html += `keywords: "${meta.keywords || ''}"\n`;
  html += `date: ${date}\n`;
  html += '---\n\n';

  // Pair English and Spanish blocks by position (matching translatable blocks only)
  const enTranslatable = enBlocks.filter(b =>
    ['intro_p', 'h2', 'h3', 'p', 'li'].includes(b.type)
  );
  const esTranslatable = esBlocks ? esBlocks.blocks.filter(b =>
    ['intro_p', 'h2', 'h3', 'p', 'li'].includes(b.type)
  ) : [];

  // Build a map from English block index to Spanish text
  const esMap = {};
  for (let i = 0; i < enTranslatable.length; i++) {
    if (i < esTranslatable.length && esTranslatable[i].text) {
      esMap[i] = esTranslatable[i].text;
    }
  }

  let transIdx = 0;

  for (const block of enBlocks) {
    const isTranslatable = ['intro_p', 'h2', 'h3', 'p', 'li'].includes(block.type);
    const rawEsText = isTranslatable ? (esMap[transIdx] || '') : '';

    // Apply inline Markdown formatting (bold, italic, <br>)
    const enText = isTranslatable ? processInline(block.text) : block.text;
    const esText = rawEsText ? processInline(rawEsText) : rawEsText;

    switch (block.type) {
      case 'intro_p':
        html += `<p data-en="${escapeAttr(enText)}" data-es="${escapeAttr(esText)}">${enText}</p>\n`;
        transIdx++;
        break;

      case 'h2':
        html += `${INDENT}\n${INDENT}<h2 data-en="${escapeAttr(enText)}" data-es="${escapeAttr(esText)}">${enText}</h2>\n`;
        transIdx++;
        break;

      case 'h3':
        html += `${INDENT}<h3 data-en="${escapeAttr(enText)}" data-es="${escapeAttr(esText)}">${enText}</h3>\n`;
        transIdx++;
        break;

      case 'p':
        html += `${INDENT}<p data-en="${escapeAttr(enText)}" data-es="${escapeAttr(esText)}">${enText}</p>\n`;
        transIdx++;
        break;

      case 'ul_start':
        html += `${INDENT}<ul>\n`;
        break;

      case 'ol_start':
        html += `${INDENT}<ol>\n`;
        break;

      case 'li':
        html += `${LI_INDENT}<li data-en="${escapeAttr(enText)}" data-es="${escapeAttr(esText)}">${enText}</li>\n`;
        transIdx++;
        break;

      case 'ul_end':
        html += `${INDENT}</ul>\n`;
        break;

      case 'ol_end':
        html += `${INDENT}</ol>\n`;
        break;
    }
  }

  // Related Articles section
  const related = parseRelated(meta.related);
  if (related.length > 0) {
    html += `${INDENT}\n${INDENT}<h2 data-en="Related Articles" data-es="">Related Articles</h2>\n`;
    html += `${INDENT}<ul>\n`;
    for (const article of related) {
      html += `${LI_INDENT}<li><a href="/blog/${article.slug}.html">${article.title}</a></li>\n`;
    }
    html += `${INDENT}</ul>`;
  }

  return html;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function buildArticle(mdPath, integrate) {
  const fullPath = path.resolve(mdPath);
  const slug = path.basename(fullPath, '.md');
  const dir = path.dirname(fullPath);

  // Read English source
  const enContent = fs.readFileSync(fullPath, 'utf8');
  const { meta, body } = parseFrontMatter(enContent);
  const enBlocks = parseMarkdownBlocks(body);

  // Read optional Spanish translation
  const esPath = path.join(dir, `${slug}.es.md`);
  let esData = null;
  if (fs.existsSync(esPath)) {
    const esContent = fs.readFileSync(esPath, 'utf8');
    const { meta: esMeta, body: esBody } = parseFrontMatter(esContent);
    const esBlocksList = parseMarkdownBlocks(esBody);
    esData = { _meta: esMeta, blocks: esBlocksList };
    console.log(`  Found Spanish translation: ${esPath}`);
  }

  // Generate HTML
  const html = generateHTML(meta, enBlocks, esData);

  // Write to blog/
  const repoRoot = path.join(__dirname, '..');
  const outputPath = path.join(repoRoot, 'blog', `${slug}.html`);
  fs.writeFileSync(outputPath, html);
  console.log(`  Generated: blog/${slug}.html`);

  // Run integration script if requested
  if (integrate) {
    const { execSync } = require('child_process');
    const scriptPath = path.join(repoRoot, 'skills', 'generate-blog-articles', 'scripts', 'add-blog-article.sh');

    // Build excerpt from first paragraph
    const firstP = enBlocks.find(b => b.type === 'intro_p' || b.type === 'p');
    const excerptEn = firstP ? firstP.text.slice(0, 200) : meta.description || '';
    const titleEs = (esData && esData._meta && esData._meta.title_es) || '';
    const firstEsP = esData ? esData.blocks.find(b => b.type === 'intro_p' || b.type === 'p') : null;
    const excerptEs = firstEsP ? firstEsP.text.slice(0, 200) : '';

    try {
      execSync([
        scriptPath,
        '--slug', slug,
        '--title-en', meta.title,
        '--title-es', titleEs,
        '--excerpt-en', excerptEn,
        '--excerpt-es', excerptEs,
        '--llms-section', meta.llms_section || 'Test Preparation',
        '--llms-desc', meta.llms_desc || meta.description || ''
      ].map(a => `"${a.replace(/"/g, '\\"')}"`).join(' '), {
        cwd: repoRoot,
        stdio: 'inherit',
        shell: true
      });
    } catch (e) {
      console.error(`  Warning: Integration script failed for ${slug}`);
    }
  }

  return slug;
}

function main() {
  const args = process.argv.slice(2);
  const integrate = args.includes('--integrate');
  const files = args.filter(a => !a.startsWith('--') && a.endsWith('.md'));

  if (files.length === 0) {
    console.log('Usage: node scripts/build-blog-article.js <file.md> [file2.md ...] [--integrate]');
    console.log('');
    console.log('Options:');
    console.log('  --integrate   Also update blog-articles.json, sitemap.xml, and llms.txt');
    console.log('');
    console.log('Spanish translations:');
    console.log('  Place {slug}.es.md alongside the English .md file with the same structure.');
    process.exit(1);
  }

  console.log('Building blog articles...\n');

  const slugs = [];
  for (const file of files) {
    console.log(`Processing: ${file}`);
    slugs.push(buildArticle(file, integrate));
  }

  console.log(`\nDone! Built ${slugs.length} article(s).`);
  if (!integrate) {
    console.log('Tip: Use --integrate to also update blog-articles.json, sitemap.xml, and llms.txt.');
  }
  console.log('Remember to run: node scripts/rotate-blog.js');
}

main();
