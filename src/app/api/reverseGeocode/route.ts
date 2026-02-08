import {NextRequest, NextResponse} from "next/server";
import {findClosestDistrict} from "@/entities/location/model/jsonMatcher";
import {KakaoCoord2RegionResponse} from "@/entities/location/model/type";

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const ENCODED_KAKAO_REST_API_KEY =
  KAKAO_REST_API_KEY &&
  (KAKAO_REST_API_KEY.includes("%") ? KAKAO_REST_API_KEY : encodeURIComponent(KAKAO_REST_API_KEY));
const KAKAO_HOST = "https://dapi.kakao.com";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      {success: false, matchedDistrict: "서울특별시", errorMsg: "lat or lon is missing"},
      {status: 400},
    );
  }

  try {
    if (!ENCODED_KAKAO_REST_API_KEY) {
      throw new Error("KAKAO_REST_API_KEY가 설정되지 않았습니다.");
    }

    console.log(
      "Server-side reverse geocoding execution url:",
      `${KAKAO_HOST}/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`,
    );

    const res = await fetch(`${KAKAO_HOST}/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`, {
      headers: {
        Authorization: `KakaoAK ${ENCODED_KAKAO_REST_API_KEY}`,
      },
    });

    if (!res.ok) {
      throw new Error(`지정된 경도와 위도에 대한 역지오코딩의 response가 정상이 아닙니다. status: ${res.status}`);
    }
    const kakaoApiFetchedData: KakaoCoord2RegionResponse = (await res.json()) as KakaoCoord2RegionResponse;

    // 행정동(H) 정보 우선 찾기
    const document =
      kakaoApiFetchedData.documents.find((doc) => doc.region_type === "H") || kakaoApiFetchedData.documents[0];

    if (!document) {
      throw new Error(`역지오코딩 결과가 없습니다. 경도: ${lon}, 위도: ${lat}`);
    }

    const components = {
      region_1depth_name: document.region_1depth_name,
      region_2depth_name: document.region_2depth_name,
      region_3depth_name: document.region_3depth_name,
      region_4depth_name: document.region_4depth_name,
    };

    const match = findClosestDistrict(components);
    if (match.findSuccess) {
      return NextResponse.json({success: true, matchedDistrict: match.findResult});
    } else {
      throw new Error("DISTRICT_JSON에서 행정동명 매칭 실패");
    }
  } catch (e) {
    console.error("Server-side Reverse geocoding error", e);
    return NextResponse.json(
      {success: false, matchedDistrict: "서울특별시", errorMsg: (e as Error).message},
      {status: 500},
    );
  }
}
