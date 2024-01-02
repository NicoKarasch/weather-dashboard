import { Component, OnInit, inject } from '@angular/core';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import annotationPlugin from 'chartjs-plugin-annotation';
import { WeatherData } from '../weatherdata';
import { WeatherService } from '../weather.service';
import { Config, ConfigService } from '../config.service';

@Component({
  selector: 'app-hourly',
  standalone: true,
  imports: [],
  templateUrl: './hourly.component.html',
  styleUrl: './hourly.component.css'
})
export class HourlyComponent implements OnInit {
  weather: WeatherData[] = [];
  weatherService: WeatherService = inject(WeatherService);
  public chart: any;
  config: Config;
  timeFmt = new Intl.DateTimeFormat(undefined, {timeStyle:'short'});
  precFmt = new Intl.NumberFormat(undefined, {maximumFractionDigits: 1});

  constructor(configService: ConfigService) {
    Chart.register(annotationPlugin);
    Chart.defaults.font.family = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
    Chart.defaults.font.size = 14;
    configService.get().subscribe(config => this.config = config);
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
    this.weather.slice(0, this.config.hourly.hours).forEach((hour, index) => {
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
                return this.timeFmt.format(this.weather[index].timeStamp);
              }
            }
          },
          info: {
            position: 'bottom',
            ticks: {
              callback: (val, index) => {
                const hour = this.weather[index];
                
                const rtn: string[] = [];
                if(this.config.hourly.windSpeed.show){
                  rtn.push(Math.round(hour.windSpeed*3.6)  + ' km/h' + (this.config.hourly.windSpeed.showWindDirection ? ' (' + this.weatherService.getWindDirection(hour.windDirection) + ')' : ''));
                }
                if(this.config.hourly.showPrecipitation){
                  let precip = '';
                  if(hour.rain){
                    precip = this.precFmt.format(hour.rain) + ' mm';
                  }
                  if(hour.snow){
                    precip += hour.rain ? ' / ' : '';
                    precip += this.precFmt.format(hour.snow/10) + ' cm';
                  }
                  rtn.push(precip ? precip : '--');
                }
                if(this.config.hourly.showPop){
                  rtn.push(Math.round(hour.pop) + ' %');
                }
                return rtn;
              }
            }
          },
          y: {
            display: false,
            max: Math.max(...data)+(Math.max(...data)-Math.min(...data))*.4,
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
              color: this.config.darkMode ? '#dee2e6' : 'black',
              font: {
                weight: 'bold',
                size: 16
              },
              formatter: (val) => { return Math.round(val) + ' °C' }
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
