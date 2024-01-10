import { Injectable } from '@angular/core';
import { WeatherData } from './weatherdata';
import { Alert } from './alert';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfigService, Config, Locale } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private url: string;
  private testdata = '/assets/testdata.json';
  private config: Config;
  private locale: Locale;

  private current: Subject<WeatherData> = new Subject;
  private hourly: Subject<WeatherData[]> = new Subject;
  private daily: Subject<WeatherData[]> = new Subject;
  private alerts: Subject<Alert[]> = new Subject;
  private status = new BehaviorSubject<Status>(Status.Uninitialized);
  private error: Error;

  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
    configService.getLocale().subscribe(locale => this.locale = locale);
    this.url = `https://api.openweathermap.org/data/3.0/onecall?lat=${this.config.openweathermap.lat}&lon=${this.config.openweathermap.lon}&units=metric&lang=${this.config.language}&exclude=minutely&appid=${this.config.openweathermap.appid}`;
    this.fetchData();
  }

  private async fetchData() {
    fetch(this.url)
      .then(response => response.json())
      .then(json => {
        const daily: WeatherData[] = [];
        json.daily.forEach((day: any) => {
          daily.push({
            clouds: day.clouds,
            description: day.weather[0].description,
            dewPoint: day.dew_point,
            feelsLike: day.feels_like.day,
            humidity: day.humidity,
            icon: day.weather[0].icon,
            minTemperature: day.temp.min,
            moonPhase: day.moon_phase,
            moonrise: new Date(day.moonrise*1000),
            moonset: new Date(day.moonset*1000),
            pop: day.pop * 100,
            rain: day.rain,
            snow: day.snow,
            pressure: day.pressure,
            summary: day.summary,
            sunrise: new Date(day.sunrise*1000),
            sunset: new Date(day.sunset*1000),
            temperature: day.temp.day,
            timeStamp: new Date(day.dt*1000),
            uVIndex: day.uvi,
            visibility: undefined,
            windDirection: day.wind_deg,
            windSpeed: day.wind_speed
          });
        });
        this.daily.next(daily);

        const hourly: WeatherData[] = [];
        json.hourly.forEach((hour: any) => {
          hourly.push({
            ...daily[0],
            clouds: hour.clouds,
            description: hour.weather[0].description,
            dewPoint: hour.dew_point,
            feelsLike: hour.feels_like.day,
            humidity: hour.humidity,
            icon: hour.weather[0].icon,
            pop: hour.pop * 100,
            pressure: hour.pressure,
            temperature: hour.temp,
            timeStamp: new Date(hour.dt*1000),
            uVIndex: hour.uvi,
            visibility: hour.visibility,
            windDirection: hour.wind_deg,
            windSpeed: hour.wind_speed,
            rain: hour.rain ? hour.rain['1h'] : undefined,
            snow: hour.snow ? hour.snow['1h'] : undefined
          });
        });
        this.hourly.next(hourly);
    
        const current: WeatherData = {
          ...daily[0],
          clouds: json.current.clouds,
          description: json.current.weather[0].description,
          dewPoint: json.current.dew_point,
          feelsLike: json.current.feels_like,
          humidity: json.current.humidity,
          icon: json.current.weather[0].icon,
          pressure: json.current.pressure,
          temperature: json.current.temp,
          timeStamp: new Date(json.current.dt*1000),
          uVIndex: json.current.uvi,
          visibility: json.current.visibility / 1000,
          windDirection: json.current.wind_deg,
          windSpeed: json.current.wind_speed
        }
    
        this.current.next(current);

        const alerts: Alert[] = [];
        json.alerts?.forEach((alert: any) => {
          alert.tags.push(alert.event); //Treat event name as tag too
          alerts.push({
            from: alert.sender_name,
            message: alert.description,
            start: new Date(alert.start * 1000),
            end: new Date(alert.end * 1000),
            tags: alert.tags
          })
        });
        this.alerts.next(alerts);

        this.status.next(Status.Initialized);
    
      })
      .catch(error => {
        this.error = error;
        this.status.next(this.status.getValue() == Status.Uninitialized ? Status.InitError : Status.Error);
      }).finally(() => setTimeout(() => this.fetchData(), this.config.updateInterval*60*1000));
  }


  getCurrent(): Subject<WeatherData> {
    return this.current;
  }

  getHourly(): Subject<WeatherData[]> {
    return this.hourly;
  }

  getDaily(): Subject<WeatherData[]> {
    return this.daily;
  }

  getAlerts(): Subject<Alert[]> {
    return this.alerts;
  }

  getStatus(): BehaviorSubject<Status> {
    return this.status;
  }
  getError(): Error {
    return this.error;
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

  getWindDirection(deg: number): string {
    if(deg <= 22.5)       return this.locale.wind_n;
    if(deg <= 45 + 22.5)  return this.locale.wind_n + this.locale.wind_e;
    if(deg <= 90 + 22.5)  return this.locale.wind_e;
    if(deg <= 135 + 22.5) return this.locale.wind_s + this.locale.wind_e;
    if(deg <= 180 + 22.5) return this.locale.wind_s;
    if(deg <= 225 + 22.5) return this.locale.wind_s + this.locale.wind_w;
    if(deg <= 270 + 22.5) return this.locale.wind_w;
    if(deg <= 315 + 22.5) return this.locale.wind_n + this.locale.wind_w;
    return this.locale.wind_n;
  }

  
  /*static*/ getMoonIcon(phase: number): string {
    if(phase == 0)   return 'new';
    if(phase < .25)  return 'waxing-crescent';
    if(phase == .25) return 'first-quarter';
    if(phase < .5)   return 'waxing-gibbous';
    if(phase == .5)  return 'full';
    if(phase < .75)  return 'waning-gibbous';
    if(phase == .75) return 'last-quarter';
    if(phase < 1)    return 'waning-crescent';
    return 'new';
  }

  getMoonPhase(phase: number): string {
    if(phase == 0)   return this.locale.moon_new;
    if(phase < .25)  return this.locale.moon_waxingCrescent;
    if(phase == .25) return this.locale.moon_firstQuarter;
    if(phase < .5)   return this.locale.moon_waxingGibbous;
    if(phase == .5)  return this.locale.moon_full;
    if(phase < .75)  return this.locale.moon_waningGibbous;
    if(phase == .75) return this.locale.moon_lastQuarter;
    if(phase < 1)    return this.locale.moon_waningCrescent;
    return this.locale.moon_new;
  }
}

export enum Status {
  Uninitialized, InitError, Initialized, Error
}