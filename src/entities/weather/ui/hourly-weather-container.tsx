import {useEffect} from "react";
import {useDraggableScroll} from "@/shared/lib/hooks/useDraggableScroll";
import {HourlyForecast} from "@/entities/weather/model/types";
import {WeatherIcon} from "./weather-icon";
import {getCurrentTimeInfo} from "@/entities/date-time/lib/dateTimeUtils";

interface HourlyWeatherContainerProps {
  hourlyForecast: HourlyForecast[];
}

export const HourlyWeatherContainer = ({hourlyForecast}: HourlyWeatherContainerProps) => {
  const {scrollContainerRef, onMouseDown, onMouseLeave, onMouseUp, onMouseMove} = useDraggableScroll<HTMLDivElement>();

  // 현재 시간에 맞춰 해당 시간대가 가운데로 오도록 + 적어도 화면 중앙에 오도록 스크롤 위치 조정
  useEffect(() => {
    if (scrollContainerRef.current && hourlyForecast.length > 0) {
      const currentTime = getCurrentTimeInfo();
      const currentHour = currentTime.getHours().toString().padStart(2, "0");
      const targetTime = `${currentHour}:00`;
      const targetIndex = hourlyForecast.findIndex((item) => item.time === targetTime);

      if (targetIndex !== -1) {
        const container = scrollContainerRef.current;
        const targetElement = container.children[targetIndex] as HTMLElement;

        if (targetElement) {
          const containerWidth = container.clientWidth;
          const itemWidth = targetElement.clientWidth;
          const itemLeft = targetElement.offsetLeft - container.offsetLeft;

          const newScrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2;

          container.scrollTo({
            left: newScrollLeft,
            behavior: "smooth",
          });
        }
      }
    }
  }, [hourlyForecast, scrollContainerRef]);

  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-xs sn:text-sm font-medium text-gray-600 mb-3 px-2">시간대별 예보</h3>
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-1 sm:pb-4 cursor-grab active:cursor-grabbing scrollbar-hide select-none px-2"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
      >
        {hourlyForecast.map((item, idx) => (
          <div
            key={`${item.date}-${item.time}-${idx}`}
            className="flex flex-col items-center min-w-[80px] p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-xs font-medium text-gray-400 mb-2">{item.time}</span>
            <div className="mb-2 flex flex-col items-center gap-y-2 boder">
              <WeatherIcon skyState={item.hourlySkyState} className="w-8 h-8" />
              <p className="text-blue-500 font-medium text-xs whitespace-nowrap">{item.hourlySkyState}</p>
            </div>
            <span className="font-bold text-base sm:text-xl text-gray-800">{item.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
