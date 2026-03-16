import { test as setup } from '@playwright/test';

const AUTH_FILE = 'tests/e2e/.auth/state.json';

setup('authenticate', async ({ request }) => {
  await request.post('/api/auth', {
    data: { password: '01assay!' },
  });

  await request.storageState({ path: AUTH_FILE });
});
