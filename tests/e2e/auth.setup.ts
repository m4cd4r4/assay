import { test as setup } from '@playwright/test';

const AUTH_FILE = 'tests/e2e/.auth/state.json';

// No login flow exists - session tokens are created on upload.
// This setup just ensures a clean state file for dependent projects.
setup('prepare auth state', async ({ request }) => {
  await request.storageState({ path: AUTH_FILE });
});
