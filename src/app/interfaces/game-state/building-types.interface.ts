import { Building } from './building.interface';

export interface BuildingTypes {
  drills: Building;
  furnaces: Building;
  assemblers: Building;
  labs: Building;
}

export type BuildingName = 'drills' | 'furnaces' | 'assemblers' | 'labs';

