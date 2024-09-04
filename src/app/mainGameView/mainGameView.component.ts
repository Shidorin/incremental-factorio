import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcePanelComponent } from './resourcePanel/resourcePanel.component';
import { BuildingItemComponent } from './buildingsPanel/buildingItem/buildingItem.component';
import { BuildingsPanelComponent } from './buildingsPanel/buildingsPanel.component';
import { GameLoopService } from '../services/game-loop.service';

@Component({
  selector: 'app-main-game-view',
  standalone: true,
  imports: [
    CommonModule,
    ResourcePanelComponent,
    BuildingItemComponent,
    BuildingsPanelComponent,
  ],
  templateUrl: './mainGameView.component.html',
  styleUrl: './mainGameView.component.scss',
})
export class MainGameViewComponent {
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
