import { MetalName, ResourceName } from 'src/app/constants/types';

export type PlayerMetals = {
  [metalName in MetalName]: Metal;
};

export interface Metal {
  quantity: number;
  productionRate: number;
  producedAmount: number;
  recipe: {
    name: ResourceName;
    count: number;
  }[];
}

export interface handleFurnaceChange {
  isFurnaceIncrement: boolean;
  metalName: MetalName;
}
