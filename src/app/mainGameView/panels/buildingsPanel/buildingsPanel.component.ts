import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameState } from 'src/app/interfaces';
import { BuildingItemComponent } from './buildingItem/buildingItem.component';
import { GameStateService, BuildingService } from 'src/app/services/gameState';
import { BuildingName } from 'src/app/constants/types';
import { GameProgressService } from 'src/app/services/gameProgress';
import { CATEGORIES } from 'src/app/constants/enums';

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
  public gameStateSignal: WritableSignal<GameState>;
  public categories = CATEGORIES;

  public constructor(protected gameProgressService: GameProgressService) {
    this.gameStateService = inject(GameStateService);
    this.buildingService = inject(BuildingService);
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  handleChange(buildingName: BuildingName) {
    this.buildingService.incrementBuilding(buildingName);
  }
}
