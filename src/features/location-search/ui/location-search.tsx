import {useState} from "react";
import {useLocationSearch} from "../model/use-location-search";
import {MapPin} from "lucide-react";

interface LocationSearchProps {
  onSelectLocation: (locationName: string) => void;
  onCurrentLocation: () => void;
}

export function LocationSearch({onSelectLocation, onCurrentLocation}: LocationSearchProps) {
  const {searchAddressInput, setSearchAddressInput, results} = useLocationSearch();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectDistrictDropdown = (result: string) => {
    setSearchAddressInput(result);
    setIsOpen(false);
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
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="시, 군, 구, 동 검색"
            className="w-full p-2 border rounded-md"
          />
          {isOpen && results.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {results.map((result) => (
                <li
                  key={result}
                  onClick={() => handleSelectDistrictDropdown(result)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                  {result}
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
