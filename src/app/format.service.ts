import { Injectable } from '@angular/core';
import { Config, ConfigService, Locale } from './config.service';
import { DateTime, Interval, Settings } from 'luxon';

@Injectable({
  providedIn: 'root'
})
export class FormatService {
  private config: Config;
  private locale: Locale;
  private nbrFmt: Intl.NumberFormat;
  private precFmt: Intl.NumberFormat;

  constructor(configService: ConfigService){
    configService.get().subscribe(config => {
      this.config = config
      Settings.defaultLocale = config.language;
      this.nbrFmt = new Intl.NumberFormat(config.language);
      this.precFmt = new Intl.NumberFormat(config.language, {maximumFractionDigits: 1});
    });
    configService.getLocale().subscribe(locale => this.locale = locale);
  }

  time(date: Date, seconds = false): string {
    return this.fmt(date, seconds ? DateTime.TIME_WITH_SECONDS : DateTime.TIME_SIMPLE);
  }
  date(date: Date, full = false): string {
    return this.fmt(date, full ? DateTime.DATE_HUGE : {month:'short',day:'numeric'});
  }
  weekday(date: Date): string {
    return this.fmt(date, {weekday:'long'});
  }
  today(): string {
    return DateTime.now().toRelativeCalendar();
  }
  duration(from: Date, to: Date, type: DurationType): string {
    if(to < from) return '';
    const interval = Interval.fromDateTimes(from, to);
    switch(type){
      case DurationType.Numeric:
        return interval.toDuration().toFormat('hh:mm:ss');
      case DurationType.Short:
        return interval.toDuration(['hours', 'minutes']).toHuman({ unitDisplay: "short", maximumFractionDigits: 0 });
      case DurationType.Full:
        const now = new Date();
        let left='';
        if(to < now){
          left = this.locale.expired;
        }else if(from < now){
          left = this.locale.left + ' ' + this.duration(now, to, DurationType.Short);
        }else{
          left = this.locale.in + ' ' + this.duration(now, from, DurationType.Short) + ', ' + this.locale.for + ' ' + this.duration(from, to, DurationType.Short);
        }
        return interval.toLocaleString(DateTime.TIME_SIMPLE) + ' (' + left + ')';
    }
    return '?';
  }
  left(date: Date): string {
    return this.duration(new Date(), date, DurationType.Numeric);
  }
  wind(speed: number): string {
    return this.round(speed*3.6) + ' km/h';
  }
  temp(temp: number): string {
    return this.round(temp) + ' °C';
  }
  visibility(distance: number | undefined): string {
    return distance ? this.round(distance) + ' km' : '?';
  }
  rain(amount: number): string {
    return this.precFmt.format(amount) + ' mm';
  }
  snow(amount: number): string {
    return this.precFmt.format(amount/10.0) + ' cm';
  }
  nbr(nbr: number): string {
    return this.nbrFmt.format(nbr);
  }

  round(nbr: number): number {
    return Math.round(nbr);
  }

  private fmt(date: Date, format: Intl.DateTimeFormatOptions): string {
    return DateTime.fromJSDate(date).toLocaleString(format);
  }
}

export enum DurationType {
  /**
   * like '12:14:20'
   */
  Numeric,
  /**
   * like '2 hrs. 14 min.'
   */
  Short,
  /**
   * like 'from - to (in 2 hours, for 12 hours)'
   */
  Full
}