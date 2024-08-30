import { Resource } from './resource.interface';

export type ResourceName =
  | 'coal'
  | 'stone'
  | 'iron'
  | 'copper'
  | 'oil'
  | 'uran';

export interface PlayerResources {
  coal: Resource;
  stone: Resource;
  iron: Resource;
  copper: Resource;
  oil: Resource;
  uran: Resource;
}
