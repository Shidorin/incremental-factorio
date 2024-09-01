import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingName } from 'src/app/interfaces';
import {
  Building,
  BuildingCost,
} from 'src/app/interfaces/game-state/building.interface';

@Component({
  selector: 'app-building-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buildingItem.component.html',
  styleUrl: './buildingItem.component.scss',
})
export class BuildingItemComponent {
  @Input() public building!: Building;
  @Input() public buildingName!: BuildingName;
  @Output() public increment = new EventEmitter<BuildingName>();

  protected getCostEntries(): [string, number][] {
    return Object.entries(this.building.cost).map(([key, value]) => [
      key,
      value.count,
    ]);
  }

  protected handleClick() {
    this.increment.emit(this.buildingName);
  }
}
