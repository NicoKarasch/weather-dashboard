import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
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
  styleUrl: './current.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }    
  ] 
})
export class CurrentComponent implements OnInit {
  config: Config;
  currentWeather: WeatherData | undefined;
  weatherService: WeatherService = inject(WeatherService);

  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    this.weatherService.getCurrent().subscribe(currentWeather => {
      this.currentWeather = currentWeather;
    });
  }
}
