import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { Alert } from '../alert';
import { Config, ConfigService, Locale } from '../config.service';

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
  private locale: Locale;
  rangeFmt: Intl.DateTimeFormat;
  relTimeFmt: Intl.RelativeTimeFormat;
  
  constructor(configService: ConfigService){
    configService.get().subscribe(config => {
      this.config = config;
      this.rangeFmt = new Intl.DateTimeFormat(config.language, {timeStyle:'short'});
      this.relTimeFmt = new Intl.RelativeTimeFormat(config.language);
    });
    configService.getLocale().subscribe(locale => this.locale = locale);
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
        case "frost": 
        case "icy surfaces": 
          icon = "snowflake";
          break;
        case 'snow/ice':
          icon = 'snow';
      }
    });
    return icon;
  }

  updateTimes(): void {
    this.times = [];
    this.alerts.forEach(alert => {
      let span: string;
      const now = Date.now();
      if(alert.end.getTime() < now){
        span = this.locale.expired;
      }else{
        span = alert.start.getTime() > now ? this.locale.in + ' ' + this.getSpan(alert.start, new Date) + ', ' + this.locale.for + ' ' + this.getSpan(alert.end, alert.start) : this.locale.left + ' ' + this.getSpan(alert.end);
      }
      this.times.push(this.rangeFmt.formatRange(alert.start, alert.end) + ' (' + span + ')');
    });
  }
  private getSpan(from: Date, to = new Date): string {
    const span = from.getTime() - to.getTime();
    const parts = Math.abs(span) < 1000*60*60 ? this.relTimeFmt.formatToParts(Math.ceil(span/1000/60), 'minute') : this.relTimeFmt.formatToParts(Math.round(span/1000/60/60), 'hour');
    console.log(parts);
    return parts[1].value + parts[2].value;
  }
}