import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { handleDrillChange, Ore } from 'src/app/interfaces';
import { OreName } from 'src/app/constants/types';

@Component({
  selector: 'app-resource-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oreItem.component.html',
  styleUrl: './oreItem.component.scss',
})
export class OreItemComponent {
  @Input() public ore!: Ore;
  @Input() public oreName!: OreName;
  @Input() public assigned!: number;
  @Output() public increment = new EventEmitter<OreName>();
  @Output() public handleDrillAssignment =
    new EventEmitter<handleDrillChange>();

  protected handleClick() {
    this.increment.emit(this.oreName);
  }

  protected handleDrillChangeButton(isDrillIncrement: boolean) {
    this.handleDrillAssignment.emit({
      isDrillIncrement: isDrillIncrement,
      oreName: this.oreName,
    });
  }
}
