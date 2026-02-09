import {THEME_STYLES} from "@/entities/date-time/consts/theme";
import {getCurrentTimeInfo, getTimeTheme} from "@/entities/date-time/lib/dateTimeUtils";
import {TimeThemeStyles} from "@/entities/date-time/model/type";
import {FavoriteList} from "@/widgets/favorite-list";

export function FavouritesPage() {
  const currentTime = getCurrentTimeInfo();
  const currentTheme = getTimeTheme(currentTime);
  const themeStyles: TimeThemeStyles = THEME_STYLES[currentTheme];

  return (
    <div className={`min-h-screen min-w-[330px] p-6 md:p-10 bg-gradient-to-br  ${themeStyles.bg}`}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center gap-4">
          <h1 className={`text-base sm:text-2xl font-bold ${themeStyles.text}`}>즐겨찾기</h1>
        </header>
        <FavoriteList themeStyles={themeStyles} />
      </div>
    </div>
  );
}
