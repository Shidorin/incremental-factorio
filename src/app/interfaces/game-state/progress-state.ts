import { BuildingName, ProductName, ResourceName } from 'src/app/constants/types';

export interface ProgressState {
  unlockedItems: {
    resources: ResourceName[];
    buildings: BuildingName[];
    products: ProductName[];
    features: string[];
  };
}
