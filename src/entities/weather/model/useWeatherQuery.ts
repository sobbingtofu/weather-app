import {useQuery} from "@tanstack/react-query";
import {fetchWeatherData} from "@/entities/weather/api/client";
import {WeatherResponse} from "@/entities/weather/model/types";

interface useWeatherQueryProps {
  lat: number | null;
  long: number | null;
  addressName: string;
}

export function useWeatherQuery({lat, long, addressName}: useWeatherQueryProps) {
  return useQuery({
    queryKey: ["weather", lat, long],
    queryFn: async (): Promise<WeatherResponse & {location: string}> => {
      if (!lat || !long) {
        // enabled 설정으로 인해 사실상 실행되지 않음, typescript 타입 안정성 용도
        const errorMsg = "위도 및 경도 값이 필요합니다.";
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      const weatherData = await fetchWeatherData(lat, long);
      return {...weatherData, location: addressName};
    },
    enabled: !!lat && !!long && !!addressName,
  });
}
