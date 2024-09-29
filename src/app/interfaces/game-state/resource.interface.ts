import { OreName } from 'src/app/constants/types';

export interface Ore {
  name: string;
  quantity: number;
  productionRate: number;
  capacity: number;
}

export interface handleDrillChange {
  isDrillIncrement: boolean;
  oreName: OreName;
}
