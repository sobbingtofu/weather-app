import {FavoriteLocation} from "@/features/manage-favorites";
import {MapPin, Pen, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import React, {useState} from "react";

interface FavoriteCardProps {
  item: FavoriteLocation;
  onRemove: (location: Omit<FavoriteLocation, "id">) => void;
  onUpdate: (id: string, alias: string) => void;
}

function FavoriteCard({item, onRemove, onUpdate}: FavoriteCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.alias || item.name);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(item.id, editValue);
    setIsEditing(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("삭제하시겠습니까?")) {
      onRemove({lat: item.lat, long: item.long, name: item.name});
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
      className="border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-white flex justify-between items-center group"
    >
      <div className="flex flex-col gap-1">
        {isEditing ? (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <input
              className="border p-1 rounded text-sm"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <button onClick={handleSave} className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
              저장
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg text-gray-800">{item.alias || item.name}</h3>
            {item.alias && <p className="text-xs text-gray-400">{item.name}</p>}
          </>
        )}
        <div className="flex items-center text-xs text-gray-400 mt-2">
          <MapPin size={12} className="mr-1" />
          {item.lat.toFixed(4)}, {item.long.toFixed(4)}
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
