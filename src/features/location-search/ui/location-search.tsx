import {useState, useRef, useEffect} from "react";
import {useLocationSearch} from "../model/use-location-search";
import {MapPin, Search} from "lucide-react";

interface LocationSearchProps {
  onSelectLocation: (locationName: string) => void;
  onCurrentLocation: () => void;
}

export function LocationSearch({onSelectLocation, onCurrentLocation}: LocationSearchProps) {
  const {searchAddressInput, setSearchAddressInput, addressDropdownItems} = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputAndDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutsideInputAndDropdown = (event: MouseEvent) => {
      if (inputAndDropdownRef.current && !inputAndDropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideInputAndDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInputAndDropdown);
    };
  }, []);

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
    <div className="w-full relative z-50 max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative w-full" ref={inputAndDropdownRef}>
          <div className="flex w-full items-center pl-6 pr-2 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
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
              className="w-full border-none outline-none focus:outline-none focus:ring-0 text-gray-700 placeholder-gray-400 bg-transparent h-10"
            />
            <button
              onClick={handleGetWeatherBtnClick}
              className="bg-blue-500 text-white px-6 py-2.5 rounded-full hover:bg-blue-600 font-medium whitespace-nowrap transition-colors"
            >
              날씨 조회
            </button>
          </div>
          {isOpen && addressDropdownItems.length > 0 && (
            <ul className="absolute top-full left-4 right-4 bg-white border rounded-xl shadow-lg mt-2 max-h-60 overflow-y-auto z-10 py-2">
              {addressDropdownItems.map((dropDownItem, index) => (
                <li
                  key={dropDownItem}
                  onClick={() => handleSelectDistrictDropdown(dropDownItem)}
                  className={`px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 ${
                    index === selectedIndex ? "bg-blue-50" : ""
                  }`}
                >
                  {dropDownItem}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={onCurrentLocation}
            className="text-sm text-gray-500 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors font-medium"
          >
            <MapPin size={16} /> 현재 위치 날씨 조회
          </button>
        </div>
      </div>
    </div>
  );
}
