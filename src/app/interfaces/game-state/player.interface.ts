import {
  BuildingTypes,
  PlayerMetals,
  PlayerResources,
  Products,
  Progression,
  Upgrades,
} from './';

export interface Player {
  resources: PlayerResources;
  buildings: BuildingTypes;
  metals: PlayerMetals;
  products: Products;
  upgrades: Upgrades;
  progression: Progression;
}
