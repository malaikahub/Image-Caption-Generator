import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('Loaded .env manually:', env); // Debug log

  return {
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  };
});