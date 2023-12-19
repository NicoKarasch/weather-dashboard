import { Component, Input } from '@angular/core';

@Component({
  selector: 'current-detail',
  standalone: true,
  host: {'class': 'col text-center'},
  template: '<img src="assets/{{icon}}.svg" height="40"><br><small>{{name}}<br><b>{{value}}</b><ng-content></ng-content></small>'
})
export class DetailComponent {
  @Input({ required: true }) name = '';
  @Input({ required: true }) value = '';
  @Input({ required: true }) icon = '';
}
