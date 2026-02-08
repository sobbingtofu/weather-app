import {getCurrentTimeInfo, getTimeTheme, THEME_STYLES, TimeThemeStyles} from "@/entities/date-time";
import {WeatherSearchViewContainer} from "@/widgets/weather-search-view-container";
import Link from "next/link";

export function HomePage() {
  const currentTime = getCurrentTimeInfo();
  const currentTheme = getTimeTheme(currentTime);

  const themeStyles: TimeThemeStyles = THEME_STYLES[currentTheme];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br transition-colors duration-1000 flex flex-col items-center pt-4 sm:pt-8 ${themeStyles.bg}`}
    >
      <div className="block sm:hidden h-[clamp(0px,calc(100dvh-750px),50px)]" />
      <div className="w-full max-w-4xl px-6 flex justify-between items-center mb-5 sm:mb-10">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-sm sm:text-xl ${themeStyles.text}`}>A Simple Weather App</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/favourites"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1 font-medium text-xs sm:text-sm transition-colors duration-200 ease-in-out ${themeStyles.link}`}
          >
            즐겨찾기
          </Link>
        </div>
      </div>
      <div className="block sm:hidden h-[clamp(0px,calc(100dvh-750px),10px)]" />
      <WeatherSearchViewContainer themeStyles={themeStyles} />

      <footer className={`mt-[20px] pb-4 text-center text-xs ${themeStyles.footer}`}>
        모든 날씨 데이터는 공공데이터포털에서 제공받았습니다.
      </footer>
    </div>
  );
}
