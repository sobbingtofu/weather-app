import {forwardGeocodeResultType, reverseGeocodeResultType} from "../model/type";

/**
 ** 경도와 위도를 받아 행정동명(e.g. 서울특별시 종로구 청운동) 반환
 ** 앱 최초 진입 시 GPS 기반 경도/위도 데이터로 행정동명 가져올 때 사용
 ** /api/reverseGeocode route를 통해 처리
 **/
export async function reverseGeocode(lat: number, lon: number): Promise<reverseGeocodeResultType> {
  try {
    const res = await fetch(`/api/reverseGeocode?lat=${lat}&lon=${lon}`);
    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        matchedDistrict: data.matchedDistrict || "서울특별시",
        errorMsg: data.errorMsg || `API Error: ${res.status}`,
      };
    }

    return {
      success: data.success,
      matchedDistrict: data.matchedDistrict,
      errorMsg: data.errorMsg,
    };
  } catch (e) {
    console.error("Reverse geocoding error (client)", e);
    return {success: false, matchedDistrict: "서울특별시", errorMsg: (e as Error).message};
  }
}

/**
 * 주소 문자열을 받아 경도와 위도 반환
 * 사용자가 주소 선택해 검색 진행 시, 주소로부터 경도/위도 가져올 때 사용
 * /api/forwardGeocode route를 통해 처리
 **/
export async function forwardGeocode(address: string): Promise<forwardGeocodeResultType | null> {
  try {
    const res = await fetch(`/api/forwardGeocode?address=${encodeURIComponent(address)}`);

    if (!res.ok) {
      console.error("Forward geocoding API failed", await res.text());
      return null;
    }

    const data = await res.json();
    return {lat: data.lat, long: data.long};
  } catch (e) {
    console.error("Forward geocoding error (client)", e);
    return null;
  }
}
