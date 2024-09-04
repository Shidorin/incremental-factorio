import { ProductName } from './product';
import { ResourceName } from './resource';

export type BuildingCost = {
  [resourceName in ResourceName | ProductName]?: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
};
