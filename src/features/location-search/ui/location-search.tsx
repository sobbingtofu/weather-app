import {useState} from "react";
import {useLocationSearch} from "../model/use-location-search";
import {MapPin} from "lucide-react";

interface LocationSearchProps {
  onSelectLocation: (locationName: string) => void;
  onCurrentLocation: () => void;
}

export function LocationSearch({onSelectLocation, onCurrentLocation}: LocationSearchProps) {
  const {searchAddressInput, setSearchAddressInput, addressDropdownItems} = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSelectDistrictDropdown = (dropDownItem: string) => {
    setSearchAddressInput(dropDownItem);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      if (!isOpen || addressDropdownItems.length === 0) return;
      e.preventDefault();
      setSelectedIndex((prev) => (prev < addressDropdownItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      if (!isOpen || addressDropdownItems.length === 0) return;
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (isOpen && selectedIndex >= 0) {
        e.preventDefault();
        handleSelectDistrictDropdown(addressDropdownItems[selectedIndex]);
      } else {
        handleGetWeatherBtnClick();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleGetWeatherBtnClick = () => {
    if (!searchAddressInput) {
      alert("검색어를 입력해주세요.");
      return;
    }
    onSelectLocation(searchAddressInput);
  };

  return (
    <div className="w-full max-w-md relative z-50">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchAddressInput}
            onChange={(e) => {
              setSearchAddressInput(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="시, 군, 구, 동 검색"
            className="w-full p-2 border rounded-md"
          />
          {isOpen && addressDropdownItems.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {addressDropdownItems.map((dropDownItem, index) => (
                <li
                  key={dropDownItem}
                  onClick={() => handleSelectDistrictDropdown(dropDownItem)}
                  className={`p-2 hover:bg-gray-100 cursor-pointer text-sm ${
                    index === selectedIndex ? "bg-gray-100" : ""
                  }`}
                >
                  {dropDownItem}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleGetWeatherBtnClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 whitespace-nowrap"
        >
          날씨 조회
        </button>
      </div>

      <div className="mt-2 text-right">
        <button
          onClick={onCurrentLocation}
          className="text-sm text-gray-500 hover:text-blue-500 inline-flex items-center gap-1"
        >
          <MapPin size={14} /> 현재 위치 날씨 조회
        </button>
      </div>
    </div>
  );
}
