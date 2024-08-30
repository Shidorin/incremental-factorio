import { Buildings } from './buildings.interface';
import { Progression } from './progression.interface';
import { PlayerResources } from './player-resources.interface';
import { Products } from './products.interface';
import { Upgrades } from './upgrades.interface';

export interface Player {
  resources: PlayerResources;
  products: Products;
  buildings: Buildings;
  upgrades: Upgrades;
  progression: Progression;
}
