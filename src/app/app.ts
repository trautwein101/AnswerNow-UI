import { environment } from '../environments/environment';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  readonly demoMode = environment.demoMode;
  protected readonly title = signal('answernow-ui');
}
