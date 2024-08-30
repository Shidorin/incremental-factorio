import { GameSettings } from './game-settings.interface';
import { Player } from './player.interface';
import { UIState } from './ui-state.interface';

export interface GameState {
  player: Player;
  gameSettings: GameSettings;
  uiState: UIState;
}
