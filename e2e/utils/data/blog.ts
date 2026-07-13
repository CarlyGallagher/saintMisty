export function buildBlogPost(overrides: Partial<{ title: string; content: string }> = {}) {
  return {
    title: `Test Post ${Date.now()}`,
    content: 'This is test blog content.',
    ...overrides,
  };
}
