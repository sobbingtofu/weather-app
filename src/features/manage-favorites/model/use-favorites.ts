import {useState, useEffect} from "react";
import {FavoriteLocation} from "./types";

const STORAGE_KEY = "weather-app-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (newFavorites: FavoriteLocation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const addFavorite = (location: Omit<FavoriteLocation, "id">) => {
    if (favorites.length >= 6) {
      alert("즐겨찾기는 최대 6개까지 저장할 수 있습니다.");
      return;
    }
    const exists = favorites.some((f) => f.lat === location.lat && f.lon === location.lon);
    if (exists) {
      return;
    }

    const newFavorite = {...location, id: `${location.lat}-${location.lon}`};
    saveToStorage([...favorites, newFavorite]);
  };

  const removeFavorite = (id: string) => {
    saveToStorage(favorites.filter((f) => f.id !== id));
  };

  const updateAlias = (id: string, alias: string) => {
    saveToStorage(favorites.map((f) => (f.id === id ? {...f, alias} : f)));
  };

  const isFavorite = (lat: number, lon: number) => {
    return favorites.some((f) => f.lat === lat && f.lon === lon);
  };

  return {favorites, addFavorite, removeFavorite, updateAlias, isFavorite};
}
