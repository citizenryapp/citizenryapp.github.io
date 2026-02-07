#!/bin/bash
#
# add-blog-article.sh
#
# Adds a new blog article's metadata to blog-articles.json, sitemap.xml, and llms.txt.
# Does NOT run rotate-blog.js (run that separately after all articles are added).
#
# Usage:
#   ./skills/generate-blog-articles/scripts/add-blog-article.sh \
#     --slug "kebab-case-slug" \
#     --title-en "English Title" \
#     --title-es "Spanish Title" \
#     --excerpt-en "English excerpt for listing cards" \
#     --excerpt-es "Spanish excerpt for listing cards" \
#     --llms-section "Test Preparation" \
#     --llms-desc "Brief description for llms.txt"
#
# Required: jq (for JSON manipulation)

set -euo pipefail

# Parse arguments
SLUG=""
TITLE_EN=""
TITLE_ES=""
EXCERPT_EN=""
EXCERPT_ES=""
LLMS_SECTION=""
LLMS_DESC=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --slug) SLUG="$2"; shift 2 ;;
    --title-en) TITLE_EN="$2"; shift 2 ;;
    --title-es) TITLE_ES="$2"; shift 2 ;;
    --excerpt-en) EXCERPT_EN="$2"; shift 2 ;;
    --excerpt-es) EXCERPT_ES="$2"; shift 2 ;;
    --llms-section) LLMS_SECTION="$2"; shift 2 ;;
    --llms-desc) LLMS_DESC="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

# Validate required arguments
if [[ -z "$SLUG" || -z "$TITLE_EN" || -z "$TITLE_ES" || -z "$EXCERPT_EN" || -z "$EXCERPT_ES" || -z "$LLMS_SECTION" || -z "$LLMS_DESC" ]]; then
  echo "Error: All arguments are required."
  echo "Usage: add-blog-article.sh --slug SLUG --title-en TITLE --title-es TITLE --excerpt-en EXCERPT --excerpt-es EXCERPT --llms-section SECTION --llms-desc DESC"
  exit 1
fi

# Find repository root (where blog-articles.json lives)
REPO_ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"

echo "Adding blog article: $SLUG"
echo "Repository root: $REPO_ROOT"

# --- 1. Update blog-articles.json ---
echo ""
echo "1. Updating blog-articles.json..."

ARTICLES_FILE="$REPO_ROOT/blog-articles.json"

if ! command -v jq &> /dev/null; then
  echo "Error: jq is required but not installed. Install with: brew install jq"
  exit 1
fi

# Check if article already exists
if jq -e ".articles[] | select(.id == \"$SLUG\")" "$ARTICLES_FILE" > /dev/null 2>&1; then
  echo "   Article '$SLUG' already exists in blog-articles.json, skipping."
else
  # Create new entry and insert at position 1 (after featured article)
  NEW_ENTRY=$(jq -n \
    --arg id "$SLUG" \
    --arg file "blog/$SLUG.html" \
    --arg title_en "$TITLE_EN" \
    --arg title_es "$TITLE_ES" \
    --arg excerpt_en "$EXCERPT_EN" \
    --arg excerpt_es "$EXCERPT_ES" \
    '{id: $id, file: $file, title_en: $title_en, title_es: $title_es, excerpt_en: $excerpt_en, excerpt_es: $excerpt_es}')

  jq --argjson entry "$NEW_ENTRY" '.articles = [.articles[0]] + [$entry] + .articles[1:]' "$ARTICLES_FILE" > "$ARTICLES_FILE.tmp"
  mv "$ARTICLES_FILE.tmp" "$ARTICLES_FILE"
  echo "   Added to blog-articles.json at position 1."
fi

# --- 2. Update sitemap.xml ---
echo ""
echo "2. Updating sitemap.xml..."

SITEMAP_FILE="$REPO_ROOT/sitemap.xml"
ARTICLE_URL="https://citizenryapp.com/blog/$SLUG.html"

if grep -q "$ARTICLE_URL" "$SITEMAP_FILE"; then
  echo "   URL already exists in sitemap.xml, skipping."
else
  # Build the new URL block
  NEW_URL_BLOCK="  <url>\n    <loc>$ARTICLE_URL</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>"

  # Insert before the closing </urlset> tag
  if [[ "$(uname)" == "Darwin" ]]; then
    sed -i '' "s|</urlset>|$NEW_URL_BLOCK\n</urlset>|" "$SITEMAP_FILE"
  else
    sed -i "s|</urlset>|$NEW_URL_BLOCK\n</urlset>|" "$SITEMAP_FILE"
  fi
  echo "   Added to sitemap.xml."
fi

# --- 3. Update llms.txt ---
echo ""
echo "3. Updating llms.txt..."

LLMS_FILE="$REPO_ROOT/llms.txt"
LLMS_LINK="- [$TITLE_EN]($ARTICLE_URL): $LLMS_DESC"

if grep -q "$ARTICLE_URL" "$LLMS_FILE"; then
  echo "   URL already exists in llms.txt, skipping."
else
  # Find the section header and append after the last entry in that section
  SECTION_HEADER="## Blog Articles - $LLMS_SECTION"

  if grep -q "$SECTION_HEADER" "$LLMS_FILE"; then
    # Use awk to insert the new link at the end of the matching section
    awk -v section="$SECTION_HEADER" -v link="$LLMS_LINK" '
      $0 == section { in_section=1; print; next }
      in_section && /^$/ { print link; in_section=0 }
      in_section && /^## / { print link; print ""; in_section=0 }
      { print }
      END { if (in_section) print link }
    ' "$LLMS_FILE" > "$LLMS_FILE.tmp"
    mv "$LLMS_FILE.tmp" "$LLMS_FILE"
    echo "   Added to llms.txt under '$SECTION_HEADER'."
  else
    echo "   Warning: Section '$SECTION_HEADER' not found in llms.txt."
    echo "   Appending to end of file."
    echo "" >> "$LLMS_FILE"
    echo "$LLMS_LINK" >> "$LLMS_FILE"
  fi
fi

echo ""
echo "Done! Article '$SLUG' integrated into site metadata."
echo "Remember to run 'node scripts/rotate-blog.js' after adding all articles."
