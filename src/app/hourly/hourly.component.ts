import { Component, Inject, LOCALE_ID, OnInit, inject } from '@angular/core';
import { formatNumber, formatDate } from '@angular/common';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { WeatherData } from '../weatherdata';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-hourly',
  standalone: true,
  imports: [],
  templateUrl: './hourly.component.html',
  styleUrl: './hourly.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'de-DE' }    
  ] 
})
export class HourlyComponent implements OnInit {
  weather: WeatherData[] = [];
  weatherService: WeatherService = inject(WeatherService);
  public chart: any;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    Chart.register(annotationPlugin);
    Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    Chart.defaults.font.size = 14;
  }
  
  ngOnInit(): void {
    this.weatherService.getHourly().subscribe(weather => {
      this.weather = weather;
      this.createChart();
    });
  }

  createChart(): void {
    const data: number[] = [];
    const annots: any[]  = [];
    this.weather.slice(0, 24).forEach((hour, index) => {
      data.push(hour.temperature);
      annots.push({
        type: 'label',
        content: this.getImage(hour.icon),
        width: 50,
        height: 50,
        xValue: index,
        yValue: hour.temperature,
        yAdjust: -45
      })
    });
    this.chart?.destroy();
    
    this.chart = new Chart("HourChart", {
      type: 'line',
      data: {
        labels: data, 
	       datasets: [
          {
            tension: 0.4,
            data: data,
            datalabels: {
              align: 'end'
            },
            backgroundColor: '#0d6efd66',
            borderColor: '#0d6efd',
            fill: 'origin'
          }
        ]
      },
      plugins: [ChartDataLabels],
      options: {
        layout: {
          padding: 10
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            position: 'top',
            ticks: {
              callback: (val, index) => {
                return formatDate(this.weather[index].timeStamp, 'shortTime', this.locale);
              }
            }
          },
          info: {
            position: 'bottom',
            ticks: {
              callback: (val, index) => {
                const hour = this.weather[index];
                let pop = '';
                if(hour.rain){
                  pop = formatNumber(hour.rain, this.locale, '1.1-1') + ' mm';
                }
                if(hour.snow){
                  pop += hour.rain ? ' / ' : '';
                  pop += formatNumber(hour.snow/10, this.locale, '1.1-1') + ' cm';
                }
                if(!pop) {
                  pop = '--';
                }
                return [
                  formatNumber(hour.windSpeed*3.6, this.locale, '1.0-0')  + ' km/h (' + this.weatherService.getWindDirection(hour.windDirection) + ')',
                  pop,
                  formatNumber(hour.pop, this.locale, '1.0-0') + ' %'
                ];
              }
            }
          },
          y: {
            display: false,
            max: Math.max(...data)+5,
            min: Math.min(...data)-1
          }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
              enabled: false
            },
            datalabels: {
              color: 'black',
              font: {
                weight: 'bold',
                size: 16
              },
              formatter: (val) => { return formatNumber(val, this.locale, '1.0-0') + ' °C' }
            },
            annotation: {
              annotations: annots,
              clip: false
              }
            }
      }
    });
  }

  private getImage(icon: String): HTMLImageElement {
    const img = new Image(30,30);
    img.src = 'assets/icons/openweathermap/' + icon + '.svg';
    return img;
  }
}
