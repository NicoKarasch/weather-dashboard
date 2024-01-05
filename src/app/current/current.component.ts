import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';
import { Config, ConfigService, Locale } from '../config.service';
import { FormatService } from '../format.service';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule, DetailComponent],
  host: {'class': 'col-5'},
  templateUrl: './current.component.html',
  styleUrl: './current.component.css'
})
export class CurrentComponent implements OnInit {
  config: Config;
  locale: Locale;
  currentWeather: WeatherData;
  weatherService: WeatherService = inject(WeatherService);
  fmt: FormatService = inject(FormatService);

  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
    configService.getLocale().subscribe(locale => this.locale = locale);
  }

  ngOnInit(): void {
    this.weatherService.getCurrent().subscribe(currentWeather => {
      this.currentWeather = currentWeather;
    });
  }
}
