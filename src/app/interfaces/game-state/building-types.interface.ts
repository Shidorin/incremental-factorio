import { Building } from './building.interface';

export interface BuildingTypes {
  drills: Building;
  furnaces: Building;
  assemblers: Building;
  labs: Building;
}

export type BuildingName = 'drills' | 'furnaces' | 'assemblers' | 'labs';

export interface BuildingConfig {
  baseCost: number;
  scalingFactor: number;
  // Add other attributes as needed, like build time, resource requirements, etc.
}
