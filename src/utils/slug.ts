// Slugify a heading into a URL fragment. Matches what rehype-slug produces
// for markdown/MDX headings (github-slugger rules) closely enough that ids
// generated here and there look and behave the same.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[’'"]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}
