import {WeatherSearchViewContainer} from "@/widgets/weather-search-view-container";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {THEME_STYLES} from "@/entities/date-time/consts/theme";
import {TimeThemeStyles} from "@/entities/date-time/model/type";
import {getCurrentTimeInfo, getTimeTheme} from "@/entities/date-time/lib/dateTimeUtils";

interface WeatherDetailPageProps {
  lat: number;
  long: number;
}

export function WeatherDetailPage({lat, long}: WeatherDetailPageProps) {
  const currentTime = getCurrentTimeInfo();
  const currentTheme = getTimeTheme(currentTime);

  const themeStyles: TimeThemeStyles = THEME_STYLES[currentTheme];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br transition-colors duration-1000 flex flex-col items-center pt-12 ${themeStyles.bg}`}
    >
      <div className="w-full max-w-4xl px-6 flex items-center gap-4 mb-12">
        <Link
          href="/favourites"
          className="p-2 bg-white/40 rounded-full shadow hover:bg-white/60 text-gray-600
        transition-all duration-200 ease-in-out hover:scale-105"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">상세 날씨</h1>
      </div>
      <WeatherSearchViewContainer initialCoords={{lat, long}} enableSearch={false} />
    </div>
  );
}
