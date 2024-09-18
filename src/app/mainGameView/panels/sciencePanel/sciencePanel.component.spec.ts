import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SciencePanelComponent } from './sciencePanel.component';

describe('SciencePanelComponent', () => {
  let component: SciencePanelComponent;
  let fixture: ComponentFixture<SciencePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SciencePanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SciencePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
