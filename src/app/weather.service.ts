import { Injectable } from '@angular/core';
import { WeatherData } from './weatherdata';
import { Alert } from './alert';
import { Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private url = 'https://api.openweathermap.org/data/3.0/onecall?lat=52.459246596015404&lon=13.314200259118788&units=metric&lang=de&exclude=minutely&appid=92bf13ee6f955aac34d8f9be4c88777a';
  private testdata = '/assets/testdata.json';

  private current: Subject<WeatherData> = new Subject;
  private hourly: Subject<WeatherData[]> = new Subject;
  private daily: Subject<WeatherData[]> = new Subject;
  private alerts: Subject<Alert[]> = new Subject;

  constructor(){
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
            rain: hour.rain ? hour.rain["1h"] : undefined,
            snow: hour.snow ? hour.snow["1h"] : undefined
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
          alerts.push({
            from: alert.sender_name,
            message: alert.description,
            start: new Date(alert.start * 1000),
            end: new Date(alert.end * 1000),
            tags: alert.tags
          })
        });
        this.alerts.next(alerts);
    
        setTimeout(() => this.fetchData(), 30*60*1000);
      });
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
    if(deg <= 22.5)       return 'N';
    if(deg <= 45 + 22.5)  return 'NO';
    if(deg <= 90 + 22.5)  return 'O';
    if(deg <= 135 + 22.5) return 'SO';
    if(deg <= 180 + 22.5) return 'S';
    if(deg <= 225 + 22.5) return 'SW';
    if(deg <= 270 + 22.5) return 'W';
    if(deg <= 315 + 22.5) return 'NW';
    return 'N';
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
}