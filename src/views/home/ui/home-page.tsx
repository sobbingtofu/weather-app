import {WeatherSearchViewContainer} from "@/widgets/weather-search-view-container";
import Link from "next/link";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col items-center pt-8">
      <div className="w-full max-w-4xl px-6 flex justify-between items-center mb-10">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl text-gray-800">A Simple Weather App</span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/favourites"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium text-sm
            transition-colors duration-200 ease-in-out"
          >
            즐겨찾기
          </Link>
        </div>
      </div>

      <WeatherSearchViewContainer />

      <footer className="mt-auto pb-4 text-center text-gray-400 text-xs">
        모든 날씨 데이터는 공공데이터포털에서 제공받았습니다.
      </footer>
    </div>
  );
}
