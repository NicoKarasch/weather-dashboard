export interface WeatherData {
    timeStamp: Date;
    sunrise: Date;
    sunset: Date;
    moonrise: Date;
    moonset: Date;
    moonPhase: number;
    summary: string;
    temperature: number;
    minTemperature: number;
    feelsLike: number;
    pressure: number;
    humidity: number;
    dewPoint: number;
    windSpeed: number;
    windDirection: number;
    icon: string;
    description: string;
    clouds: number;
    uVIndex: number;
    pop: number; // Probability of precipitation
    rain: number;
    snow: number;
    visibility: number | undefined;
}