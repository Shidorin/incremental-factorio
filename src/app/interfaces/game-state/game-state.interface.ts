import { GameSettings, Player, ProgressState, UIState } from './';

export interface GameState {
  player: Player;
  gameSettings: GameSettings;
  uiState: UIState;
  progressState: ProgressState;
}
