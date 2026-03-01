---
name: Generate Blog Articles
description: >
  Generate SEO-optimized blog articles for the Citizenry website about US citizenship,
  naturalization, and the USCIS process. This skill should be used when the user asks to
  "create blog articles", "write new blog posts", "generate SEO content", "add blog articles
  about [topic]", "write articles for these search terms", "create content for these keywords",
  or provides a list of topics, search queries, or keyword phrases for new blog content.
  Handles factual research from official sources (USCIS.gov), Markdown draft generation,
  build-to-HTML conversion with bilingual support, Jekyll front matter, internal linking
  via Related Articles sections, and full site integration (blog-articles.json, sitemap.xml,
  llms.txt, blog list page rotation).
---

# Generate Blog Articles

Generate blog articles for the Citizenry website (`citizenryapp.com`), a US citizenship test preparation app. Each article targets specific search queries to improve SEO and LLM discoverability.

Articles are authored as **Markdown files** in `blog-drafts/` and compiled to bilingual HTML in `blog/` using the build script. This lets the user easily review and edit content before final HTML generation.

## Critical Rules

1. **Never fabricate information.** Every claim must be verifiable via official sources, existing blog articles, or the USCIS civics test question banks. Use web search to research each topic before writing.
2. **English only in drafts.** Generate English-only Markdown in `blog-drafts/`. Spanish companion files (`.es.md`) are created or updated as part of the build step, from the current English draft (see step 5).
3. **Match existing style exactly.** Read `references/blog-style-guide.md` for tone, structure, length, and formatting rules.
4. **Related Articles is always LAST.** Every article must end with a Related Articles section (2-4 internal links) defined in the front matter `related:` list. Do NOT add a manual Citizenry CTA section; the blog-post layout automatically appends a "Ready to Start Practicing?" CTA box with app store badges.
5. **Guide the reader to use Citizenry at the end.** Before the Related Articles section, include a brief closing (1-3 sentences) that naturally guides the reader to use Citizenry to prepare (e.g. practicing with mock interviews, studying with the app, or downloading Citizenry). Keep it helpful and on-topic; the layout’s CTA box will follow, so the article copy should set that up.
6. **Do not use em-dashes.** Use commas, parentheses, or short sentences instead of em-dashes (—) in article content.
7. **Surface 2008 vs 2025 differences.** Always read both official USCIS civics test Q&A documents (listed below). When the topic relates to civics test content, compare how the information differs between the 2008 (100 questions) and 2025 (128 questions) versions and mention relevant differences in the article.
8. **Optimize for AI search engines.** Every article must follow the AI SEO patterns described in `references/blog-style-guide.md` under "AI Search Engine Optimization." This includes: direct-answer meta descriptions, answer-first opening paragraphs, USCIS source citations, self-contained answer blocks, and FAQ schema.

## Authoritative Sources

### Official USCIS Civics Test Questions

These official question-and-answer documents may be directly referenced and quoted in blog content:

- **2008 civics test (100 questions):** https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf
- **2025 civics test (128 questions):** https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf

Always read both documents when writing an article. Compare how questions, accepted answers, and test rules differ between the two versions. When the article topic touches on civics content, explicitly mention any differences (e.g., "The 2008 test asks you to name three of the 13 original states, while the 2025 test asks for five").

### Other Official Sources

- `uscis.gov` (primary authority for all naturalization and immigration topics)
- `state.gov`, `travel.state.gov` (passport and travel topics)
- Other official `.gov` sites

### Existing Blog Articles

Read existing Markdown drafts in `blog-drafts/` or HTML articles in `blog/` for information already published on the site. This helps maintain consistency and avoids contradictions. Do not copy content verbatim; rephrase for the new article's focus.

## Workflow

For each topic/search phrase provided by the user:

### 1. Research

Search the web for factual information using the authoritative sources listed above. Also read relevant existing articles in `blog-drafts/` or `blog/` to understand what has already been covered and maintain consistency. Always read both the 2008 and 2025 USCIS civics test Q&A documents to identify how the topic is covered in each version and note any differences. Gather specific facts: requirements, fees, timelines, procedures, form numbers, and official Q&A content. Do not proceed if authoritative information cannot be found.

### 2. Plan the Article

Determine from the research:
- **Title**: Mirror the search phrasing people use (check the user's provided phrases)
- **Slug**: Kebab-case filename (e.g., `most-missed-citizenship-test-questions`)
- **Keywords**: 3-6 comma-separated search phrases
- **Sections**: 5-8 `## Heading` sections covering the topic
- **Related Articles**: 2-4 existing articles from `blog-articles.json` that are topically related

### 3. Generate the Markdown Draft

Read the template at `assets/blog-article-template.md` for the structural pattern. Read `references/blog-style-guide.md` for detailed formatting rules.

Write the article Markdown file to `blog-drafts/{slug}.md` with:
- YAML front matter (`title`, `description`, `keywords`, `date`, `llms_section`, `llms_desc`, `faq_schema`, `related`)
- Opening paragraph (plain text)
- 5-8 sections with `## Heading` headings
- Inline links using Markdown syntax `[link text](url)` (e.g. to Compare pages or other site URLs); the build script converts these to HTML links
- Lists where appropriate (`-` for unordered, `1.` for ordered)
- **Tables:** Use Markdown pipe tables when you need a comparison table (e.g. 2008 vs 2025 vs 65/20). See **Markdown Tables** below for syntax and Spanish pairing rules.
- When topic relates to civics content, mention how questions or rules differ between 2008 and 2025 test versions
- **Closing that guides to Citizenry:** Before Related Articles, add 1-3 sentences that naturally point the reader to using Citizenry (e.g. mock interviews, study tools, or the app) to prepare. Do not add a full CTA block; the layout adds the CTA box after the article.
- `related:` front matter list with 2-4 internal links (slug + title for each)
- Today's date for the `date` field

### 4. Tell the User to Review

After generating the Markdown draft(s), tell the user:
> Your Markdown draft(s) are ready in `blog-drafts/`. Review and edit them, then let me know when you're ready to build.

The user can open the `.md` file in any text editor, tweak wording, add/remove sections, etc. When they say they are ready to build, **always** read the current English draft, create or update the Spanish file to match it, then run the build script. Do not wait for the user to ask separately for the Spanish file; it is part of the build step.

### 5. Build HTML from Markdown (Always Include Spanish)

When the user is ready to build, the build step **always** includes creating or updating the Spanish companion file; the user does not need to ask for it separately.

For each article being built:

1. **Read the current English draft** at `blog-drafts/{slug}.md`. Use this version as the source of truth, since the user may have edited it after the initial draft.
2. **Create or update the Spanish companion file** `blog-drafts/{slug}.es.md` so that it matches the **current** English file:
   - Same block structure (same headings, paragraphs, list items, and tables in the same order). If the user added, removed, or reordered sections, the Spanish file must reflect that.
   - Include only `title_es` in the front matter and the translated body. See `references/blog-style-guide.md` for the Spanish translation file format.
   - The build script pairs blocks by position, so the Spanish file must have the same number and types of blocks as the English file. For tables, use the same number of columns and data rows with translated cell text (see **Markdown Tables** below).
3. **Run the build script** with `--integrate`:

```bash
node scripts/build-blog-article.js blog-drafts/{slug}.md --integrate
```

The build script outputs bilingual HTML with `data-en`/`data-es` attributes. The `--integrate` flag also updates `blog-articles.json`, `sitemap.xml`, and `llms.txt`. Omit `--integrate` when rebuilding existing articles that are already integrated.

For multiple articles: for each article, read the current English draft, create or update the corresponding `.es.md` to match, then run the build once with all files:

```bash
node scripts/build-blog-article.js blog-drafts/article-1.md blog-drafts/article-2.md --integrate
```

### 6. Regenerate Blog Pages

After ALL articles are built and integrated, run once:

```bash
node scripts/rotate-blog.js
```

### 7. Update SEO and LLM Discovery Files

Ensure the following files are updated so search engines and LLMs can discover new content:

- **sitemap.xml** — Updated automatically when you run the build script with `--integrate`. Contains all blog article URLs. If you built with `--integrate`, new article URLs are already added; otherwise run the build with `--integrate` for new articles.
- **llms.txt** — Updated automatically when you run the build script with `--integrate`. Contains blog article titles and descriptions for LLM discovery, grouped by section. Verify the new article appears under the correct section (e.g. "Test Preparation") if needed.
- **robots.txt** — Ensure it references the sitemap (e.g. `Sitemap: https://citizenryapp.com/sitemap.xml`) so crawlers can find the updated sitemap. This file usually does not need changes when adding individual articles; it points to the sitemap, which is updated by the build. If the project maintains a custom robots.txt that lists specific paths, update it when adding new content types or rules.

After building new articles with `--integrate`, sitemap.xml and llms.txt are already updated. Run `node scripts/rotate-blog.js` (step 6), then confirm sitemap.xml and llms.txt contain the new entries and that robots.txt still points to the sitemap.

### 8. List Production URLs and How to Request Indexing in Google Search Console

After all build steps are complete, list the full production URLs for every article that was created and built in the current chat session. Use the production base URL `https://citizenryapp.com`. Format each URL as:

`https://citizenryapp.com/blog/{slug}.html`

where `{slug}` is the article filename without the `.md` or `.html` extension (e.g. `best-way-to-study-for-citizenship-test`). Provide the list in your reply, one URL per line, so the user can copy, share, or verify the live URLs. Only include articles that were actually built in this session, not previously existing articles.

Then add friendly instructions for requesting indexing in Google Search Console. Tell the user that after they have pushed their code to production and verified that the new blog articles are live on the public site, they can ask Google to index these URLs:

- Go to [Google Search Console](https://search.google.com/search-console) and select the property for the site (e.g. citizenryapp.com).
- Use **URL Inspection** (the search or input at the top): paste one of the article URLs and press Enter.
- If the URL is not yet indexed, click **Request Indexing**. Repeat for each new article URL.

The agent cannot submit indexing requests on the user's behalf; that must be done by the user in their own Search Console account. The list of URLs from this step is intended to be used for that purpose once the user has deployed and verified the articles are live.

## Markdown Tables

The build script (`scripts/build-blog-article.js`) parses **Markdown pipe tables** and converts them to HTML so they render correctly in the browser (rather than as raw pipe text).

### Syntax in the draft

- Use consecutive lines that **start with `|`**. Each line is a row; cells are separated by `|`.
- **First row** is the header row (column titles).
- **Optional separator row:** A row whose cells look like `---` or `:---:` is treated as a separator and omitted from the output. Include it after the header if you prefer (e.g. `| --- | --- | --- |`).
- **Following rows** are data rows. Every row must have the same number of cells as the header.

Example:

```markdown
| Feature | 2008 Version | 2025 Version | Senior (65/20) |
| --- | --- | --- | --- |
| Questions to study | 100 questions | 128 questions | 20 only |
| Passing score | 6 of 10 | 12 of 20 | 6 of 10 |
```

### What the build script does

- Detects a run of lines whose trimmed form starts with `|`.
- Parses each row by splitting on `|` and trimming cells (leading/trailing empty cells from the line are dropped).
- Skips one separator row after the header if it matches a dash-only pattern (e.g. `---` or `:---:`).
- Outputs `<table class="comparison-table">` with `<thead>` and `<tbody>`, and `<th>` / `<td>` elements. Site CSS (e.g. in `css/blog.css`) styles `.post-content table` and `.comparison-table`.
- Each header and cell is output with **bilingual attributes:** `data-en` (from the English draft) and `data-es` (from the Spanish draft), so the language switcher can show the table in either language.

### Spanish companion file

- The Spanish file (`blog-drafts/{slug}.es.md`) must contain a **table with the same structure** as the English table: same number of columns and same number of data rows.
- The build script pairs blocks by position. Tables are treated as a single block; the script matches the English table block to the Spanish table block and maps cells by position to fill `data-es` for each `<th>` and `<td>`.
- Put the translated header and cell text in the Spanish table. Do not change the number of rows or columns.

## Bundled Resources

- **`references/blog-style-guide.md`** -- Read before writing any article. Contains tone, structure, length, Markdown format, Spanish translation format, related articles format, SEO rules, and annotated examples.
- **`references/site-integration.md`** -- Read when updating supporting files. Documents exact formats for blog-articles.json, sitemap.xml, llms.txt entries, and the build script.
- **`assets/blog-article-template.md`** -- Markdown template showing the front matter and content structure. Use as a starting point.
- **`scripts/add-blog-article.sh`** -- Executed automatically by the build script with `--integrate`. Can also be run manually. Requires `jq`.
