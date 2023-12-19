import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule, DetailComponent],
  templateUrl: './current.component.html',
  styleUrl: './current.component.css'
})
export class CurrentComponent implements OnInit {
  currentWeather: WeatherData | undefined;
  weatherService: WeatherService = inject(WeatherService);

  ngOnInit(): void {
    this.weatherService.getCurrent().then((currentWeather) => {
      this.currentWeather = currentWeather;
    });
  }
}
