import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { handleDrillChange, Resource } from 'src/app/interfaces';
import { ResourceName } from 'src/app/constants/types';

@Component({
  selector: 'app-resource-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resourceItem.component.html',
  styleUrl: './resourceItem.component.scss',
})
export class ResourceItemComponent {
  @Input() public resource!: Resource;
  @Input() public resourceName!: ResourceName;
  @Output() public increment = new EventEmitter<ResourceName>();
  @Output() public handleDrillAssignment =
    new EventEmitter<handleDrillChange>();

  protected handleClick() {
    this.increment.emit(this.resourceName);
  }

  protected handleDrillChangeButton(isDrillIncrement: boolean) {
    this.handleDrillAssignment.emit({
      isDrillIncrement: isDrillIncrement,
      resourceName: this.resourceName,
    });
  }
}
