export interface Candle {
  id: string;
  name: string;
  color: string;
}

// Order is part of the share-link contract (seed stores the index). First entry is the default look.
export const CANDLES: readonly Candle[] = [
  { id: 'ember', name: 'Ember', color: '#ff8a1f' },
  { id: 'toxic', name: 'Toxic', color: '#7dff3a' },
  { id: 'witch', name: 'Witch', color: '#b56bff' },
  { id: 'ghost', name: 'Ghost', color: '#5cc8ff' },
  { id: 'blood', name: 'Blood', color: '#ff3b4a' },
  { id: 'moon', name: 'Moon', color: '#ffe066' },
];
