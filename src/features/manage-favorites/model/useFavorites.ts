import {useState, useEffect} from "react";
import {FavoriteLocation} from "./types";

const STORAGE_KEY = "weather-app-favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFromStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
      setIsLoaded(true);
    };

    loadFromStorage();

    /**
     * 다른 탭에서의 업데이트 감지되면 loadFromStorage 실행해 탭 간 데이터 일관성 유지
     */
    const handleStorageChange = (event: StorageEvent) => {
      console.log("handleStorageChange");
      if (event.key === STORAGE_KEY) {
        loadFromStorage();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
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
    const exists = favorites.some((f) => f.lat === location.lat && f.long === location.long);
    if (exists) {
      console.warn("이미 등록된 id(위도-경도)에 대해 즐겨찾기 추가 시도 - 무시처리");
      return;
    }

    const newFavorite = {...location, id: `${location.lat}-${location.long}`, nickName: location.address};
    saveToStorage([...favorites, newFavorite]);
  };

  const removeFavorite = (location: Omit<FavoriteLocation, "id">) => {
    const id = `${location.lat}-${location.long}`;
    saveToStorage(favorites.filter((f) => f.id !== id));
  };

  const updateNickName = (id: string, nickName: string) => {
    saveToStorage(favorites.map((f) => (f.id === id ? {...f, nickName} : f)));
  };

  const isFavorite = (lat: number, long: number) => {
    return favorites.some((f) => f.lat === lat && f.long === long);
  };

  return {favorites, addFavorite, removeFavorite, updateNickName, isFavorite, isLoaded};
}
