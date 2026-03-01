---
title: "{{TITLE}}"
description: "{{DIRECT_ANSWER_DESCRIPTION}}"
keywords: "{{KEYWORDS}}"
date: {{DATE}}
llms_section: "{{SECTION}}"
llms_desc: "{{BRIEF_DESCRIPTION}}"
faq_schema: |
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "{{FAQ_QUESTION_1}}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{{FAQ_ANSWER_1}}"
        }
      },
      {
        "@type": "Question",
        "name": "{{FAQ_QUESTION_2}}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{{FAQ_ANSWER_2}}"
        }
      },
      {
        "@type": "Question",
        "name": "{{FAQ_QUESTION_3}}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "{{FAQ_ANSWER_3}}"
        }
      }
    ]
  }
related:
  - slug: {{RELATED_SLUG_1}}
    title: "{{RELATED_TITLE_1}}"
  - slug: {{RELATED_SLUG_2}}
    title: "{{RELATED_TITLE_2}}"
  - slug: {{RELATED_SLUG_3}}
    title: "{{RELATED_TITLE_3}}"
---

{{ANSWER_FIRST_INTRO_PARAGRAPH}}

## {{SECTION_1_HEADING}}

{{SECTION_1_CONTENT}}

## {{SECTION_2_HEADING}}

{{SECTION_2_CONTENT}}

- {{LIST_ITEM_1}}
- {{LIST_ITEM_2}}
- {{LIST_ITEM_3}}

## {{SECTION_3_HEADING}}

{{SECTION_3_CONTENT}}

## {{SECTION_4_HEADING}}

{{SECTION_4_CONTENT}}
