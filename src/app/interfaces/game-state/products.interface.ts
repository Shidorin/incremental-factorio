import { MetalName, ProductName, ResourceName } from 'src/app/constants/types';

export type PlayerProducts = {
  [productName in ProductName]: Product;
};

export interface Product {
  quantity: number;
  productionRate: number;
  producedAmount: number;
  recipe: {
    name: ResourceName | MetalName | ProductName;
    count: number;
  }[];
}

export interface handleAssemblerChange {
  isIncrement: boolean;
  name: ProductName;
}

export type BuildingCost = {
  [resourceName in ResourceName]?: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
};
