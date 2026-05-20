/**
 * Markdown export template generators for Obsidian-compatible library.
 * Outputs are dry-run/preview only. No file write occurs here.
 * Design spec: OBS_LIB_02_MARKDOWN_EXPORT_PLAN.md
 */

import type { LibraryItem } from "../../types/library-export-types";

export function generateFilename(item: LibraryItem): string {
  const slug = item.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 48);
  return `${item.createdAt}_${slug}.md`;
}

export function generateMarkdown(item: LibraryItem): string {
  const frontmatter = [
    "---",
    `id: ${item.id}`,
    `type: ${item.category}`,
    `status: ${item.status}`,
    `date: ${item.createdAt}`,
    item.relatedGate ? `related_gate: ${item.relatedGate}` : null,
    item.relatedCommit ? `related_commit: ${item.relatedCommit}` : null,
    item.sourceType ? `source: ${item.sourceType}` : null,
    `tags: [${item.tags.join(", ")}]`,
    "productionReady: false",
    "execution: disabled",
    "rawValuesReported: false",
    "level5: HOLD",
    "---",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return `${frontmatter}

# ${item.title}

## Summary

${item.summary}

## Main Points

${item.bodyMarkdown}

## Shikishima Relevance

<!-- Add relevance note here -->

## Evidence / Notes

<!-- Add evidence links here -->

## GO / HOLD / DEFER

<!-- GO / HOLD / DEFER + reason -->

## Next Action

${item.nextAction ?? "<!-- Add next action -->"}

## Safety

- productionReady: false
- execution: disabled
- rawValuesReported: false
`;
}
