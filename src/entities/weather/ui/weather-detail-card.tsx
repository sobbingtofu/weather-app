import {Loader2} from "lucide-react";
import {FavoriteStar} from "@/features/manage-favorites";
import {WeatherResponse} from "../model/types";
import {HourlyWeatherContainer} from "./hourly-weather-container";

interface WeatherDetailCardProps {
  isAddressNameLoading: boolean;
  isWeatherLoading: boolean;
  isDetectingLocation: boolean;
  weatherQueryErr: boolean;
  errorMsg: string | null;
  weatherData?: WeatherResponse & {location: string};
  activateFavoriteStar: boolean;
  coordsState: {lat: number; long: number} | null;
  addressNameState: string;
}

export const WeatherDetailCard = ({
  isAddressNameLoading,
  isWeatherLoading,
  isDetectingLocation,
  weatherQueryErr,
  errorMsg,
  weatherData,
  activateFavoriteStar,
  coordsState,
  addressNameState,
}: WeatherDetailCardProps) => {
  return (
    <main className="min-h-[300px] border rounded-xl p-8 shadow-sm bg-white relative">
      {isAddressNameLoading || isWeatherLoading || isDetectingLocation ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : weatherQueryErr ? (
        <div className="text-center text-gray-500 mt-10">해당 장소의 정보가 제공되지 않습니다.</div>
      ) : weatherData ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              {/* 주소 */}
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
                {weatherData.location}
              </h2>
              {/* 시간 */}
              <p className="text-gray-500 text-sm mt-1">
                {new Date().toLocaleDateString("ko-KR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {activateFavoriteStar && coordsState && (
              <FavoriteStar
                lat={coordsState.lat}
                long={coordsState.long}
                locationName={addressNameState || weatherData.location}
              />
            )}
          </div>

          <div className="flex-1 flex flex-col items-center py-8 w-full">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="text-6xl font-bold text-gray-800 mb-2">{weatherData.currentTemperature}°</div>
              <div className="flex gap-6 text-gray-500 text-sm font-medium">
                <span className="flex items-center">
                  <span className="text-blue-500 mr-1">▼</span>
                  최저 {weatherData.minTemperature}°
                </span>
                <span className="flex items-center">
                  <span className="text-red-500 mr-1">▲</span>
                  최고 {weatherData.maxTemperature}°
                </span>
              </div>
            </div>

            <HourlyWeatherContainer hourlyForecast={weatherData.hourlyForecast} />
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10 whitespace-pre-wrap">
          {errorMsg || "날씨 정보를 불러올 수 없습니다."}
        </div>
      )}
    </main>
  );
};
