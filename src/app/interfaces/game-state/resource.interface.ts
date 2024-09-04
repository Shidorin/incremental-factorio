import { ResourceName } from 'src/app/enums';

export interface Resource {
  name: string;
  quantity: number;
  productionRate: number;
  capacity: number;
}

export interface handleDrillChange {
  isDrillIncrement: boolean;
  resourceName: ResourceName;
}
