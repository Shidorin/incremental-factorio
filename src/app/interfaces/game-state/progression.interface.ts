import { Perks } from './perks.interface';

export interface Progression {
  redSciencePoints: number;
  currentTier: string;
  restartCount: number;
  perks: Perks;
}
