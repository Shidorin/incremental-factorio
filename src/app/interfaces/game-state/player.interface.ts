import { BuildingTypes } from './building-types.interface';
import { Progression } from './progression.interface';
import { PlayerResources } from './player-resources.interface';
import { Products } from './products.interface';
import { Upgrades } from './upgrades.interface';
import { PlayerMetals } from './metals.interface';

export interface Player {
  resources: PlayerResources;
  buildings: BuildingTypes;
  metals: PlayerMetals;
  products: Products;
  upgrades: Upgrades;
  progression: Progression;
}
