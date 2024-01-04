import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$: Observable<Config>;
  private locale$: Observable<Locale>;
  private language = 'en';

  constructor(private http: HttpClient) { }

  public get(): Observable<Config> {
    if(!this.config$){
      this.config$ = this.http.get<Config>('assets/config.json').pipe(shareReplay(1));
      this.config$.subscribe(config => this.language = config.language);
    }
    return this.config$;
  }

  public getLocale(): Observable<Locale> {
    if(!this.locale$){
      this.locale$ = this.http.get<Locale>('assets/locale/' + this.language + '.json').pipe(shareReplay(1));
    }
    return this.locale$;
  }
}

export interface Config {
  darkMode: boolean
  language: string
  location: string
  updateInterval: number
  openweathermap: Openweathermap
  alerts: Alerts
  current: Current
  sunMoon: SunMoon
  clock: Clock
  hourly: Hourly
  daily: Daily
  locale: Locale
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

export interface Locale {
  feelsLike: string
  wind: string
  pressure: string
  humidity: string
  dewPoint: string
  clouds: string
  uVIndex: string
  visibility: string
  sunMoon: string
  moon_new: string
  moon_waxingCrescent: string
  moon_firstQuarter: string
  moon_waxingGibbous: string
  moon_full: string
  moon_waningGibbous: string
  moon_lastQuarter: string
  moon_waningCrescent: string
  wind_n: string
  wind_e: string
  wind_s: string
  wind_w: string
  expired: string
  left: string
  in: string
  for: string
}