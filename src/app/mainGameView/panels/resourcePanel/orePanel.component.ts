import { Component, inject, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OreItemComponent } from './resourceItem/oreItem.component';
import { GameState, handleDrillChange } from 'src/app/interfaces/';
import {
  BuildingService,
  GameStateService,
  OreService,
} from 'src/app/services/gameState';
import { OreName } from 'src/app/constants/types';
import { GameProgressService } from 'src/app/services/gameProgress';
import { CATEGORIES } from 'src/app/constants/enums';

@Component({
  selector: 'app-resource-panel',
  standalone: true,
  imports: [CommonModule, OreItemComponent],
  templateUrl: './orePanel.component.html',
  styleUrl: './orePanel.component.scss',
})
export class OrePanelComponent {
  public gameStateService: GameStateService;
  public oreService: OreService;
  public buildingService: BuildingService;
  public gameStateSignal: WritableSignal<GameState>;
  public categories = CATEGORIES;

  public constructor(protected gameProgressService: GameProgressService) {
    this.gameStateService = inject(GameStateService);
    this.oreService = inject(OreService);
    this.buildingService = inject(BuildingService);
    this.gameStateSignal = this.gameStateService.getSignal();
  }

  drillsAssigned(oreName: OreName) {
    return this.gameStateSignal().player.buildings.drills.assignments.reduce(
      (count, { job }) => {
        return job === oreName ? count + 1 : count;
      },
      0,
    );
  }

  public handleChange(oreName: OreName) {
    this.oreService.incrementOre(oreName);
  }

  public handleDrillAssignment(payload: handleDrillChange) {
    this.buildingService.handleDrillAssignment(
      payload.isDrillIncrement,
      payload.oreName,
    );
  }
}
