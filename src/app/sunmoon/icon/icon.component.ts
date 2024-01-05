import { Component, Input, inject } from '@angular/core';
import { FormatService } from '../../format.service';

@Component({
  selector: 'app-icon',
  standalone: true,
  host: {'class': 'text-center'},
  template: '<img src="assets/icons/{{icon}}.svg" height="80" style="margin: -10px; margin-bottom: -18px;"><br>{{date.getTime() > 0 ? (fmt.time(date)) : "?"}}'
})
export class IconComponent {
  @Input({ required: true }) icon: string;
  @Input({ required: true }) date: Date;

  fmt: FormatService = inject(FormatService);
}