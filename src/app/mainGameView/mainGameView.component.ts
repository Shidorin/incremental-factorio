import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcePanelComponent } from './resourcePanel/resourcePanel.component';
import { BuildingItemComponent } from './buildingsPanel/buildingItem/buildingItem.component';
import { BuildingsPanelComponent } from './buildingsPanel/buildingsPanel.component';
import { GameLoopService } from '../services/game-loop.service';
import { MetalPanelComponent } from './metalPanel/metalPanel.component';
import { ProductionPanelComponent } from './productionPanel/productionPanel.component';

@Component({
  selector: 'app-main-game-view',
  standalone: true,
  imports: [
    CommonModule,
    ResourcePanelComponent,
    BuildingItemComponent,
    BuildingsPanelComponent,
    MetalPanelComponent,
    ProductionPanelComponent,
  ],
  templateUrl: './mainGameView.component.html',
  styleUrl: './mainGameView.component.scss',
})
export class MainGameViewComponent implements OnInit, OnDestroy {
  private gameLoopService: GameLoopService;
  constructor() {
    this.gameLoopService = inject(GameLoopService);
  }

  ngOnInit(): void {
    this.gameLoopService.startLoop();
  }

  ngOnDestroy(): void {
    this.gameLoopService.stopLoop();
  }
}
