import { Component } from '@angular/core';
import { CurrentComponent } from './current/current.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrentComponent],
  template: `<div class="container-fluid"><app-current/></div>`
})
export class AppComponent {
  title = 'weather-dashboard';
}
