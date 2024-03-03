import { resolve } from 'path';

export default {
  resolve: {
    fallback: {
      path: (await import('path-browserify')).default,
      os: (await import('os-browserify/browser')).default,
      crypto: (await import('crypto-browserify')).default,
    },
  },
};
