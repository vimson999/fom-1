import type { ComponentType } from 'react';
import type { GuideMetadata } from '@/lib/content';
import Guide, { metadata as guideMetadata } from '@/content/guides/fields-of-mistria-guide.mdx';
import Characters, { metadata as charactersMetadata } from '@/content/guides/fields-of-mistria-characters.mdx';
import FarmLayout, { metadata as farmLayoutMetadata } from '@/content/guides/fields-of-mistria-farm-layout.mdx';
import Items, { metadata as itemsMetadata } from '@/content/guides/fields-of-mistria-items.mdx';
import Shovel, { metadata as shovelMetadata } from '@/content/guides/how-to-get-shovel-fields-of-mistria.mdx';
import WaterChestnuts, { metadata as waterChestnutsMetadata } from '@/content/guides/water-chestnuts-fields-of-mistria.mdx';
import DeepWoodsFish, { metadata as deepWoodsFishMetadata } from '@/content/guides/fields-of-mistria-deep-woods-fish.mdx';
import StoneLoach, { metadata as stoneLoachMetadata } from '@/content/guides/stone-loach-fields-of-mistria.mdx';
import OlricGifts, { metadata as olricGiftsMetadata } from '@/content/guides/olric-fields-of-mistria-gifts.mdx';
import WeddingOutfits, { metadata as weddingOutfitsMetadata } from '@/content/guides/wedding-outfits-fields-of-mistria.mdx';

export type GuideEntry = GuideMetadata & { Component: ComponentType };

function entry(metadata: GuideMetadata, Component: ComponentType): GuideEntry {
  return { ...metadata, Component };
}

export const guides: GuideEntry[] = [
  entry(guideMetadata, Guide),
  entry(charactersMetadata, Characters),
  entry(farmLayoutMetadata, FarmLayout),
  entry(itemsMetadata, Items),
  entry(shovelMetadata, Shovel),
  entry(waterChestnutsMetadata, WaterChestnuts),
  entry(deepWoodsFishMetadata, DeepWoodsFish),
  entry(stoneLoachMetadata, StoneLoach),
  entry(olricGiftsMetadata, OlricGifts),
  entry(weddingOutfitsMetadata, WeddingOutfits)
];

export function getGuideBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
