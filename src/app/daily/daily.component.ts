import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
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
  host: {'class': 'row pt-3'},
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }    
  ] 
})
export class DailyComponent implements OnInit {
  weather: WeatherData[] = [];
  weatherService: WeatherService = inject(WeatherService);
  config: Config;
  
  constructor(private configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    this.weatherService.getDaily().subscribe(weather => {
      this.weather = weather;
    });
  }
}
