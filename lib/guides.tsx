import type { ComponentType } from 'react';
import Guide from '@/content/guides/fields-of-mistria-guide.mdx';
import Characters from '@/content/guides/fields-of-mistria-characters.mdx';
import FarmLayout from '@/content/guides/fields-of-mistria-farm-layout.mdx';
import Items from '@/content/guides/fields-of-mistria-items.mdx';
import Shovel from '@/content/guides/how-to-get-shovel-fields-of-mistria.mdx';
import WaterChestnuts from '@/content/guides/water-chestnuts-fields-of-mistria.mdx';
import DeepWoodsFish from '@/content/guides/fields-of-mistria-deep-woods-fish.mdx';
import StoneLoach from '@/content/guides/stone-loach-fields-of-mistria.mdx';
import OlricGifts from '@/content/guides/olric-fields-of-mistria-gifts.mdx';
import WeddingOutfits from '@/content/guides/wedding-outfits-fields-of-mistria.mdx';

export type GuideEntry = { slug: string; title: string; description: string; keyword: string; Component: ComponentType };

export const guides: GuideEntry[] = [
  { slug: 'fields-of-mistria-guide', title: 'Fields of Mistria Guide: A Practical First Week', description: 'A source-based starting guide for early tools, requests and town progress.', keyword: 'fields of mistria guide', Component: Guide },
  { slug: 'fields-of-mistria-characters', title: 'Fields of Mistria Characters: Romance and Villagers', description: 'A source-based overview of characters, romance and villagers.', keyword: 'fields of mistria characters', Component: Characters },
  { slug: 'fields-of-mistria-farm-layout', title: 'Fields of Mistria Farm Layout: Plan Your Space', description: 'Plan crops, barns, storage, trees and decoration with source-backed tips.', keyword: 'fields of mistria farm layout', Component: FarmLayout },
  { slug: 'fields-of-mistria-items', title: 'Fields of Mistria Items: A Source-Based Guide', description: 'Navigate tools, crops, fish, forageables and materials.', keyword: 'fields of mistria items', Component: Items },
  { slug: 'how-to-get-shovel-fields-of-mistria', title: 'How to Get Shovel Fields of Mistria: Guide', description: 'A direct source-based guide to getting the shovel.', keyword: 'how to get shovel fields of mistria', Component: Shovel },
  { slug: 'water-chestnuts-fields-of-mistria', title: 'Water Chestnuts Fields of Mistria: Location Guide', description: 'Where to find Water Chestnuts and what sources confirm.', keyword: 'water chestnuts fields of mistria', Component: WaterChestnuts },
  { slug: 'fields-of-mistria-deep-woods-fish', title: 'Fields of Mistria Deep Woods Fish Locations Guide', description: 'Deep Woods fish locations, access and verification notes.', keyword: 'fields of mistria deep woods fish', Component: DeepWoodsFish },
  { slug: 'stone-loach-fields-of-mistria', title: 'Stone Loach Fields of Mistria Catching Guide', description: 'A source-based Stone Loach catching guide.', keyword: 'stone loach fields of mistria', Component: StoneLoach },
  { slug: 'olric-fields-of-mistria-gifts', title: 'Olric Fields of Mistria Gifts: Loved and Liked', description: 'Gift guidance for Olric with verification notes.', keyword: 'olric fields of mistria gifts', Component: OlricGifts },
  { slug: 'wedding-outfits-fields-of-mistria', title: 'Wedding Outfits Fields of Mistria: Options & Planning', description: 'What the source material confirms about wedding outfits and planning.', keyword: 'wedding outfits fields of mistria', Component: WeddingOutfits }
];

export function getGuideBySlug(slug: string) { return guides.find((guide) => guide.slug === slug); }
