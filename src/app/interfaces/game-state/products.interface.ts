import { MetalName, ProductName, OreName } from 'src/app/constants/types';

export type PlayerProducts = {
  [productName in ProductName]: Product;
};

export interface Product {
  quantity: number;
  productionRate: number;
  producedAmount: number;
  recipe: {
    name: OreName | MetalName | ProductName;
    count: number;
  }[];
}

export interface handleAssemblerChange {
  isIncrement: boolean;
  name: ProductName;
}

export type BuildingCost = {
  [resourceName in OreName]?: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
};
