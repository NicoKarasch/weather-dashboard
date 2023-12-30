import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config$: Observable<Config>;

  constructor(private http: HttpClient) { }

  public get(): Observable<Config> {
    if(!this.config$){
      this.config$ = this.http.get<Config>('assets/config.json').pipe(shareReplay(1));
    }
    return this.config$;
  }
}

export interface Config {
  darkMode: boolean;
  location: string;
  openweathermap: {
    appid: string;
    lat: number;
    lng: number;
  }
}