import {WeatherSearchViewContainer} from "@/widgets/weather-search-view-container";
import Link from "next/link";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl px-6 flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Weather App</h1>
        <Link
          href="/favourites"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline font-medium"
        >
          즐겨찾기
        </Link>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <WeatherSearchViewContainer />
      </div>
    </div>
  );
}
