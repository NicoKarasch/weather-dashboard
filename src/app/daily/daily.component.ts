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
  weekdayFmt: Intl.DateTimeFormat;
  todayStr: string;
  dateFmt: Intl.DateTimeFormat;
  timeFmt: Intl.DateTimeFormat;
  nbrFmt: Intl.NumberFormat;
  precFmt: Intl.NumberFormat;
  
  constructor(private configService: ConfigService){
    configService.get().subscribe(config => {
      this.config = config;
      this.weekdayFmt = new Intl.DateTimeFormat(config.language, {weekday:'long'});
      this.todayStr = new Intl.RelativeTimeFormat(config.language, {numeric: 'auto'}).format(0, 'day');
      this.dateFmt = new Intl.DateTimeFormat(config.language, {day:'numeric', month:'numeric'});
      this.timeFmt = new Intl.DateTimeFormat(config.language, {timeStyle:'short'});
      this.nbrFmt = new Intl.NumberFormat(config.language);
      this.precFmt = new Intl.NumberFormat(config.language, {maximumFractionDigits: 1});
    });
  }

  ngOnInit(): void {
    this.weatherService.getDaily().subscribe(weather => {
      this.weather = weather;
    });
  }
}
