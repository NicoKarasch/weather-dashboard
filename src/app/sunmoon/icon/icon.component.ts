import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  host: {'class': 'text-center'},
  template: '<img src="assets/{{icon}}.svg" height="80" style="margin: -10px; margin-bottom: -18px;"><br>{{date.getTime() > 0 ? (date | date:"HH:mm") : "?"}}'
})
export class IconComponent {
  @Input({ required: true }) icon = '';
  @Input({ required: true }) date = new Date;
}