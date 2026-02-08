import {MapPin, ArrowDown, ArrowUp} from "lucide-react";
import {FavoriteStar} from "@/features/manage-favorites";
import {WeatherResponse} from "../model/types";
import {HourlyWeatherContainer} from "./hourly-weather-container";
import {WeatherIcon} from "./weather-icon";
import {TimeThemeStyles} from "@/entities/date-time/model/type";

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
  themeStyles: TimeThemeStyles;
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
  themeStyles,
}: WeatherDetailCardProps) => {
  // 데이터나 에러 메시지가 없을 때(초기 로딩 등)도 로딩 상태로 간주하여 스켈레톤 표시
  const showAddressSkeleton =
    isDetectingLocation || isAddressNameLoading || (!addressNameState && !weatherData?.location && !errorMsg);
  const locationName = addressNameState || weatherData?.location || "";

  const showWeatherSkeleton = isWeatherLoading || (!weatherData && !weatherQueryErr && !errorMsg);

  return (
    <main
      className={`sm:min-h-[500px] w-full rounded-[1.6rem] sm:rounded-[2.5rem] px-6 py-6 sm:p-10 shadow-xl relative overflow-hidden transition-all duration-300 backdrop-blur-md ${themeStyles.cardBg}`}
    >
      <div className="block sm:hidden h-[clamp(0px,calc(100dvh-750px),25px)] w-full " />
      <div className="flex flex-col h-full">
        {/* 헤더: 주소 및 즐겨찾기 */}
        <div className="flex justify-between items-start mb-3 sm:mb-10">
          <div className="flex flex-col gap-1">
            {showAddressSkeleton ? (
              <div className="flex flex-col gap-2">
                <div className="h-7 sm:h-9 w-50 sm:w-80 bg-black/10 animate-pulse rounded-lg" />
                <div className="h-4 sm:h-5 w-36 sm:w-48 bg-black/10 animate-pulse rounded-md" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {/* 주소 */}
                  <h2 className={`text-base sm:text-3xl font-bold ${themeStyles.text}`}>
                    {locationName || "위치 알 수 없음"}
                  </h2>
                  <MapPin className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" fillOpacity={0.2} />
                </div>
                {/* 시간 */}
                <p className={`${themeStyles.footer} text-xs sm:text-base font-medium`}>
                  {new Date().toLocaleDateString("ko-KR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </>
            )}
          </div>
          {!showAddressSkeleton && activateFavoriteStar && coordsState && (
            <div className="p-1 sm:p-4">
              <FavoriteStar
                lat={coordsState.lat}
                long={coordsState.long}
                locationName={addressNameState || weatherData?.location || ""}
              />
            </div>
          )}
        </div>

        {/* 컨텐츠: 날씨 정보 */}
        <div className="flex-1 flex flex-col items-center w-full">
          {showWeatherSkeleton ? (
            <div className="flex flex-col items-center w-full animate-pulse">
              <div className="flex items-center justify-center gap-3 sm:gap-8 mb-12 w-full">
                <div className="h-28 w-40 bg-black/10 rounded-2xl" />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-black/10 rounded-full" />
                  <div className="w-12 h-4 bg-black/10 rounded-md" />
                </div>
              </div>
              <div className="flex gap-6 mb-16">
                <div className="w-32 h-12 bg-black/10 rounded-full" />
                <div className="w-32 h-12 bg-black/10 rounded-full" />
              </div>
              <div className="w-full h-32 bg-black/10 rounded-[2rem]" />
            </div>
          ) : weatherQueryErr ? (
            <div className={`flex items-center justify-center h-full ${themeStyles.footer}`}>
              해당 장소의 정보가 제공되지 않습니다.
            </div>
          ) : weatherData ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex items-center justify-center gap-8 mb-7 sm:mb-12">
                {/* 현재기온 */}
                <div className={`text-6xl sm:text-[112px] font-bold ${themeStyles.text} leading-none tracking-tighter`}>
                  {weatherData.currentTemperature}°
                </div>
                {/* 하늘 상태 및 그래픽 */}
                <div className="flex flex-col items-center justify-center mt-4">
                  <WeatherIcon skyState={weatherData.currentSkyState} />
                  <span className={`text-sm ${themeStyles.footer} uppercase tracking-widest`}>
                    {weatherData.currentSkyState}
                  </span>
                </div>
              </div>

              <div className="flex gap-6 mb-2 sm:mb-16 text-xs sm:text-base">
                <div className="flex items-center gap-2 bg-blue-100/70 backdrop-blur-sm px-6 py-3 rounded-full text-blue-700 font-medium">
                  <ArrowDown className="w-3 h-3 sm:w-[18px] sm:h-[18px]" />
                  <span>최저 {weatherData.minTemperature}°</span>
                </div>
                <div className="flex items-center gap-2 bg-red-100/70 backdrop-blur-sm px-6 py-3 rounded-full text-red-700 font-medium">
                  <ArrowUp className="w-3 h-3 sm:w-[18px] sm:h-[18px]" />
                  <span>최고 {weatherData.maxTemperature}°</span>
                </div>
              </div>
              <div className="block sm:hidden h-[clamp(0px,calc(100dvh-750px),35px)] w-full " />
              <div className="w-full">
                <HourlyWeatherContainer hourlyForecast={weatherData.hourlyForecast} />
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center h-full ${themeStyles.footer} whitespace-pre-wrap text-center`}
            >
              {errorMsg || "날씨 정보를 불러올 수 없습니다."}
            </div>
          )}
        </div>
      </div>
      <div className=" block sm:hiddenh-[clamp(0px,calc(100dvh-750px),25px)] w-full" />
    </main>
  );
};
