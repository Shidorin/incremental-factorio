import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameLoopService } from '../services/game-loop.service';
import { GameStateService } from '../services/gameState';
import { PANELS } from '../constants/enums';
import {
  BuildingsPanelComponent,
  MetalPanelComponent,
  ProductionPanelComponent,
  OrePanelComponent,
  SciencePanelComponent,
} from './panels';

import { MatTabsModule } from '@angular/material/tabs';
import { GameState } from '../interfaces';

@Component({
  selector: 'app-main-game-view',
  standalone: true,
  imports: [
    CommonModule,
    OrePanelComponent,
    BuildingsPanelComponent,
    MetalPanelComponent,
    ProductionPanelComponent,
    SciencePanelComponent,
    MatTabsModule,
  ],
  templateUrl: './mainGameView.component.html',
  styleUrl: './mainGameView.component.scss',
})
export class MainGameViewComponent implements OnInit, OnDestroy {
  private gameLoopService: GameLoopService;
  public tabIndex = 0;
  public panels = PANELS;

  constructor(private gameStateService: GameStateService) {
    this.gameLoopService = inject(GameLoopService);

    effect(() => {
      const currentPanel =
        this.gameStateService.getSignal()().uiState.currentPanel;
      this.tabIndex = Object.values(this.panels).indexOf(currentPanel);
    });
  }

  ngOnInit(): void {
    this.gameLoopService.startLoop();
  }

  ngOnDestroy(): void {
    this.gameLoopService.stopLoop();
  }

  onTabChange(index: number): void {
    this.gameStateService.getSignal().update((current: GameState) => {
      return {
        ...current,
        uiState: {
          ...current.uiState,
          currentPanel: Object.values(this.panels)[index],
        },
      };
    });
  }
}
