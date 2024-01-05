import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { Alert } from '../alert';
import { Config, ConfigService } from '../config.service';
import { DurationType, FormatService } from '../format.service';

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
  fmt: FormatService = inject(FormatService);
  config: Config;
  
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
    this.alerts.forEach(alert => this.times.push(this.fmt.duration(alert.start, alert.end, DurationType.Full)));
  }
}