import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  date = new Date;

  ngOnInit(): void {
    setInterval(() => this.date = new Date, 1000);
  }
}
