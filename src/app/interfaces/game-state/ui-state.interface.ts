import { PANELS } from 'src/app/constants/enums';

export interface UIState {
  currentPanel: PANELS;
  popupsSeen: string[];
  resourcePanelExpanded: boolean;
}
