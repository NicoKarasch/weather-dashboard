import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';
import { Config, ConfigService } from '../config.service';

@Component({
  selector: 'app-daily',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily.component.html',
  styleUrl: './daily.component.css',
  host: {'class': 'row pt-3'}
})
export class DailyComponent implements OnInit {
  weather: WeatherData[] = [];
  weatherService: WeatherService = inject(WeatherService);
  config: Config;
  weekdayFmt = new Intl.DateTimeFormat(undefined, {weekday:'long'});
  todayStr = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'}).format(0, 'day');
  dateFmt = new Intl.DateTimeFormat(undefined, {day:'numeric', month:'numeric'});
  timeFmt = new Intl.DateTimeFormat(undefined, {timeStyle:'short'});
  nbrFmt = new Intl.NumberFormat();
  precFmt = new Intl.NumberFormat(undefined, {maximumFractionDigits: 1});
  
  constructor(private configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    this.weatherService.getDaily().subscribe(weather => {
      this.weather = weather;
    });
  }
}
