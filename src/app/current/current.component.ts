import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule, DetailComponent],
  host: {'class': 'col-6'},
  templateUrl: './current.component.html',
  styleUrl: './current.component.css'
})
export class CurrentComponent implements OnInit {
  currentWeather: WeatherData | undefined;
  weatherService: WeatherService = inject(WeatherService);

  ngOnInit(): void {
    this.weatherService.getCurrent().subscribe(currentWeather => {
      this.currentWeather = currentWeather;
    });
  }

  getBeaufort(speed: number): number {
    if(speed <= 0.2)  return 0;
    if(speed <= 1.5)  return 1;
    if(speed <= 3.3)  return 2;
    if(speed <= 5.4)  return 3;
    if(speed <= 7.9)  return 4;
    if(speed <= 10.7) return 5;
    if(speed <= 13.8) return 6;
    if(speed <= 17.1) return 7;
    if(speed <= 20.7) return 8;
    if(speed <= 24.4) return 9;
    if(speed <= 28.4) return 10;
    if(speed <= 32.6) return 11;
    return 12;
  }
}
