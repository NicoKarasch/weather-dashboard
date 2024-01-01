import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { Alert } from '../alert';
import moment from 'moment';
import 'moment/min/locales';
import { Config, ConfigService } from '../config.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];
  times: String[] = [];
  intervalId: any = -1;
  weatherService: WeatherService = inject(WeatherService);
  config: Config;
  
  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    if(this.config.alerts.show){
      moment.locale('de');
      this.weatherService.getAlerts().subscribe(alerts => {
          this.alerts = alerts;
          clearInterval(this.intervalId);
          this.updateTimes();
          this.intervalId = setInterval(() => this.updateTimes(), 1000);
        });
    }

  }

  getIcon(tags: string[]): string {
    let icon = "alert";
    tags.reverse().forEach(tag => {
      switch(tag.toLowerCase()){
        case "wind":
        case "thunderstorm":
          icon = "windsock";
          break;
        case "rain": icon = "raindrops"; break;
        case "thunder": icon = "lightning-bolt"; break;
      }
    });
    return icon;
  }

  updateTimes(): void {
    this.times = [];
    this.alerts.forEach(alert => {
      const start = moment(alert.start);
      const end = moment(alert.end);
      let span: string;
      if(end.isBefore()){
        span = 'abgelaufen';
      }else{
        span = start.isAfter() ? start.fromNow() + ', für ' + start.to(end, true) : 'noch ' + end.toNow(true);
      }
      this.times.push(start.calendar() + ' bis ' + end.calendar() + ' (' + span + ')');
    });
  }
}