import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentComponent } from './current/current.component';
import { SunmoonComponent } from './sunmoon/sunmoon.component';
import { AlertComponent } from './alert/alert.component';
import { ClockComponent } from './clock/clock.component';
import { HourlyComponent } from './hourly/hourly.component';
import { DailyComponent } from './daily/daily.component';
import { Config, ConfigService } from './config.service';
import { StatusComponent } from './status/status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StatusComponent, AlertComponent, CurrentComponent, SunmoonComponent, ClockComponent, HourlyComponent, DailyComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  config: Config;
  constructor(private configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }
  title = 'weather-dashboard';
}