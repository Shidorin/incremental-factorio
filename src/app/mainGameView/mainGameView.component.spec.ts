import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainGameViewComponent } from './mainGameView.component';

describe('MainGameViewComponent', () => {
  let component: MainGameViewComponent;
  let fixture: ComponentFixture<MainGameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainGameViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainGameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
