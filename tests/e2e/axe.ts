import { AxeBuilder } from '@axe-core/playwright';
import type { Page } from '@playwright/test';

import { KNOWN_VIOLATING_FOREGROUNDS } from '../../src/app/styles/known-design-violations.ts';

const isKnownDesignContrast = (node: { any: { data?: unknown }[] }) =>
  node.any.some(({ data }) => {
    const foreground = (data as { fgColor?: string } | undefined)?.fgColor?.toLowerCase();
    return foreground !== undefined && KNOWN_VIOLATING_FOREGROUNDS.has(foreground);
  });

export async function findUnexpectedAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return violations
    .map((violation) =>
      violation.id === 'color-contrast'
        ? { ...violation, nodes: violation.nodes.filter((node) => !isKnownDesignContrast(node)) }
        : violation,
    )
    .filter((violation) => violation.nodes.length > 0);
}
