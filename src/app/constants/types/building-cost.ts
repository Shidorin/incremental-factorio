import { MetalName, ResourceName, ProductName } from './';

export type BuildingCost = {
  [resourceName in ResourceName | ProductName | MetalName]?: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
};
