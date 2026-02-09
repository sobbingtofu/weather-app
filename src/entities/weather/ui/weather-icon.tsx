import {SkyStateType} from "../model/types";
import {Sun, Moon, CloudSun, CloudMoon, CloudRain, CloudSnow} from "lucide-react";

interface WeatherIconProps {
  skyState: SkyStateType;
  className?: string;
}

export const WeatherIcon = ({skyState, className = "w-16 h-16 mb-2"}: WeatherIconProps) => {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18;

  const iconProps = className;

  switch (skyState) {
    case "맑음":
      return isDay ? (
        <Sun className={`${iconProps} text-orange-500`} fill="currentColor" />
      ) : (
        <Moon className={`${iconProps} text-yellow-400`} fill="currentColor" />
      );
    case "구름많음":
    case "흐림":
      return isDay ? (
        <CloudSun className={`${iconProps} text-gray-500`} />
      ) : (
        <CloudMoon className={`${iconProps} text-gray-500`} />
      );
    case "비":
    case "소나기":
      return <CloudRain className={`${iconProps} text-blue-500`} />;
    case "눈":
      return <CloudSnow className={`${iconProps} text-blue-300`} />;
    case "비/눈":
      return (
        <div className={`relative ${iconProps}`}>
          <CloudRain className="w-full h-full text-blue-500 absolute top-0 left-0" />
          <div className="absolute inset-0 overflow-hidden" style={{clipPath: "polygon(100% 0, 0 100%, 100% 100%)"}}>
            <CloudSnow className="w-full h-full text-blue-300" />
          </div>
        </div>
      );
    default:
      return <Sun className={`${iconProps} text-gray-400`} />;
  }
};
