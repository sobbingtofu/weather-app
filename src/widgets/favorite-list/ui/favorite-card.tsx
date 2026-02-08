"use client";

import {TimeThemeStyles} from "@/entities/date-time";
import {FavoriteLocation} from "@/features/manage-favorites";
import {ArrowDown, ArrowUp} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useEffect, useRef, useState} from "react";
import CardEditButtons from "./card-edit-buttons";
import {useWeatherQuery} from "@/entities/weather";
import {WeatherIcon} from "@/entities/weather/ui/weather-icon";

interface FavoriteCardProps {
  item: FavoriteLocation;
  onRemove: (location: Omit<FavoriteLocation, "id">) => void;
  onUpdate: (id: string, alias: string) => void;
  themeStyles: TimeThemeStyles;
}

function FavoriteCard({item, onRemove, onUpdate, themeStyles}: FavoriteCardProps) {
  const router = useRouter();
  const favoriteCardRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.nickName || item.address);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (favoriteCardRef.current && !favoriteCardRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(item.id, editValue);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("삭제하시겠습니까?")) {
      onRemove({lat: item.lat, long: item.long, address: item.address});
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCardClick = () => {
    if (!isEditing) {
      router.push(`/weather/${item.id}`);
    }
  };

  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    isError: weatherQueryErr,
  } = useWeatherQuery({
    lat: item?.lat ?? null,
    long: item?.long ?? null,
    addressName: item.address,
  });

  return (
    <div
      ref={favoriteCardRef}
      onClick={handleCardClick}
      className={`h-[150px] sm:h-[160px] rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-white
      flex flex-row sm:flex-row justify-between items-center group ${themeStyles.cardBg}`}
    >
      <div className="flex flex-col gap-3 sm:gap-6 w-full h-full">
        {isEditing ? (
          <div className="flex gap-2 h-[50px] py-2" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex-1 h-full flex items-center">
              {/* 글자수 표시 */}
              <span
                className={`absolute right-0 -top-[18px] text-[11px] ${
                  editValue.length >= 60 ? "text-red-500" : "text-gray-400"
                }`}
              >
                {editValue.length}/60
              </span>
              {/* 별칭입력창 */}
              <input
                className="w-full h-full border border-gray-400 focus:outline-gray-400 focus:ring-1 py-1 px-2
                rounded text-sm"
                value={editValue}
                onChange={(e) => {
                  if (e.target.value.length <= 60) {
                    setEditValue(e.target.value);
                  }
                }}
              />
            </div>
            <button
              onClick={handleSave}
              className="text-xs bg-blue-500 hover:bg-blue-400 text-white px-4 py-1 rounded
              transition-colors duration-200 ease-in-out"
            >
              저장
            </button>
          </div>
        ) : (
          <div className="h-[50px] w-full flex items-center justify-between">
            {/* 별칭 주소 */}
            <div className="flex-1 min-w-0 mr-2">
              <h3 className="font-bold text-sm sm:text-lg text-gray-800 mb-1 w-[200px] truncate">
                {item.nickName || item.address}
              </h3>
              {item.nickName && <p className="text-xs text-gray-600 truncate">{item.address}</p>}
            </div>

            <div className="shrink-0">
              <CardEditButtons
                handleEditClick={handleEditClick}
                handleDelete={handleDelete}
                dyanmicOpacity={false}
                iconSize={12}
                iconBackground={true}
              />
            </div>
          </div>
        )}

        {/* 날씨 정보 */}
        {isWeatherLoading ? (
          <div className="flex items-center gap-8 mr-2 sm:mr-0 shrink-0 animate-pulse">
            {/* 스켈레톤 UI */}
            <div className="flex flex-row items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="mt-1 w-12 h-4 bg-gray-200 rounded" />
            </div>
            <div className="flex flex-row items-center gap-4">
              <div className="w-10 h-6 mt-1 bg-gray-200 rounded" />
              <div className="w-24 h-4 mt-1 bg-gray-200 rounded" />
            </div>
          </div>
        ) : weatherQueryErr ? (
          <div className="flex items-center mr-2 sm:mr-0 shrink-0">
            <span className="text-sm text-red-500">일시적으로 날씨 정보를 가져오지 못했습니다</span>
          </div>
        ) : (
          weatherData && (
            <div className="flex items-center gap-8 mr-2 sm:mr-0 shrink-0">
              {/* 하늘상태 및 그래픽 */}
              <div className="flex flex-row items-center gap-4">
                <WeatherIcon skyState={weatherData.currentSkyState} className="w-8 h-8" />
                <span className="mt-1 text-sm text-gray-500">{weatherData.currentSkyState}</span>
              </div>
              <div className="flex flex-row items-center gap-4">
                {/* 현재 기온 */}
                <span className="text-2xl font-bold text-gray-800 leading-none mt-1">
                  {weatherData.currentTemperature}°
                </span>
                {/* 최고최저기온 */}
                <div className="flex gap-1 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <ArrowDown size={14} className="text-blue-500" />
                    {weatherData.minTemperature}°
                  </span>
                  <span className="flex items-center">
                    <ArrowUp size={14} className="text-red-500" />
                    {weatherData.maxTemperature}°
                  </span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default FavoriteCard;
