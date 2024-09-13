import { Perks } from './';

export interface Progression {
  redSciencePoints: number;
  currentTier: string;
  restartCount: number;
  perks: Perks;
}
