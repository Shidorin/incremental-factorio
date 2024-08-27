import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuildingsPanelComponent } from './buildingsPanel.component';

describe('BuildingsPanelComponent', () => {
  let component: BuildingsPanelComponent;
  let fixture: ComponentFixture<BuildingsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildingsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuildingsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
