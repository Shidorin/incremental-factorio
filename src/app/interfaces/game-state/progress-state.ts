import {
  BuildingName,
  MetalName,
  ProductName,
  OreName,
} from 'src/app/constants/types';

export interface ProgressState {
  unlockedItems: {
    ores: OreName[];
    metals: MetalName[];
    buildings: BuildingName[];
    products: ProductName[];
    features: string[];
  };
}
