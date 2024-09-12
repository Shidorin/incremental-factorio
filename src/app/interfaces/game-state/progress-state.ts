import {
  BuildingName,
  MetalName,
  ProductName,
  ResourceName,
} from 'src/app/constants/types';

export interface ProgressState {
  unlockedItems: {
    resources: ResourceName[];
    metals: MetalName[];
    buildings: BuildingName[];
    products: ProductName[];
    features: string[];
  };
}
