"use client";

import {WeatherSearchViewContainer} from "@/widgets/weather-search-view-container";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {THEME_STYLES} from "@/entities/date-time/consts/theme";
import {TimeThemeStyles} from "@/entities/date-time/model/type";
import {getCurrentTimeInfo, getTimeTheme} from "@/entities/date-time/lib/dateTimeUtils";
import {useFavorites} from "@/features/manage-favorites/model/useFavorites";

interface WeatherDetailPageProps {
  lat: number;
  long: number;
}

export function WeatherDetailPage({lat, long}: WeatherDetailPageProps) {
  const currentTime = getCurrentTimeInfo();
  const currentTheme = getTimeTheme(currentTime);
  const {favorites} = useFavorites();

  const favorite = favorites.find((f) => f.lat === lat && f.long === long);
  const title = "즐겨찾기: " + (favorite?.nickName || "");

  const themeStyles: TimeThemeStyles = THEME_STYLES[currentTheme];

  return (
    <div
      className={`min-h-screen min-w-[330px] bg-gradient-to-br transition-colors duration-1000 flex flex-col
        items-center pt-8 sm:pt-8 ${themeStyles.bg}`}
    >
      <div className="block sm:hidden h-[clamp(0px,700px,50px)]" />
      <div className="w-full max-w-4xl sm:px-6 px-4 flex items-center gap-2 xm:gap-4 mb-0 sm:mb-12">
        <Link
          href="/favourites"
          className="p-2 bg-white/40 rounded-full shadow hover:bg-white/60 text-gray-600
          transition-all duration-200 ease-in-out hover:scale-105"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`font-bold text-sm sm:text-lg ${themeStyles.text}`}>{title}</span>
        </div>
      </div>
      <WeatherSearchViewContainer initialCoords={{lat, long}} enableSearch={false} enableFavoriteStar={false} />
    </div>
  );
}
