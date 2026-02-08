import {WeatherSearchViewContainer} from "@/widgets/weather-search-view-container";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";

interface WeatherDetailPageProps {
  lat: number;
  long: number;
}

export function WeatherDetailPage({lat, long}: WeatherDetailPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl px-6 flex items-center gap-4 mb-4">
        <Link href="/favourites" className="p-2 bg-white rounded-full shadow hover:bg-gray-100 text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">상세 날씨</h1>
      </div>
      <div className="max-w-2xl mx-auto w-full">
        <WeatherSearchViewContainer initialCoords={{lat, long}} enableSearch={false} />
      </div>
    </div>
  );
}
