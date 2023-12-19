import { Component } from '@angular/core';
import { CurrentComponent } from './current/current.component';
import { SunmoonComponent } from './sunmoon/sunmoon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CurrentComponent, SunmoonComponent],
  template: `<div class="container-fluid"><div class="row"><app-current/><app-sunmoon/></div></div>`
})
export class AppComponent {
  title = 'weather-dashboard';
}
