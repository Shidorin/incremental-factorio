import {
  BuildingTypes,
  PlayerMetals,
  PlayerResources,
  PlayerProducts,
  Progression,
  Upgrades,
} from './';

export interface Player {
  resources: PlayerResources;
  buildings: BuildingTypes;
  metals: PlayerMetals;
  products: PlayerProducts;
  upgrades: Upgrades;
  progression: Progression;
}
