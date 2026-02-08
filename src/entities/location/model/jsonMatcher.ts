import DISTRICT_JSON from "@/shared/data/korea_districts.json";

/**
 ** 카카오 주소 객체(1depth, 2depth, 3depth)를 받아
 ** JSON 데이터(korea_districts.json)에 가장 근접한 행정동명 String 반환
 **/
export function findClosestDistrict(addressComponents: {
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
}): {
  findSuccess: boolean;
  findResult: string;
} {
  const {region_1depth_name, region_2depth_name, region_3depth_name, region_4depth_name} = addressComponents;

  const addressCandidates = [
    // 1. 4단계 매칭 시도 (예: 경상남도-밀양시-부북면-운전리) - 4depth가 존재할 때만
    region_4depth_name ? `${region_1depth_name}-${region_2depth_name}-${region_3depth_name}-${region_4depth_name}` : "",
    //21. 3단계 매칭 시도 (예: 서울특별시-종로구-청운동)
    `${region_1depth_name}-${region_2depth_name}-${region_3depth_name}`,
    // 3. 시/도 + 시/군/구 매칭 시도 (예: 서울특별시-종로구)
    `${region_1depth_name}-${region_2depth_name}`,
    // 4. 읍/면/동 단독 매칭 시도 - 데이터가 이상해질 순 있으니 최후의 수단
    region_3depth_name,
  ];

  const validCandidates = addressCandidates.flatMap((candidate) =>
    candidate && candidate.length > 0 ? [candidate] : [],
  );

  for (const candidate of validCandidates) {
    const match = DISTRICT_JSON.find((d) => d.includes(candidate));
    if (match) return {findSuccess: true, findResult: match};
  }

  // 못찾으면 일단 서울특별시 반환
  return {findSuccess: false, findResult: "서울특별시"};
}
