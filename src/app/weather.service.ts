import { Injectable } from '@angular/core';
import { WeatherData } from './weatherdata';
import { Subject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private url = 'https://api.openweathermap.org/data/3.0/onecall?lat=52.459246596015404&lon=13.314200259118788&units=metric&lang=de&exclude=minutely&appid=92bf13ee6f955aac34d8f9be4c88777a';
  private testdata = '/assets/testdata.json';

  private current: Subject<WeatherData> = new Subject;
  private lastTemp: number = 0;
  private daily: WeatherData[] = [];

  constructor(){
    this.fetchData();
  }

  private async fetchData() {
    fetch(this.testdata)
      .then(response => response.json())
      .then(json => {
        this.daily = [];
        json.daily.forEach((day: any) => {
          this.daily.push({
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
            pop: day.pop,
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
    
        const current = structuredClone(this.daily[0]);
        current.clouds = json.current.clouds;
        current.description = json.current.weather[0].description;
        current.dewPoint = json.current.dew_point;
        current.feelsLike = json.current.feels_like;
        current.humidity = json.current.humidity;
        current.icon = json.current.weather[0].icon;
        current.pressure = json.current.pressure;
        current.temperature = json.current.temp;
        current.timeStamp = new Date();
        current.uVIndex = json.current.uvi;
        current.visibility = json.current.visibility / 1000,
        current.windDirection = json.current.wind_deg;
        current.windSpeed = json.current.wind_speed;
    
        this.current.next(current);
    
        setTimeout(() => this.fetchData(), 60*60*1000);
      });
  }


  getCurrent(): Subject<WeatherData> {
    return this.current;
  }

}