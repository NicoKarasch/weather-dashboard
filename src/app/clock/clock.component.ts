import { Component, LOCALE_ID, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config, ConfigService } from '../config.service';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.css',
  host: { 'class': 'col-2' },
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }    
  ] 
})
export class ClockComponent implements OnInit {
  config: Config;
  date = new Date;

  constructor(configService: ConfigService){
    configService.get().subscribe(config => this.config = config);
  }

  ngOnInit(): void {
    if(this.config.clock.show){
      setInterval(() => this.date = new Date, 1000);
    }
  }
}
