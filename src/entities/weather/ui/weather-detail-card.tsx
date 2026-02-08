import {Loader2, MapPin, ArrowDown, ArrowUp} from "lucide-react";
import {FavoriteStar} from "@/features/manage-favorites";
import {WeatherResponse} from "../model/types";
import {HourlyWeatherContainer} from "./hourly-weather-container";
import {WeatherIcon} from "./weather-icon";

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
    <main className="min-h-[500px] w-full bg-white rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden transition-all duration-300">
      {isAddressNameLoading || isWeatherLoading || isDetectingLocation ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
        </div>
      ) : weatherQueryErr ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          해당 장소의 정보가 제공되지 않습니다.
        </div>
      ) : weatherData ? (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-10">
            <div className="flex flex-col gap-1">
              {/* 주소 */}
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-gray-900">{weatherData.location}</h2>
                <MapPin className="text-blue-500 w-6 h-6" fill="currentColor" fillOpacity={0.2} />
              </div>
              {/* 시간 */}
              <p className="text-gray-500 text-base font-medium">
                {new Date().toLocaleDateString("ko-KR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {activateFavoriteStar && coordsState && (
              <div className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                <FavoriteStar
                  lat={coordsState.lat}
                  long={coordsState.long}
                  locationName={addressNameState || weatherData.location}
                />
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center w-full">
            <div className="flex items-center justify-center gap-8 mb-12">
              <div className="text-[7rem] font-bold text-gray-900 leading-none tracking-tighter">
                {weatherData.currentTemperature}°
              </div>
              <div className="flex flex-col items-center justify-center mt-4">
                <WeatherIcon skyState={weatherData.currentSkyState} />
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  {weatherData.currentSkyState}
                </span>
              </div>
            </div>

            <div className="flex gap-6 mb-16">
              <div className="flex items-center gap-2 bg-blue-50 px-6 py-3 rounded-full text-blue-700 font-medium">
                <ArrowDown size={18} />
                <span>최저 {weatherData.minTemperature}°</span>
              </div>
              <div className="flex items-center gap-2 bg-red-50 px-6 py-3 rounded-full text-red-700 font-medium">
                <ArrowUp size={18} />
                <span>최고 {weatherData.maxTemperature}°</span>
              </div>
            </div>

            <div className="w-full">
              <HourlyWeatherContainer hourlyForecast={weatherData.hourlyForecast} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 whitespace-pre-wrap text-center">
          {errorMsg || "날씨 정보를 불러올 수 없습니다."}
        </div>
      )}
    </main>
  );
};
