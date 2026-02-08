import {Star} from "lucide-react";
import {useFavorites} from "../model/use-favorites";
import {useState, useEffect, useRef} from "react";

interface FavoriteStarProps {
  lat: number;
  long: number;
  locationName: string;
}

export function FavoriteStar({lat, long, locationName}: FavoriteStarProps) {
  const {isFavorite, addFavorite, removeFavorite} = useFavorites();

  // 1. 실제 데이터 (항상 최신)
  const actualFav = isFavorite(lat, long);

  // 2. 상태 관리
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
  const [prevCoords, setPrevCoords] = useState({lat, long}); // 이전 좌표 기억용

  const debounceDelayRef = useRef<NodeJS.Timeout | null>(null);

  if (prevCoords.lat !== lat || prevCoords.long !== long) {
    setPrevCoords({lat, long});
    setOptimisticFav(null); // 좌표 바뀌면 낙관적 업데이트 초기화
  }

  // 화면에 보여줄 상태 결정
  const isFavOnScreen = optimisticFav !== null ? optimisticFav : actualFav;

  // useEffect에서 타이머 정리
  useEffect(() => {
    if (debounceDelayRef.current) {
      clearTimeout(debounceDelayRef.current);
      debounceDelayRef.current = null;
    }
  }, [lat, long]);

  useEffect(() => {
    return () => {
      if (debounceDelayRef.current) clearTimeout(debounceDelayRef.current);
    };
  }, []);

  const toggle = () => {
    const nextState = !isFavOnScreen;
    setOptimisticFav(nextState);

    if (debounceDelayRef.current) clearTimeout(debounceDelayRef.current);

    debounceDelayRef.current = setTimeout(() => {
      debounceDelayRef.current = null;
      if (nextState) {
        console.log("디바운스 후 즐겨찾기 추가 실제 실행");
        addFavorite({lat, long, name: locationName});
      } else {
        console.log("디바운스 후 즐겨찾기 제거 실제 실행");
        removeFavorite({lat, long, name: locationName});
      }
      setOptimisticFav(null);
    }, 1500);
  };

  return (
    <button
      onClick={toggle}
      className="p-2 transition-transform rounded-full cursor-pointer
      hover:scale-[108%] ease-in-out"
    >
      <Star className={`w-6 h-6 ${isFavOnScreen ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
    </button>
  );
}
