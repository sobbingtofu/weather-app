"use client";

import {useFavorites} from "@/features/manage-favorites";
import FavoriteCard from "./favorite-card";
import {TimeThemeStyles} from "@/entities/date-time/model/type";

interface FavoriteListProps {
  themeStyles: TimeThemeStyles;
}

export function FavoriteList({themeStyles}: FavoriteListProps) {
  const {favorites, removeFavorite, updateNickName, isLoaded} = useFavorites();

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="h-32 rounded-3xl bg-black/5 animate-pulse" />
        <div className="h-32 rounded-3xl bg-black/5 animate-pulse" />
        <div className="h-32 rounded-3xl bg-black/5 animate-pulse" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return <div className={`text-left text-gray-500 mt-10 ${themeStyles.text}`}>즐겨찾기 목록이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {favorites.map((fav) => (
        <FavoriteCard
          key={fav.id}
          item={fav}
          onRemove={removeFavorite}
          onUpdate={updateNickName}
          themeStyles={themeStyles}
        />
      ))}
    </div>
  );
}
