import {NextRequest, NextResponse} from "next/server";
import {KakaoAddressSearchResponse} from "@/entities/location/model/type";

const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const ENCODED_KAKAO_KEY =
  KAKAO_REST_API_KEY &&
  (KAKAO_REST_API_KEY.includes("%") ? KAKAO_REST_API_KEY : encodeURIComponent(KAKAO_REST_API_KEY));
const KAKAO_HOST = "https://dapi.kakao.com";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({error: "Address is missing"}, {status: 400});
  }

  try {
    if (!ENCODED_KAKAO_KEY) {
      throw new Error("KAKAO_REST_API_KEY가 설정되지 않았습니다.");
    }

    // 하이픈을 공백으로 치환 > Kakao 검색 정확도 향상
    const addressQueryStr = address.replace(/-/g, " ");

    console.log("Server-side Forward geocoding via Kakao for:", addressQueryStr);

    const res = await fetch(`${KAKAO_HOST}/v2/local/search/address.json?query=${encodeURIComponent(addressQueryStr)}`, {
      headers: {
        Authorization: `KakaoAK ${ENCODED_KAKAO_KEY}`,
      },
    });

    if (!res.ok) throw new Error("Geocoding failed");

    const data: KakaoAddressSearchResponse = (await res.json()) as KakaoAddressSearchResponse;

    if (data.documents && data.documents.length > 0) {
      const targetDoc = data.documents[0];
      return NextResponse.json({lat: parseFloat(targetDoc.y), long: parseFloat(targetDoc.x)});
    } else {
      throw new Error("No address found");
    }
  } catch (e) {
    console.error("Server-side Forward geocoding error", e);
    return NextResponse.json({error: (e as Error).message}, {status: 500});
  }
}
