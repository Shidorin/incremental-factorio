import { BuildingCost, ProductName, ResourceName, STATUS } from 'src/app/constants/types';

export interface Building {
  name: string;
  quantity: number;
  cost: BuildingCost;
  fuelUsage: number;
  assignments: assignment[] | [];
}

export interface assignment {
  status: STATUS;
  job?: ResourceName | ProductName;
}
