import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainGameViewComponent } from './mainGameView/mainGameView.component';

@Component({
  standalone: true,
  imports: [RouterModule, MainGameViewComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'incremental-factorio';
}
