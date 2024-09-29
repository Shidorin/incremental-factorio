import { MetalName, OreName, ProductName } from './';

export type BuildingCost = {
  [resourceName in OreName | ProductName | MetalName]?: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
};
