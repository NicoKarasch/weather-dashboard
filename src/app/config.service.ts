import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$: Observable<Config>;

  constructor(private http: HttpClient) { }

  public get(): Observable<Config> {
    if(!this.config$){
      this.config$ = this.http.get<Config>('assets/config.json').pipe(shareReplay(1));
    }
    return this.config$;
  }
}

export interface Config {
  darkMode: boolean
  location: string
  updateInterval: number
  openweathermap: Openweathermap
  alerts: Alerts
  current: Current
  sunMoon: SunMoon
  clock: Clock
  hourly: Hourly
  daily: Daily
}

export interface Openweathermap {
  appid: string
  lat: number
  lon: number
}

export interface Alerts {
  show: boolean
}

export interface Current {
  showWind: boolean
  showHumidity: boolean
  showPressure: boolean
  showDewPoint: boolean
  showClouds: boolean
  showUVIndex: boolean
  showVisibility: boolean
}

export interface SunMoon {
  show: boolean
}

export interface Clock {
  show: boolean
  showAnalogClock: boolean
  showSeconds: boolean
  showDate: boolean
}

export interface Hourly {
  show: boolean
  hours: number
  windSpeed: WindSpeed
  showPrecipitation: boolean
  showPop: boolean
}

export interface WindSpeed {
  show: boolean
  showWindDirection: boolean
}

export interface Daily {
  show: boolean
  days: number,
  showLegendLeft: boolean
  showLegendRight: boolean
  showMoonPhase: boolean
  showWind: boolean
  showHumidity: boolean
  showPrecipitation: boolean
  showSun: boolean
  showMoon: boolean
  showPressure: boolean
  showDewPoint: boolean
  showClouds: boolean
  showUVIndex: boolean
}
