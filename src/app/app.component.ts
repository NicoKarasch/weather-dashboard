import { Component } from '@angular/core';
import { CurrentComponent } from './current/current.component';
import { SunmoonComponent } from './sunmoon/sunmoon.component';
import { AlertComponent } from './alert/alert.component';
import { ClockComponent } from './clock/clock.component';
import { HourlyComponent } from './hourly/hourly.component';
import { DailyComponent } from './daily/daily.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlertComponent, CurrentComponent, SunmoonComponent, ClockComponent, HourlyComponent, DailyComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'weather-dashboard';
}