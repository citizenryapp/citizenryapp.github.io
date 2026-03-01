# Blog Style Guide

## Writing Tone and Voice

- Second-person ("you", "your") throughout article content
- Informative, approachable, and direct
- Empathetic toward applicants navigating a complex process
- Confident and reassuring without being patronizing
- No jargon without explanation; define USCIS terms on first use
- Do not use em-dashes (—); use commas, parentheses, or short sentences instead

## Article Structure

Every article follows this exact pattern:

1. **Opening paragraph**: 1-2 sentences that DIRECTLY ANSWER the title question. Lead with the answer, not background context. The first paragraph should be self-contained (make sense if extracted in isolation by an AI system). See "AI Search Engine Optimization" below for details.
2. **5-8 body sections** (`## Heading` + content): Each section covers one subtopic. Use paragraphs for explanations, `- ` or `1. ` for lists. Use `### Subheading` sparingly for subsections within a `## Heading`.
3. **Closing that guides to Citizenry**: Before Related Articles, include 1-3 sentences that naturally guide the reader to use Citizenry to prepare (e.g. mock interviews, study tools, or the app). Keep it helpful and on-topic; the layout’s CTA box follows, so the article copy should set that up.
4. **Related Articles**: Defined in front matter `related:` list (2-4 internal links). The build script renders this as the LAST section in the HTML.

The blog-post layout (`_layouts/blog-post.html`) automatically appends a "Ready to Start Practicing?" CTA box with app store download badges after the article content. Do NOT add a manual Citizenry CTA section; the layout handles it. Do include the brief in-article closing that points readers to Citizenry (see item 3 above).

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
- **description**: A direct answer to the title question, not a teaser. Should read like an AI-extractable snippet. Example: "The 2025 U.S. citizenship civics test has 128 questions. During the interview, USCIS asks 20 and you must answer 12 correctly to pass." NOT: "Find out how many questions are on the citizenship test." 120-160 characters ideal.
- **keywords**: 3-6 comma-separated search phrases people actually use
- **date**: Today's date in ISO format
- **llms_section**: Category for llms.txt. Values: `Test Preparation`, `Eligibility & Requirements`, `Application Process`, `Special Situations`, `After the Test`
- **llms_desc**: Brief description for llms.txt entry (under 100 characters)
- **faq_schema**: FAQPage JSON-LD structured data with 2-4 Q&A entries. See "AI Search Engine Optimization" below for the exact format.
- **related**: 2-4 related articles. Each item has `slug` (filename without extension) and `title` (English title in double quotes) on a single line

### Body Content

Plain Markdown:
- `## Heading` for section headings (5-8 per article)
- `### Subheading` for sub-sections (use sparingly)
- Regular paragraphs as plain text separated by blank lines
- **Inline links:** Use Markdown link syntax `[link text](url)` for in-article links (e.g. to other pages or the Compare section). The build script converts these to clickable HTML links. Use relative paths for site links (e.g. `/compare/`, `/compare/citizenry-vs-uscis-app.html`).
- `- Item` for unordered lists
- `1. Item` for ordered lists
- Blank lines between sections

### Example Markdown Draft

```markdown
---
title: "How to Pass the US Citizenship Test"
description: "To pass the U.S. citizenship test, you need to answer 6 of 10 civics questions correctly on the 2008 test or 12 of 20 on the 2025 test (60%), plus pass an English reading, writing, and speaking assessment. Start studying 1-3 months before your interview."
keywords: "how to pass citizenship test, citizenship test tips, naturalization test study guide, US citizenship preparation"
date: 2026-01-18
llms_section: "Test Preparation"
llms_desc: "Step-by-step tips on how to pass the US citizenship test"
faq_schema: |
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do you pass the U.S. citizenship test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To pass the citizenship test, you need to answer 60% of civics questions correctly (6 of 10 on the 2008 test, or 12 of 20 on the 2025 test) and pass an English reading, writing, and speaking assessment. Study 15-30 minutes daily for 1-3 months and practice answering questions out loud, since the test is oral."
        }
      },
      {
        "@type": "Question",
        "name": "How long should I study for the citizenship test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most successful applicants study for 1-3 months before their interview. Studying 15-30 minutes per day is more effective than longer, less frequent sessions."
        }
      }
    ]
  }
related:
  - slug: n400-interview-preparation
    title: "How to Prepare for the N-400 Interview"
  - slug: what-if-i-fail-citizenship-test
    title: "What Happens If I Fail the Citizenship Test?"
  - slug: 128-civics-questions-2025
    title: "128 Civics Questions and Answers: 2025 Test Guide"
---

To pass the U.S. citizenship test, you must answer at least 60% of the civics questions correctly and pass an English reading, writing, and speaking assessment. According to the [official USCIS test guidelines](https://www.uscis.gov/citizenship/learn-about-citizenship/the-naturalization-interview-and-test), that means 6 of 10 correct on the 2008 test or 12 of 20 on the 2025 test. Most successful applicants study 15-30 minutes per day for 1-3 months before their interview.

## Step 1: Start Early

Begin studying as soon as you submit your [N-400 application](https://www.uscis.gov/n-400). Most successful applicants study 15-30 minutes per day for 1-3 months.

## What You Need to Know

According to [USCIS](https://www.uscis.gov/citizenship/learn-about-citizenship/the-naturalization-interview-and-test), the test covers three areas:

- Civics (U.S. government and history questions from the [official study materials](https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test))
- English reading (you read a sentence aloud)
- English writing (you write a sentence from dictation)
```

## Spanish Translation File Format

When the user is ready to build, create the Spanish translation as a companion file `blog-drafts/{slug}.es.md` (same slug as the English draft). The build step includes creating this file before running the build script so the output HTML has bilingual `data-en`/`data-es` attributes.

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

## AI Search Engine Optimization

Every article must be optimized for citation by AI search engines (Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Copilot). AI systems extract passages, not pages. Content must be structured so that key answers are self-contained, authoritative, and easy for AI to extract and cite.

### Direct-Answer Meta Descriptions

The `description` front matter field must read as a direct answer to the title question. AI systems frequently use the meta description as a source for generating answers.

- **BAD (teaser):** "Find out how many questions are on the citizenship test and how many you need to pass."
- **GOOD (answer):** "The 2025 U.S. citizenship civics test has 128 questions. During the interview, USCIS asks 20 and you must answer 12 correctly (60%) to pass."

### Answer-First Opening Paragraphs

The first paragraph must directly answer the title question in the first 1-2 sentences. Do not start with background, history, or context. The answer should be self-contained: it must make sense if an AI system extracts it without any surrounding context.

- **BAD:** "USCIS does not publish statistics on which civics test questions people get wrong most often. That means most lists online are just guesses."
- **GOOD:** "The most commonly missed questions on the U.S. citizenship civics test fall into three categories: concepts with specific definitions (like 'rule of law'), questions where people confuse similar facts (like who wrote the Federalist Papers), and number-based questions (like how many U.S. Senators there are)."

Keep the answer passage to 40-60 words for optimal snippet extraction.

### Source Citations

Add links to official USCIS pages where factual claims are made. Use "According to USCIS" or "According to the official USCIS study materials" framing. This boosts AI citation rates by up to 40%.

**Approved USCIS link targets:**
- `https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test` (study materials, civics questions)
- `https://www.uscis.gov/citizenship` (general citizenship info)
- `https://www.uscis.gov/n-400` (N-400 application)
- `https://www.uscis.gov/citizenship/learn-about-citizenship/the-naturalization-interview-and-test` (interview and test)
- `https://www.uscis.gov/forms/explore-my-options/become-a-us-citizen` (becoming a citizen)

Do NOT add links to non-USCIS websites. Only use `uscis.gov` domains.

**In Markdown drafts**, use standard link syntax: `[official USCIS study materials](https://www.uscis.gov/citizenship/find-study-materials-and-resources/study-for-the-test)`. The build script converts these to HTML links with proper bilingual attributes.

### Self-Contained Answer Blocks

Each key paragraph should work as a standalone answer if extracted by an AI system without surrounding context. Include enough context in each paragraph that it makes sense on its own.

- **BAD:** "The answer is Congress." (requires reading the question above)
- **GOOD:** "According to the USCIS civics test, Congress (the Senate and House of Representatives) makes federal laws. Many people incorrectly answer 'the President,' but the President signs bills into law rather than creating them."

### FAQ Schema

Every article must include `faq_schema` in the front matter with 2-4 FAQ entries. Choose questions that match how people actually search (natural question phrasing). FAQ schema makes content directly extractable by Perplexity and Google AI Overviews as Q&A pairs, boosting visibility by 30-40%.

Format in front matter:

```yaml
faq_schema: |
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many questions are on the U.S. citizenship test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The 2008 citizenship test has 100 questions (USCIS asks 10, you need 6 correct). The 2025 test has 128 questions (USCIS asks 20, you need 12 correct). Which test you take depends on when you filed your N-400 application."
        }
      },
      {
        "@type": "Question",
        "name": "What score do you need to pass the citizenship test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You need to answer 60% of the civics questions correctly: 6 out of 10 on the 2008 test, or 12 out of 20 on the 2025 test."
        }
      }
    ]
  }
```

**FAQ question selection criteria:**
- Use natural question phrasing ("How many..." not "Number of...")
- Choose questions people actually search for
- Answers should be 1-3 sentences, self-contained, and factually precise
- Include the most important/searchable question from the article as the first FAQ entry

### Heading Structure for AI

Use H2 headings that match how people phrase search queries. AI systems match headings to queries when selecting which passage to extract.

- **BAD:** "Key Information" or "Details"
- **GOOD:** "How Many Questions Are on the 2025 Civics Test?" or "What Documents Should I Bring to My Citizenship Interview?"

### Template-Level AI SEO (Already Configured)

The blog post layout (`_layouts/blog-post.html`) already includes these AI SEO elements automatically. You do not need to add them in article content:

- **Article schema** with `datePublished`, `dateModified`, `mainEntityOfPage`, Person author with credentials, and publisher
- **BreadcrumbList schema** (Home > Blog > Article)
- **Author byline** with photo and "Updated [date]"
- **Author bio box** at the bottom of each post
- **robots.txt** allows all AI crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended, etc.)
- **llms.txt** provides structured context for AI discovery
- **Cache-busting** CSS links to prevent stale styling after deploys
