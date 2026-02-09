import {useState, useMemo} from "react";
import DISTRICT_JSON from "@/shared/data/korea_districts.json";
import {useDebounce} from "@/shared/lib/hooks/useDebounce";

// Max results to show in dropdown
const MAX_RESULTS = 10;

export function useLocationSearch() {
  const [searchAddressInput, setSearchAddressInput] = useState("");
  const debouncedSearchAddressInput = useDebounce(searchAddressInput, 400);

  const addressDropdownItems = useMemo(() => {
    if (!debouncedSearchAddressInput.trim()) return [];

    return DISTRICT_JSON.filter((districtItem) => districtItem.includes(debouncedSearchAddressInput)).slice(
      0,
      MAX_RESULTS,
    );
  }, [debouncedSearchAddressInput]);

  return {
    searchAddressInput,
    setSearchAddressInput,
    addressDropdownItems,
  };
}
