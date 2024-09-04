import { ResourceName, ProductName } from 'src/app/enums';

export type Products = {
  [productName in ProductName]: number;
};

export type BuildingCost = {
  [resourceName in ResourceName]?: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
};
