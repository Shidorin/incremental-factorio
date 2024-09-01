export interface Building {
  name: string;
  quantity: number;
  cost: BuildingCost;
}

export interface BuildingCost {
  [resourceName: string]: {
    count: number;
    baseCost: number;
    scalingFactor: number;
  };
}
