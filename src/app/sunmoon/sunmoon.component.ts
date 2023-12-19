import { Component, inject, OnInit } from '@angular/core';
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
  styleUrl: './sunmoon.component.css'
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
      console.log(currentWeather);
    });
    setInterval(() => this.updateLefts(), 1000);
  }
  
  getDateDiff(d1: Date, d2: Date): string {
    let dur = moment.duration(moment(d2).diff(d1));
    return moment.utc(dur.asMilliseconds()).format('H [Std.] m [Min.]');
  }

  getMoonIcon(phase: number): string {
    if(phase == 0)   return "new";
    if(phase < .25)  return "waxing-crescent";
    if(phase == .25) return "first-quarter";
    if(phase < .5)   return "waxing-gibbous";
    if(phase == .5)  return "full";
    if(phase < .75)  return "waning-gibbous";
    if(phase == .75) return "last-quarter";
    if(phase < 1)    return "waning-crescent";
    return "new";
  }

  getMoonPhase(phase: number): string {
    if(phase == 0)   return "Neumond";
    if(phase < .25)  return "zunehmende Sichel";
    if(phase == .25) return "zunehmender Halbmond";
    if(phase < .5)   return "zweites Viertel";
    if(phase == .5)  return "Vollmond";
    if(phase < .75)  return "drittes Viertel";
    if(phase == .75) return "abnehmender Halbmond";
    if(phase < 1)    return "abnehmende Sichel";
    return "Neumond";
  }

  private updateLefts(){
    if(!this.currentWeather) return;

    const cur = moment();

    this.moonPerc = calcPerc(this.currentWeather.moonrise, this.currentWeather.moonset);
    this.moonLeft = calcLeft(this.currentWeather.moonset);
    this.sunPerc = calcPerc(this.currentWeather.sunrise, this.currentWeather.sunset);
    this.sunLeft = calcLeft(this.currentWeather.sunset);

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
