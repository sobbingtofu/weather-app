import {Pen, Trash2} from "lucide-react";

interface CardEditButtonsProps {
  handleEditClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  handleDelete: (e: React.MouseEvent<Element, MouseEvent>) => void;
  dyanmicOpacity?: boolean;
  iconSize?: number;
  iconBackground?: boolean;
}

function CardEditButtons({
  handleEditClick,
  handleDelete,
  dyanmicOpacity = true,
  iconSize = 16,
  iconBackground = false,
}: CardEditButtonsProps) {
  return (
    <div
      className={`flex gap-2 transition-opacity
      ${dyanmicOpacity ? "sm:opacity-0 opacity-100 group-hover:opacity-100" : "opacity-100"}
      `}
    >
      <button
        onClick={handleEditClick}
        className={`p-3 hover:text-blue-500 hover:bg-blue-50 rounded-full
          ${iconBackground ? "bg-blue-200/30 text-gray-600" : "text-gray-400"}
          `}
      >
        <Pen size={iconSize} />
      </button>
      <button
        onClick={handleDelete}
        className={`p-3  hover:text-red-500 hover:bg-red-50 rounded-full
        ${iconBackground ? "bg-red-200/30 text-gray-600" : "text-gray-400"}
        `}
      >
        <Trash2 size={iconSize} />
      </button>
    </div>
  );
}

export default CardEditButtons;
