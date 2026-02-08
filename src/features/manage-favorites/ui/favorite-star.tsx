import {Star} from "lucide-react";
import {useFavorites} from "../model/use-favorites";
import {useState, useEffect} from "react";

interface FavoriteStarProps {
  lat: number;
  lon: number;
  locationName: string;
}

export function FavoriteStar({lat, lon, locationName}: FavoriteStarProps) {
  const {isFavorite, addFavorite, removeFavorite} = useFavorites();
  const [isFav, setIsFav] = useState(false);

  // Sync with store
  useEffect(() => {
    setIsFav(isFavorite(lat, lon));
  }, [lat, lon, isFavorite]);

  const toggle = () => {
    if (isFav) {
      removeFavorite(`${lat}-${lon}`);
    } else {
      addFavorite({lat, lon, name: locationName});
    }
    setIsFav(!isFav);
  };

  return (
    <button onClick={toggle} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
      <Star className={`w-6 h-6 ${isFav ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
    </button>
  );
}
