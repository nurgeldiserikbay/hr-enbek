import axe from 'axe-core';

const JSDOM_UNSUPPORTED_RULES = { 'color-contrast': { enabled: false } };

export const expectNoA11yViolations = async (container: Element): Promise<void> => {
  const { violations } = await axe.run(container, { rules: JSDOM_UNSUPPORTED_RULES });
  expect(violations).toEqual([]);
};
