import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { WeatherData } from '../weatherdata';
import { IconComponent } from './icon/icon.component';
import { Config, ConfigService, Locale } from '../config.service';

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
  sunLeft = '';
  sunPerc = 0;
  moonLeft = '';
  moonPerc = 0;
  dateFmt: Intl.DateTimeFormat;
  config: Config;
  locale: Locale;
  private static timeFmt: Intl.DateTimeFormat
  private minStr: string;
  private hrStr: string;

  constructor(configService: ConfigService){
    configService.get().subscribe(config => {
      this.config = config;
      this.dateFmt = new Intl.DateTimeFormat(config.language, {month:'short',day:'numeric'});
      SunmoonComponent.timeFmt =  new Intl.DateTimeFormat(config.language, {timeStyle:'medium'});
      const rel = new Intl.RelativeTimeFormat(config.language, { style: 'short' });
      this.minStr = rel.formatToParts(0, 'minute')[2].value;
      this.hrStr = rel.formatToParts(0, 'hour')[2].value;
    });
    configService.getLocale().subscribe(locale => this.locale = locale);
  }

  ngOnInit(): void {
      this.weatherService.getCurrent().subscribe(currentWeather => {
        this.currentWeather = currentWeather;
      });
      setInterval(() => this.updateLefts(), 1000);
  }
  
  /*static*/ getDateDiff(d1: Date, d2: Date): string {
    const d1t = d1.getTime();
    const d2t = d2.getTime();
    if(d1t === 0 || d2t === 0) return '?'; //Sometimes moonset is unknown?
    const diff = new Date(d1t < d2t ? d2t - d1t : d1t - d2t);
    return diff.getHours()+diff.getTimezoneOffset()/60 + this.hrStr +' ' + diff.getMinutes() + this.minStr;
  }

  private updateLefts(){
    if(!this.currentWeather) return;

    const cur = Date.now();

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
      return Math.min((cur - rise.getTime()) / (set.getTime() - rise.getTime()) * 100, 100);
    }
    function calcLeft(set: Date): string {
      if(set.getTime() == 0) return ""; //Sometimes moonset is unknown

      const diff = new Date(set.getTime() - cur + set.getTimezoneOffset()*60*1000);
      console
      return diff.getTime() > 0 ? SunmoonComponent.timeFmt.format(diff) : "";
    }
  }
}
