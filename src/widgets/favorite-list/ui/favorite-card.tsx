import {TimeThemeStyles} from "@/entities/date-time";
import {FavoriteLocation} from "@/features/manage-favorites";
import {MapPin, Pen, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useState} from "react";

interface FavoriteCardProps {
  item: FavoriteLocation;
  onRemove: (location: Omit<FavoriteLocation, "id">) => void;
  onUpdate: (id: string, alias: string) => void;
  themeStyles: TimeThemeStyles;
}

function FavoriteCard({item, onRemove, onUpdate, themeStyles}: FavoriteCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.nickName || item.address);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(item.id, editValue);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("삭제하시겠습니까?")) {
      onRemove({lat: item.lat, long: item.long, address: item.address});
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCardClick = () => {
    if (!isEditing) {
      router.push(`/weather/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`h-[120px] rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-white flex justify-between items-center group ${themeStyles.cardBg}`}
    >
      <div className="flex flex-col gap-1">
        {isEditing ? (
          <div className="flex gap-2 h-[50px] py-2" onClick={(e) => e.stopPropagation()}>
            <input
              className="border py-1 px-2 rounded text-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <button onClick={handleSave} className="text-xs bg-blue-500 text-white px-4 py-1 rounded">
              저장
            </button>
          </div>
        ) : (
          <div className="h-[50px]">
            <h3 className="font-bold text-lg text-gray-800 mb-1">{item.nickName || item.address}</h3>
            {item.nickName && <p className="text-xs text-gray-400">{item.address}</p>}
          </div>
        )}
        <div className="flex items-center text-xs text-gray-400 mt-2">
          <MapPin size={12} className="mr-1" />
          {item.lat.toFixed(3)}, {item.long.toFixed(3)}
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEditClick}
          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full"
        >
          <Pen size={16} />
        </button>
        <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default FavoriteCard;
