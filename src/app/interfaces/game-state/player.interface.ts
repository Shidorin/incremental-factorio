import { BuildingTypes } from './building-types.interface';
import { Progression } from './progression.interface';
import { PlayerResources } from './player-resources.interface';
import { Products } from './products.interface';
import { Upgrades } from './upgrades.interface';

export interface Player {
  resources: PlayerResources;
  products: Products;
  buildings: BuildingTypes;
  upgrades: Upgrades;
  progression: Progression;
}
