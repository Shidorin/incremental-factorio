import {
  BuildingTypes,
  PlayerMetals,
  PlayerOres,
  PlayerProducts,
  Progression,
  Upgrades,
} from './';

export interface Player {
  ores: PlayerOres;
  buildings: BuildingTypes;
  metals: PlayerMetals;
  products: PlayerProducts;
  upgrades: Upgrades;
  progression: Progression;
}
