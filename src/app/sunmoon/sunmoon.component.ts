import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';
import { IconComponent } from './icon/icon.component';
import { Config, ConfigService, Locale } from '../config.service';
import { DurationType, FormatService } from '../format.service';

@Component({
  selector: 'app-sunmoon',
  standalone: true,
  imports: [CommonModule, IconComponent],
  host: {'class': 'col'},
  templateUrl: './sunmoon.component.html',
  styleUrl: './sunmoon.component.css'
})
export class SunmoonComponent implements OnInit {
  currentWeather: WeatherData;
  weatherService: WeatherService = inject(WeatherService);
  fmt: FormatService = inject(FormatService);
  sunLeft = '';
  sunPerc = 0;
  moonLeft = '';
  moonPerc = 0;
  config: Config;
  locale: Locale;

  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
    configService.getLocale().subscribe(locale => this.locale = locale);
  }

  ngOnInit(): void {
      this.weatherService.getCurrent().subscribe(currentWeather => {
        this.currentWeather = currentWeather;
      });
      setInterval(() => this.updateLefts(), 1000);
  }
  
  getDuration(from: Date, to: Date): string {
    if(!from || !to) return '&nbsp;';
    if(from.getTime() > to.getTime()) return this.fmt.duration(to, from, DurationType.Short);
    return this.fmt.duration(from, to, DurationType.Short);
  }

  private updateLefts(){
    if(!this.currentWeather) return;

    const cur = Date.now();

    this.sunPerc = calcPerc(this.currentWeather.sunrise, this.currentWeather.sunset);
    this.sunLeft = this.fmt.left(this.currentWeather.sunset);
    
    if(this.currentWeather.moonrise.getTime() > this.currentWeather.moonset.getTime()){
      this.moonPerc = calcPerc(this.currentWeather.moonset, this.currentWeather.moonrise);
      this.moonLeft = this.fmt.left(this.currentWeather.moonrise);
    } else {
      this.moonPerc = calcPerc(this.currentWeather.moonrise, this.currentWeather.moonset);
      this.moonLeft = this.fmt.left(this.currentWeather.moonset);
    }

    function calcPerc(rise: Date, set: Date): number {
      return Math.min((cur - rise.getTime()) / (set.getTime() - rise.getTime()) * 100, 100);
    }
  }
}
