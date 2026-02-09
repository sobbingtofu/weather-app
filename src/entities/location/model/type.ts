export interface reverseGeocodeResultType {
  success: boolean;
  matchedDistrict: string;
  errorMsg?: string;
}

export interface forwardGeocodeResultType {
  lat: number;
  long: number;
}

export interface KakaoRegionDocument {
  region_type: "B" | "H";
  code: string;
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  x: number; // long
  y: number; // lat
}

export interface KakaoAddressInfo {
  address_name: string;
  b_code: string;
  h_code: string;
  main_address_no: string;
  mountain_yn: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_h_name: string;
  region_3depth_name: string;
  sub_address_no: string;
  x: string;
  y: string;
}

export interface KakaoAddressDocument {
  address: KakaoAddressInfo | null;
  address_name: string;
  address_type: string;
  road_address: string | null;
  x: string;
  y: string;
}

export interface KakaoAddressSearchResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoAddressDocument[];
}

export interface KakaoCoord2RegionResponse {
  meta: {
    total_count: number;
  };
  documents: KakaoRegionDocument[];
}
