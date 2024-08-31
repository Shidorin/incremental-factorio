import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState, BuildingName } from 'src/app/interfaces';
import { GameStateService } from 'src/app/services/game-state.service';
import { BuildingItemComponent } from './buildingItem/buildingItem.component';

@Component({
  selector: 'app-buildings-panel',
  standalone: true,
  imports: [CommonModule, BuildingItemComponent],
  templateUrl: './buildingsPanel.component.html',
  styleUrl: './buildingsPanel.component.scss',
})
export class BuildingsPanelComponent {
  public gameStateService: GameStateService;
  public signal: WritableSignal<GameState>;

  public constructor() {
    this.gameStateService = inject(GameStateService);
    this.signal = this.gameStateService.getSignal();
  }

  handleChange(buildingName: BuildingName) {
    this.gameStateService.incrementBuilding(buildingName);
  }
}
