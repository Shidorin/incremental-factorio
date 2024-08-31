import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState, BuildingName } from 'src/app/interfaces';
import { BuildingItemComponent } from './buildingItem/buildingItem.component';
import { GameStateService, BuildingService } from 'src/app/services/gameState';

@Component({
  selector: 'app-buildings-panel',
  standalone: true,
  imports: [CommonModule, BuildingItemComponent],
  templateUrl: './buildingsPanel.component.html',
  styleUrl: './buildingsPanel.component.scss',
})
export class BuildingsPanelComponent {
  public gameStateService: GameStateService;
  public buildingService: BuildingService;
  public signal: WritableSignal<GameState>;

  public constructor() {
    this.gameStateService = inject(GameStateService);
    this.buildingService = inject(BuildingService);
    this.signal = this.gameStateService.getSignal();
  }

  handleChange(buildingName: BuildingName) {
    this.buildingService.incrementBuilding(buildingName);
  }
}
