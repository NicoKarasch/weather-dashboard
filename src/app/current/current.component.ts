import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';
import { Config, ConfigService } from '../config.service';

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
  currentWeather: WeatherData;
  weatherService: WeatherService = inject(WeatherService);
  timeFmt = new Intl.DateTimeFormat(undefined, {timeStyle:'short'});
  nbrFmt = new Intl.NumberFormat();

  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    this.weatherService.getCurrent().subscribe(currentWeather => {
      this.currentWeather = currentWeather;
    });
  }
}
