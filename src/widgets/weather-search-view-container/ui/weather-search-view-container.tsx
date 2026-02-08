"use client";

import {useState, useEffect, useCallback} from "react";
import {useWeatherQuery} from "@/entities/weather";
import {LocationSearch} from "@/features/location-search";
import {forwardGeocode, reverseGeocode} from "@/entities/location";
import {useDetectLocation} from "@/features/detect-location";
import {WeatherDetailCard} from "@/entities/weather/ui/weather-detail-card";
import {THEME_STYLES, TimeThemeStyles} from "@/entities/date-time";

interface WeatherSearchViewContainerProps {
  enableSearch?: boolean;
  initialCoords?: {lat: number; long: number};
  themeStyles?: TimeThemeStyles;
  enableFavoriteStar?: boolean;
}

const defaultThemeStyles: TimeThemeStyles = THEME_STYLES["dawn"];

export function WeatherSearchViewContainer({
  enableSearch = true,
  initialCoords,
  themeStyles = defaultThemeStyles,
  enableFavoriteStar = true,
}: WeatherSearchViewContainerProps) {
  const [coordsState, setCoordsState] = useState<{lat: number; long: number} | null>(initialCoords || null);
  const [addressNameState, setAddressNameState] = useState<string>("");
  const [isAddressNameLoading, setIsAddressNameLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {detectLocation, isDetectingLocation} = useDetectLocation({setErrorMsg});

  const handleCurrentLocation = useCallback(async () => {
    setErrorMsg(null);
    setIsAddressNameLoading(true);
    const result = await detectLocation();
    if (result) {
      // useWeatherQuery의 쿼리 키 변경 > fetch trigger
      setCoordsState(result.coords);
      setAddressNameState(result.addressName);
    }
    setIsAddressNameLoading(false);
  }, [detectLocation]);

  useEffect(() => {
    setErrorMsg(null);

    // 초기좌표값이 없는 경우 (home-page)
    if (!initialCoords) {
      handleCurrentLocation();
    }
    // 초기좌표값이 있는 경우 (detail-page)
    else {
      setIsAddressNameLoading(true);
      if (initialCoords.lat && initialCoords.long) {
        reverseGeocode(initialCoords.lat, initialCoords.long).then((result) => {
          if (result.success) {
            setAddressNameState(result.matchedDistrict);
          } else {
            setErrorMsg(result.errorMsg || "행정동명 찾기에 실패했습니다.");
          }
          setIsAddressNameLoading(false);
        });
      } else {
        setIsAddressNameLoading(false);
      }
    }
  }, [initialCoords, detectLocation, handleCurrentLocation]);

  const handleSearchSelectedAddress = async (address: string) => {
    setIsAddressNameLoading(true);
    setErrorMsg(null);
    try {
      const geocodeResultCoord = await forwardGeocode(address);
      if (geocodeResultCoord) {
        setCoordsState(geocodeResultCoord);
        setAddressNameState(address);
      } else {
        alert("장소를 찾을 수 없습니다.");
      }
    } catch (e) {
      alert("조회 중 오류가 발생했습니다.");
      console.error("Error during forward geocoding:", e);
    } finally {
      setIsAddressNameLoading(false);
    }
  };

  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    isError: weatherQueryErr,
  } = useWeatherQuery({
    lat: coordsState?.lat ?? null,
    long: coordsState?.long ?? null,
    addressName: addressNameState,
  });

  return (
    <div className="max-w-4xl mx-auto w-full px-4">
      <div className="flex flex-col gap-8">
        {enableSearch && (
          <LocationSearch onSelectLocation={handleSearchSelectedAddress} onCurrentLocation={handleCurrentLocation} />
        )}

        <WeatherDetailCard
          isAddressNameLoading={isAddressNameLoading}
          isWeatherLoading={isWeatherLoading}
          isDetectingLocation={isDetectingLocation}
          weatherQueryErr={weatherQueryErr}
          errorMsg={errorMsg}
          weatherData={weatherData ?? undefined}
          activateFavoriteStar={enableFavoriteStar && !!coordsState}
          coordsState={coordsState}
          addressNameState={addressNameState}
          themeStyles={themeStyles}
        />
      </div>
    </div>
  );
}
