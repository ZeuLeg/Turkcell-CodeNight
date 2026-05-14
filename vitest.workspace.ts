// Export workspace projects directly to avoid importing defineWorkspace
// which may not be available in some versions of vitest/config
export default [
  'packages/*',
];