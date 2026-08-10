import { useId } from 'react';

export function FarmLayoutFigure() {
  const captionId = useId();

  return (
    <figure className="guide-figure farm-layout-figure" aria-labelledby={captionId}>
      <figcaption id={captionId}>Farm layout zones for a practical daily route</figcaption>
      <ul className="farm-zone-grid">
        <li className="farm-zone farm-zone-home"><span aria-hidden="true" /><strong>Home</strong><small>Start and finish the daily route</small></li>
        <li className="farm-zone farm-zone-crops"><span aria-hidden="true" /><strong>Crops</strong><small>Match plots to comfortable watering</small></li>
        <li className="farm-zone farm-zone-animals"><span aria-hidden="true" /><strong>Animals</strong><small>Leave grass and clear walking routes</small></li>
        <li className="farm-zone farm-zone-storage"><span aria-hidden="true" /><strong>Storage</strong><small>Keep chests near where items are gathered</small></li>
        <li className="farm-zone farm-zone-flex"><span aria-hidden="true" /><strong>Flexible expansion</strong><small>Reserve room for seasonal and future changes</small></li>
      </ul>
    </figure>
  );
}

const deepWoodsFish = [
  ['Sunny', 'Small', 'Any', 'Rain, thunderstorm, snow, or blizzard'],
  ['Forest Perch', 'Medium', 'Any', 'Rain, thunderstorm, snow, or blizzard'],
  ['Silver Redhorse', 'Medium', 'Any', 'Any'],
  ['Lake Trout', 'Large', 'Any', 'Any'],
  ['Muskie', 'Large', 'Any', 'Any']
] as const;

export function DeepWoodsFishTable() {
  const captionId = useId();

  return (
    <figure className="guide-figure guide-table-wrap" aria-labelledby={captionId}>
      <figcaption id={captionId}>Deep Woods fish conditions from the cited guides</figcaption>
      <table aria-label="Deep Woods fish conditions">
        <thead><tr><th scope="col">Fish</th><th scope="col">Shadow</th><th scope="col">Season</th><th scope="col">Weather</th></tr></thead>
        <tbody>
          {deepWoodsFish.map(([fish, shadow, season, weather]) => (
            <tr key={fish}><th scope="row">{fish}</th><td>{shadow}</td><td>{season}</td><td>{weather}</td></tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

export function StoneLoachFacts() {
  const captionId = useId();

  return (
    <figure className="guide-figure guide-table-wrap facts-figure" aria-labelledby={captionId}>
      <figcaption id={captionId}>Stone Loach quick facts</figcaption>
      <table aria-label="Stone Loach quick facts">
        <tbody>
          <tr><th scope="row">Location</th><td>Upper Mines, early floors</td></tr>
          <tr><th scope="row">Shadow</th><td>Medium</td></tr>
          <tr><th scope="row">Season</th><td>All seasons</td></tr>
          <tr><th scope="row">Time</th><td>No source-backed restriction</td></tr>
          <tr><th scope="row">Weather</th><td>Any weather</td></tr>
          <tr><th scope="row">Museum</th><td>Upper Mines Fish Set</td></tr>
        </tbody>
      </table>
    </figure>
  );
}

const lovedOlricGifts = [
  'Perfect Copper Ore', 'Perfect Diamond', 'Perfect Emerald', 'Perfect Gold Ore', 'Perfect Iron Ore',
  'Perfect Mistril Ore', 'Perfect Pink Diamond', 'Perfect Ruby', 'Perfect Sapphire', 'Perfect Silver Ore'
] as const;

const likedOlricGifts = [
  'Copper Ore', 'Crystal', 'Diamond', 'Emerald', 'Gold Ore', 'Hard Boiled Egg', 'Iron Ore',
  "Miner's Mushroom Stew", 'Mistril Ore', 'Obsidian', 'Pink Diamond', 'Rock with a Hole',
  'Rockroot', 'Ruby', 'Sapphire', 'Silver Ore', 'Stone', 'Stone Horse', 'Rock Statue', 'Weightless Stone'
] as const;

export function OlricGiftGroups() {
  const captionId = useId();

  return (
    <figure className="guide-figure" aria-labelledby={captionId}>
      <figcaption id={captionId}>Olric gift preferences from the cited guides</figcaption>
      <ul className="guide-card-grid gift-group-grid">
        <li><span className="card-swatch swatch-loved" aria-hidden="true" /><h3>Loved</h3><ul>{lovedOlricGifts.map((gift) => <li key={gift}>{gift}</li>)}</ul></li>
        <li><span className="card-swatch swatch-liked" aria-hidden="true" /><h3>Liked</h3><ul>{likedOlricGifts.map((gift) => <li key={gift}>{gift}</li>)}</ul></li>
        <li><span className="card-swatch swatch-avoid" aria-hidden="true" /><h3>Avoid</h3><ul><li>Junk</li><li>Bugs</li><li>Weird Gift</li><li>Rockbiter</li></ul></li>
      </ul>
    </figure>
  );
}

const weddingCategories = [
  ['Dresses', 'Wedding-day attire named by the cited secondary guide.'],
  ['Formal suits', 'A formal wedding-day option named by the same guide.'],
  ['Wedding veil', 'An accessory available during the reported attire selection.'],
  ['Existing wardrobe clothing', 'The guide also reports that you may wear an existing outfit.']
] as const;

export function WeddingOutfitCategories() {
  const captionId = useId();

  return (
    <figure className="guide-figure" aria-labelledby={captionId}>
      <figcaption id={captionId}>Wedding outfit categories reported by the cited guide</figcaption>
      <ul className="guide-card-grid outfit-category-grid">
        {weddingCategories.map(([category, description], index) => (
          <li key={category}><span className={`outfit-mark outfit-mark-${index + 1}`} aria-hidden="true" /><h3>{category}</h3><p>{description}</p></li>
        ))}
      </ul>
    </figure>
  );
}
