import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { Alert } from '../alert';
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
  dateFmt = new Intl.DateTimeFormat(undefined, {timeStyle:'medium'});
  relTimeFmt = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  
  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    if(this.config.alerts.show){
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
      // const start = moment(alert.start);
      // const end = moment(alert.end);
      let span: string;
      const now = Date.now();
      if(alert.end.getTime() < now){
        span = 'abgelaufen';
      }else{
        span = alert.start.getTime() > now ? 'in ' + this.getSpan(new Date, alert.start) + ', für ' + this.getSpan(alert.start, alert.end) : 'noch ' + this.getSpan(alert.end);
      }
      this.times.push(this.dateFmt.format(alert.start) + ' bis ' + this.dateFmt.format(alert.end) + ' (' + span + ')');
    });
  }
  private getSpan(from: Date, to = new Date): string {
    const span = from.getTime() - to.getTime();
    const parts = Math.abs(span) < 1000*60*60 ? this.relTimeFmt.formatToParts(Math.round(span/1000/60), 'minute') : this.relTimeFmt.formatToParts(Math.round(span/1000/60/60), 'hour');
    return parts[1].value + parts[2].value;
  }
}