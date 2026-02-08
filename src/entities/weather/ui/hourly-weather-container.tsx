import {useDraggableScroll} from "@/shared/lib/hooks/useDraggableScroll";
import {HourlyForecast} from "@/entities/weather/model/types";

interface HourlyWeatherContainerProps {
  hourlyForecast: HourlyForecast[];
}

export const HourlyWeatherContainer = ({hourlyForecast}: HourlyWeatherContainerProps) => {
  const {ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove} = useDraggableScroll<HTMLDivElement>();

  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-sm font-medium text-gray-400 mb-3 px-2">시간대별 예보</h3>
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing scrollbar-hide select-none px-2"
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{scrollbarWidth: "none", msOverflowStyle: "none"}}
      >
        {hourlyForecast.map((item, idx) => (
          <div
            key={`${item.date}-${item.time}-${idx}`}
            className="flex flex-col items-center min-w-[70px] p-3 rounded-xl bg-slate-50 border border-slate-100"
          >
            <span className="text-xs text-gray-500 mb-2">{item.time}</span>
            <span className="font-bold text-lg text-gray-700">{item.temp}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};
