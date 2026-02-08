import {useState, useMemo} from "react";
import DISTRICT_JSON from "@/shared/data/korea_districts.json";

// Max results to show in dropdown
const MAX_RESULTS = 10;

export function useLocationSearch() {
  const [searchAddressInput, setSearchAddressInput] = useState("");

  const addressDropdownItems = useMemo(() => {
    if (!searchAddressInput.trim()) return [];

    return DISTRICT_JSON.filter((districtItem) => districtItem.includes(searchAddressInput)).slice(0, MAX_RESULTS);
  }, [searchAddressInput]);

  return {
    searchAddressInput,
    setSearchAddressInput,
    addressDropdownItems,
  };
}
