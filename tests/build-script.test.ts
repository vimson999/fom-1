import packageJson from '../package.json';
import { expect, it } from 'vitest';

it('uses webpack for the production build command', () => {
  expect(packageJson.scripts.build).toBe('next build --webpack');
});
