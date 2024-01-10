import { Component, inject } from '@angular/core';
import { WeatherService, Status } from '../weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status.component.html'
})
export class StatusComponent {
  weatherService: WeatherService = inject(WeatherService);
  states = Status;
  status: Status;

  ngOnInit(): void {
    this.weatherService.getStatus().subscribe(status => this.status = status);
  }
}
