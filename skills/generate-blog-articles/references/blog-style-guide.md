# Blog Style Guide

## Writing Tone and Voice

- Second-person ("you", "your") throughout article content
- Informative, approachable, and direct
- Empathetic toward applicants navigating a complex process
- Confident and reassuring without being patronizing
- No jargon without explanation; define USCIS terms on first use

## Article Structure

Every article follows this exact pattern:

1. **Opening paragraph**: 1-2 sentences summarizing what the article covers and why it matters. Sets expectations.
2. **5-8 body sections** (`## Heading` + content): Each section covers one subtopic. Use paragraphs for explanations, `- ` or `1. ` for lists. Use `### Subheading` sparingly for subsections within a `## Heading`.
3. **Related Articles**: Defined in front matter `related:` list (2-4 internal links). The build script renders this as the LAST section in the HTML.

The blog-post layout (`_layouts/blog-post.html`) automatically appends a "Ready to Start Practicing?" CTA box with app store download badges after the article content. Do NOT add a manual Citizenry CTA section—the layout handles it.

## Content Length

- Target 300-600 words per article
- Concise and scannable; avoid walls of text
- Prefer bullet lists for 3+ related points
- Each paragraph should be 2-4 sentences maximum

## Using Existing Blog Content

Existing Markdown drafts in `blog-drafts/` and HTML articles in `blog/` are valid information sources. Read related articles to:
- Maintain consistency in how topics are explained across the blog
- Reference specific facts or details already covered in other articles
- Avoid contradicting information stated elsewhere on the site
- Identify which existing articles to link in the Related Articles section

Do NOT copy content verbatim from existing articles. Rephrase and tailor the information to the new article's specific focus.

## Markdown Draft Format

Articles are authored as Markdown files in `blog-drafts/`. The build script (`scripts/build-blog-article.js`) converts them to bilingual HTML in `blog/`.

### Front Matter

```yaml
---
title: "Title That Mirrors Search Phrasing"
description: "1-2 sentence description using primary keywords naturally"
keywords: "keyword phrase 1, keyword phrase 2, keyword phrase 3, keyword phrase 4"
date: YYYY-MM-DD
llms_section: "Test Preparation"
llms_desc: "Brief description for llms.txt"
related:
  - slug: some-article-slug  title: "Full English Title of Related Article"
  - slug: another-slug  title: "Another Related Article Title"
---
```

- **title**: Use the exact phrasing people search for (e.g., "How to Pass the US Citizenship Test" not "Passing Your Citizenship Exam")
- **description**: Natural sentence(s) incorporating primary keywords; 120-160 characters ideal
- **keywords**: 3-6 comma-separated search phrases people actually use
- **date**: Today's date in ISO format
- **llms_section**: Category for llms.txt. Values: `Test Preparation`, `Eligibility & Requirements`, `Application Process`, `Special Situations`, `After the Test`
- **llms_desc**: Brief description for llms.txt entry (under 100 characters)
- **related**: 2-4 related articles. Each item has `slug` (filename without extension) and `title` (English title in double quotes) on a single line

### Body Content

Plain Markdown:
- `## Heading` for section headings (5-8 per article)
- `### Subheading` for sub-sections (use sparingly)
- Regular paragraphs as plain text separated by blank lines
- `- Item` for unordered lists
- `1. Item` for ordered lists
- Blank lines between sections

### Example Markdown Draft

```markdown
---
title: "How to Pass the US Citizenship Test"
description: "Step-by-step tips on how to pass the citizenship test."
keywords: "how to pass citizenship test, citizenship test tips"
date: 2026-01-18
llms_section: "Test Preparation"
llms_desc: "Step-by-step tips on how to pass the US citizenship test"
related:
  - slug: n400-interview-preparation  title: "How to Prepare for the N-400 Interview"
  - slug: what-if-i-fail-citizenship-test  title: "What Happens If I Fail the Citizenship Test?"
  - slug: 128-civics-questions-2025  title: "128 Civics Questions and Answers: 2025 Test Guide"
---

Passing the US citizenship test is an achievable goal with the right preparation. Here are proven strategies and tips.

## Step 1: Start Early

Begin studying as soon as you submit your N-400 application. Most successful applicants study 15-30 minutes per day for 1-3 months.

## What You Need to Know

The test covers three areas:

- Civics (US government and history questions)
- English reading (you read a sentence aloud)
- English writing (you write a sentence from dictation)
```

## Spanish Translation File Format

After finalizing the English Markdown, Spanish translations are added via a companion file: `blog-drafts/{slug}.es.md`.

### Requirements

- **Same block structure**: The `.es.md` file MUST have the same number and types of blocks (paragraphs, headings, list items) in the same order as the English file
- **Front matter**: Only `title_es` is required in front matter
- **The build script pairs blocks by position**: The 1st paragraph in English pairs with the 1st paragraph in Spanish, the 1st `## Heading` pairs with the 1st `## Heading` in Spanish, etc.

### Example Spanish Translation File

```markdown
---
title_es: "Cómo Aprobar el Examen de Ciudadanía de EE.UU."
---

Aprobar el examen de ciudadanía de EE.UU. es una meta alcanzable con la preparación adecuada. Aquí hay estrategias comprobadas.

## Paso 1: Empiece Temprano

Comience a estudiar tan pronto como presente su solicitud N-400. La mayoría de los solicitantes exitosos estudian de 15 a 30 minutos al día durante 1 a 3 meses.

## Lo Que Necesita Saber

El examen cubre tres áreas:

- Educación cívica (preguntas sobre el gobierno e historia de EE.UU.)
- Lectura en inglés (lee una oración en voz alta)
- Escritura en inglés (escribe una oración de dictado)
```

### Building with Spanish

When a `.es.md` file exists alongside the English `.md` file, the build script automatically detects and merges it:

```bash
node scripts/build-blog-article.js blog-drafts/how-to-pass-citizenship-test.md
```

The output HTML will have populated `data-en` and `data-es` attributes. Without the `.es.md` file, all `data-es` attributes default to empty strings.

## Filename Convention

- Kebab-case derived from the title
- Example: "How to Pass the US Citizenship Test" becomes `how-to-pass-citizenship-test`
- Remove articles ("the", "a", "an") and prepositions when they don't add clarity
- Markdown drafts go in `blog-drafts/` with `.md` extension
- HTML output goes in `blog/` with `.html` extension (generated by build script)

## Related Articles

### Purpose

Internal links improve SEO by:
- Helping search engines discover and index related pages
- Distributing page authority across the site
- Keeping readers engaged with relevant content

### How to Find Related Articles

Read `blog-articles.json` to identify articles that share topics with the new article. Choose articles that a reader of the current article would naturally want to read next.

### Format in Markdown Front Matter

Use multi-line YAML so titles that contain colons (e.g. "2008 vs 2025 Civics Test: What's Different?") parse correctly:

```yaml
related:
  - slug: how-to-pass-citizenship-test
    title: "How to Pass the US Citizenship Test"
  - slug: what-if-i-fail-citizenship-test
    title: "What Happens If I Fail the Citizenship Test?"
  - slug: english-reading-writing-test-tips
    title: "English Reading and Writing Test Tips"
```

### Rules

- Include 2-4 links (3 is ideal)
- Put each entry on two lines: `slug:` then `title:` (indented). This avoids YAML errors when titles contain colons.
- `slug` is the article filename without `.html` extension
- `title` is the article's full English title in double quotes
- Choose articles that are topically related, not random
- The build script renders these as the LAST section in the HTML output

## Factual Integrity

- ALL claims must be verifiable on USCIS.gov, official US government sources, or existing blog articles on this site
- Never fabricate statistics, dates, fees, processing times, or requirements
- When citing specific numbers (fees, passing scores, question counts), verify via web search
- Use hedging language ("typically", "generally", "in most cases") when exact figures vary
- If information cannot be verified, do not include it

### Official USCIS Civics Test Q&A Documents

These official question-and-answer banks may be directly referenced and quoted in blog content:

- **2008 civics test (100 questions):** https://www.uscis.gov/sites/default/files/document/questions-and-answers/100q.pdf
- **2025 civics test (128 questions):** https://www.uscis.gov/sites/default/files/document/questions-and-answers/2025-Civics-Test-128-Questions-and-Answers.pdf

Always read both documents when writing an article. Use these to cite specific questions, list accepted answers, reference test format (oral, number of questions asked, passing score), and explain the 65/20 special consideration rules.

### Surfacing 2008 vs 2025 Differences

When the article topic relates to civics test content, always compare the 2008 and 2025 versions and mention relevant differences. Common differences to look for:

- Questions that exist in one version but not the other (e.g., documents that influenced the Constitution is only in the 2025 test)
- Questions that are worded differently between versions
- Questions with different accepted answers (e.g., 2025 adds "Inventor" as an accepted answer for Benjamin Franklin)
- Different numbers of answers required (e.g., "Name three original states" in 2008 vs "Name five" in 2025)
- Different test format (10 questions asked/6 to pass in 2008 vs 20 asked/12 to pass in 2025)
- Different 65/20 special consideration rules between versions
