import {WeatherResponse} from "../model/types";

export async function fetchWeatherData(lat: number, long: number): Promise<WeatherResponse> {
  const res = await fetch(`/api/getWeatherData?lat=${lat}&long=${long}`);

  if (!res.ok) {
    const errorMsg = "API routes의 /api/getWeatherData 호출 실패";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const data: WeatherResponse = await res.json();

  console.log("Fetched weather data:", data);

  return data;
}
