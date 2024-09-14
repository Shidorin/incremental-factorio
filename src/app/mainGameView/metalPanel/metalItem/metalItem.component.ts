import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetalName } from 'src/app/constants/types';
import { handleFurnaceChange, Metal } from 'src/app/interfaces';

@Component({
  selector: 'app-metal-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metalItem.component.html',
  styleUrl: './metalItem.component.scss',
})
export class MetalItemComponent {
  @Input() public metal!: Metal;
  @Input() public metalName!: MetalName;
  @Input() public assigned!: number;
  @Output() public increment = new EventEmitter<MetalName>();
  @Output() public handleFurnaceAssignment =
    new EventEmitter<handleFurnaceChange>();

  protected handleClick() {
    this.increment.emit(this.metalName);
  }

  protected handleFurnaceChangeButton(isFurnaceIncrement: boolean) {
    this.handleFurnaceAssignment.emit({
      isFurnaceIncrement: isFurnaceIncrement,
      metalName: this.metalName,
    });
  }
}
