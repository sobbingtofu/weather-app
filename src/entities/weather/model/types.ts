// Using Type Guards/Interfaces for domain models
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface NcstItem {
  baseDate: string;
  baseTime: string;
  category: string; // T1H, PTY, REH, RN1 etc.
  nx: number;
  ny: number;
  obsrValue: string;
}

export interface FcstItem {
  baseDate: string;
  baseTime: string;
  category: string; // TMP, UUU, VVV, TMN, TMX etc.
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
  nx: number;
  ny: number;
}

export interface HourlyForecast {
  time: string;
  temp: string;
  date: string;
}

export interface WeatherResponse {
  currentTemperature: string | null;
  minTemperature: string | null;
  maxTemperature: string | null;
  hourlyForecast: HourlyForecast[];
}
