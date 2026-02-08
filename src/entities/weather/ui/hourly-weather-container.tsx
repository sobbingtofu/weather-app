import {useDraggableScroll} from "@/shared/lib/hooks/useDraggableScroll";
import {HourlyForecast} from "@/entities/weather/model/types";

interface HourlyWeatherContainerProps {
  hourlyForecast: HourlyForecast[];
}

export const HourlyWeatherContainer = ({hourlyForecast}: HourlyWeatherContainerProps) => {
  const {ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove} = useDraggableScroll<HTMLDivElement>();

  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-xs sn:text-sm font-medium text-gray-600 mb-3 px-2">시간대별 예보</h3>
      <div
        ref={ref}
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
            <div className="mb-2">
              <span className="text-blue-500 font-medium text-xs whitespace-nowrap">{item.hourlySkyState}</span>
            </div>
            <span className="font-bold text-base sm:text-xl text-gray-800">{item.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
