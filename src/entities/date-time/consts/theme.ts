import {TimeThemeStyles, TimeThemeType} from "../model/type";

export const THEME_STYLES: Record<TimeThemeType, TimeThemeStyles> = {
  dawn: {
    bg: "from-blue-400 via-orange-100 to-indigo-200",
    cardBg: "bg-white/60",
    text: "text-slate-800",
    link: "text-slate-600 hover:text-slate-900",
    footer: "text-slate-500",
  },
  morning: {
    bg: "from-blue-100 to-sky-200",
    cardBg: "bg-white/70",
    text: "text-gray-800",
    link: "text-gray-600 hover:text-gray-900",
    footer: "text-gray-400",
  },
  noon: {
    bg: "from-blue-50 to-blue-200",
    cardBg: "bg-white/80",
    text: "text-gray-800",
    link: "text-gray-600 hover:text-gray-900",
    footer: "text-gray-400",
  },
  twilight: {
    bg: "from-indigo-500 via-purple-400 to-orange-300",
    cardBg: "bg-indigo-900/40",
    text: "text-white",
    link: "text-indigo-100 hover:text-white",
    footer: "text-indigo-200",
  },
  night: {
    bg: "from-slate-950 via-slate-900 to-slate-800",
    cardBg: "bg-slate-800/50",
    text: "text-slate-100",
    link: "text-slate-400 hover:text-white",
    footer: "text-slate-500",
  },
};
