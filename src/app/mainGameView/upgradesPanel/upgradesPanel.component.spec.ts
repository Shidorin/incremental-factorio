import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpgradesPanelComponent } from './upgradesPanel.component';

describe('UpgradesPanelComponent', () => {
  let component: UpgradesPanelComponent;
  let fixture: ComponentFixture<UpgradesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradesPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
