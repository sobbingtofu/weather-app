import {useState, useCallback} from "react";
import {reverseGeocode} from "@/entities/location";

interface Coords {
  lat: number;
  long: number;
}

interface UseDetectLocationProps {
  setErrorMsg: (msg: string | null) => void;
}

export function useDetectLocation({setErrorMsg}: UseDetectLocationProps) {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const detectLocation = useCallback(async (): Promise<{coords: Coords; addressName: string} | null> => {
    if (!navigator.geolocation) {
      setErrorMsg("현재 위치 정보에 접근할 수 없습니다.");
      return null;
    }

    setIsDetectingLocation(true);
    setErrorMsg(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (currentPosition) => {
          const {latitude, longitude} = currentPosition.coords;

          const reverseGeocodeResult = await reverseGeocode(latitude, longitude);

          if (!reverseGeocodeResult.success) {
            console.error("역지오코딩 중 오류 발생: ", reverseGeocodeResult.errorMsg);
            setErrorMsg("행정동명 찾기에 실패했습니다.");
            setIsDetectingLocation(false);
            resolve(null);
            return;
          }

          setIsDetectingLocation(false);
          resolve({
            coords: {lat: latitude, long: longitude},
            addressName: reverseGeocodeResult.matchedDistrict,
          });
        },
        (err) => {
          console.error("navigator.geolocation error:", err);
          setErrorMsg(
            "현재 위치 정보에 대한 접근 권한이 없습니다.\n 디바이스 설정을 확인해주세요.\n 장소를 검색해 날씨를 조회할 수 있습니다.",
          );
          setIsDetectingLocation(false);
          resolve(null);
        },
        {timeout: 10000},
      );
    });
  }, [setErrorMsg]);

  return {
    isDetectingLocation,
    detectLocation,
  };
}
