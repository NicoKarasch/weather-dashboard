import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config, ConfigService } from '../config.service';
import { FormatService } from '../format.service';

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
  fmt: FormatService = inject(FormatService);
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
