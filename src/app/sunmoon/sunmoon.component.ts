import { Component, inject, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';
import moment from 'moment';
import { IconComponent } from './icon/icon.component';

@Component({
  selector: 'app-sunmoon',
  standalone: true,
  imports: [CommonModule, IconComponent],
  host: {'class': 'col'},
  templateUrl: './sunmoon.component.html',
  styleUrl: './sunmoon.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }    
  ] 
})
export class SunmoonComponent implements OnInit {
  currentWeather: WeatherData | undefined;
  weatherService: WeatherService = inject(WeatherService);
  sunLeft = "";
  sunPerc = 0;
  moonLeft = "";
  moonPerc = 0;

  ngOnInit(): void {
      this.weatherService.getCurrent().subscribe(currentWeather => {
        this.currentWeather = currentWeather;
      });
      setInterval(() => this.updateLefts(), 1000);
  }
  
  getDateDiff(d1: Date, d2: Date): string {
    const dur = d1.getTime() < d2.getTime() ? moment.duration(moment(d2).diff(d1)) : moment.duration(moment(d1).diff(d2));
    return moment.utc(dur.asMilliseconds()).format('H [Std.] m [Min.]');
  }

  private updateLefts(){
    if(!this.currentWeather) return;

    const cur = moment();

    this.sunPerc = calcPerc(this.currentWeather.sunrise, this.currentWeather.sunset);
    this.sunLeft = calcLeft(this.currentWeather.sunset);
    if(this.currentWeather.moonrise.getTime() > this.currentWeather.moonset.getTime()){
      this.moonPerc = calcPerc(this.currentWeather.moonset, this.currentWeather.moonrise);
      this.moonLeft = calcLeft(this.currentWeather.moonrise);
    }else{
      this.moonPerc = calcPerc(this.currentWeather.moonrise, this.currentWeather.moonset);
      this.moonLeft = calcLeft(this.currentWeather.moonset);
    }

    function calcPerc(rise: Date, set: Date): number {
      return Math.min((cur.valueOf() - rise.getTime()) / (set.getTime() - rise.getTime()) * 100, 100);
    }
    function calcLeft(set: Date): string {
      if(set.getTime() == 0) return ""; //Sometimes moonset is unknown

      const diff = moment(set).diff(cur);
      return diff > 0 ? moment.utc(diff).format('HH:mm:ss') : "";
    }
  }
}
