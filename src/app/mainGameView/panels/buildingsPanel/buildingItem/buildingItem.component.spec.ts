import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingItemComponent } from './buildingItem.component';

describe('BuildingItemComponent', () => {
  let component: BuildingItemComponent;
  let fixture: ComponentFixture<BuildingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
