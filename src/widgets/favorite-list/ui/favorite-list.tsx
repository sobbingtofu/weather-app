"use client";

import {useFavorites} from "@/features/manage-favorites";

import FavoriteCard from "./favorite-card";

export function FavoriteList() {
  const {favorites, removeFavorite, updateAlias} = useFavorites();

  if (favorites.length === 0) {
    return <div className="text-left text-gray-500 mt-10">즐겨찾기 목록이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((fav) => (
        <FavoriteCard key={fav.id} item={fav} onRemove={removeFavorite} onUpdate={updateAlias} />
      ))}
    </div>
  );
}
