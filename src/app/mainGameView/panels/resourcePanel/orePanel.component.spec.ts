import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrePanelComponent } from './orePanel.component';

describe('OrePanelComponent', () => {
  let component: OrePanelComponent;
  let fixture: ComponentFixture<OrePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
