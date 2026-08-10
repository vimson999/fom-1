import type { MDXComponents } from 'mdx/types';
import {
  DeepWoodsFishTable,
  FarmLayoutFigure,
  OlricGiftGroups,
  StoneLoachFacts,
  WeddingOutfitCategories
} from '@/components/guide-visuals';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    FarmLayoutFigure,
    DeepWoodsFishTable,
    StoneLoachFacts,
    OlricGiftGroups,
    WeddingOutfitCategories,
    ...components
  };
}
