import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config, ConfigService } from '../config.service';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css',
  host: { 'class': 'col-2' }
})
export class ClockComponent implements OnInit {
  config: Config;
  dateFmt: Intl.DateTimeFormat;
  timeFmt: Intl.DateTimeFormat;
  date = new Date;

  constructor(configService: ConfigService){
    configService.get().subscribe(config => {
      this.config = config;
      this.dateFmt = new Intl.DateTimeFormat(undefined, {dateStyle: 'full'});
      this.timeFmt = new Intl.DateTimeFormat(undefined, {timeStyle: config.clock.showSeconds ? 'medium' : 'short'});
    });
  }

  ngOnInit(): void {
    if(this.config.clock.show){
      setInterval(() => this.date = new Date, 1000);
    }
  }
}
