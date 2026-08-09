import createMDX from '@next/mdx';

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'md', 'mdx']
};

export default createMDX({})(nextConfig);
