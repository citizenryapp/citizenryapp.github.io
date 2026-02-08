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
2. **English only in drafts.** Generate English-only Markdown in `blog-drafts/`. Spanish translations are created as companion `.es.md` files when the user is ready to build (see Build step below).
3. **Match existing style exactly.** Read `references/blog-style-guide.md` for tone, structure, length, and formatting rules.
4. **Related Articles is always LAST.** Every article must end with a Related Articles section (2-4 internal links) defined in the front matter `related:` list. Do NOT add a manual Citizenry CTA section; the blog-post layout automatically appends a "Ready to Start Practicing?" CTA box with app store badges.
5. **Guide the reader to use Citizenry at the end.** Before the Related Articles section, include a brief closing (1-3 sentences) that naturally guides the reader to use Citizenry to prepare (e.g. practicing with mock interviews, studying with the app, or downloading Citizenry). Keep it helpful and on-topic; the layout’s CTA box will follow, so the article copy should set that up.
6. **Do not use em-dashes.** Use commas, parentheses, or short sentences instead of em-dashes (—) in article content.
7. **Surface 2008 vs 2025 differences.** Always read both official USCIS civics test Q&A documents (listed below). When the topic relates to civics test content, compare how the information differs between the 2008 (100 questions) and 2025 (128 questions) versions and mention relevant differences in the article.

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
- YAML front matter (`title`, `description`, `keywords`, `date`, `llms_section`, `llms_desc`, `related`)
- Opening paragraph (plain text)
- 5-8 sections with `## Heading` headings
- Lists where appropriate (`-` for unordered, `1.` for ordered)
- When topic relates to civics content, mention how questions or rules differ between 2008 and 2025 test versions
- **Closing that guides to Citizenry:** Before Related Articles, add 1-3 sentences that naturally point the reader to using Citizenry (e.g. mock interviews, study tools, or the app) to prepare. Do not add a full CTA block; the layout adds the CTA box after the article.
- `related:` front matter list with 2-4 internal links (slug + title for each)
- Today's date for the `date` field

### 4. Tell the User to Review

After generating the Markdown draft(s), tell the user:
> Your Markdown draft(s) are ready in `blog-drafts/`. Review and edit them, then let me know when you're ready to build.

The user can open the `.md` file in any text editor, tweak wording, add/remove sections, etc. This is the primary advantage of the Markdown workflow.

### 5. Build HTML from Markdown (Including Spanish)

When the user is ready to build:

1. **Create Spanish translation(s)** for each article being built. For each `blog-drafts/{slug}.md`:
   - Create `blog-drafts/{slug}.es.md` with the same block structure as the English file (same headings, paragraphs, and list items in the same order).
   - Include only `title_es` in the front matter and the translated body. See `references/blog-style-guide.md` for the Spanish translation file format.
   - The build script pairs blocks by position and outputs bilingual `data-en`/`data-es` HTML.
2. **Run the build script** with `--integrate`:

```bash
node scripts/build-blog-article.js blog-drafts/{slug}.md --integrate
```

The `--integrate` flag also updates `blog-articles.json`, `sitemap.xml`, and `llms.txt`. Omit `--integrate` when rebuilding existing articles that are already integrated.

For multiple articles, create each `.es.md` first, then:

```bash
node scripts/build-blog-article.js blog-drafts/article-1.md blog-drafts/article-2.md --integrate
```

### 6. Regenerate Blog Pages

After ALL articles are built and integrated, run once:

```bash
node scripts/rotate-blog.js
```

## Bundled Resources

- **`references/blog-style-guide.md`** -- Read before writing any article. Contains tone, structure, length, Markdown format, Spanish translation format, related articles format, SEO rules, and annotated examples.
- **`references/site-integration.md`** -- Read when updating supporting files. Documents exact formats for blog-articles.json, sitemap.xml, llms.txt entries, and the build script.
- **`assets/blog-article-template.md`** -- Markdown template showing the front matter and content structure. Use as a starting point.
- **`scripts/add-blog-article.sh`** -- Executed automatically by the build script with `--integrate`. Can also be run manually. Requires `jq`.
