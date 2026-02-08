import {formatDate} from "@/shared/lib/date";
import {SkyStateType} from "../model/types";

/**
 * 위도(lat), 경도(long)를 기상청 격자 좌표(nx, ny)로 변환하는 함수
 ** LCC(Lambert Conformal Conic) 투영법을 사용하여 좌표계 변환 수행
 */
export function convertLatLong(lat: number, lng: number) {
  const EARTH_RADIUS = 6371.00877; // 지구 반경(km)
  const GRID = 5.0; // 격자 간격(km)
  const S_LAT1 = 30.0; // 투영 위도1(degree)
  const S_LAT2 = 60.0; // 투영 위도2(degree)
  const O_LON = 126.0; // 기준점 경도(degree)
  const O_LAT = 38.0; // 기준점 위도(degree)
  const XO = 43; // 기준점 X좌표(GRID)
  const YO = 136; // 기지점 Y좌표(GRID)
  const DEGRAD = Math.PI / 180.0;

  const re = EARTH_RADIUS / GRID;
  const slat1 = S_LAT1 * DEGRAD;
  const slat2 = S_LAT2 * DEGRAD;
  const olon = O_LON * DEGRAD;
  const olat = O_LAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);

  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;

  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);

  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return {x, y};
}

/**
 * 기상청의 '초단기실황(getUltraSrtNcst)' API를 호출하기 위해 필요한
 * 기준 날짜(base_date)와 기준 시간(base_time)을 계산하는 함수
 ** 현재 시각을 기준으로 API가 응답할 수 있는 가장 최근의 '초단기실황 발표 시각'을 반환
 */
export function getUltraSrtNcstBase(date: Date) {
  const baseDate = new Date(date);
  const minutes = baseDate.getMinutes();

  // 45분 전이라면 이전 시간을 사용
  if (minutes < 45) {
    baseDate.setHours(baseDate.getHours() - 1);
  }

  // setHours(-1)가 이전 날짜로 넘어가는 경우는 Date가 자동으로 처리함
  const h = baseDate.getHours().toString().padStart(2, "0");

  return {
    base_date: formatDate(baseDate),
    base_time: `${h}00`,
  };
}

/**
 * 기상청의 '단기예보(getVilageFcst)' API를 호출하기 위해 필요한
 * 기준 날짜(base_date)와 기준 시간(base_time)을 계산하는 함수
 ** 현재 시각을 기준으로 API가 응답할 수 있는 가장 최근의 '단기예보 발표 시각'을 반환
 */
export function getVilageFcstBase(date: Date) {
  const baseDate = new Date(date);
  const currentHour = baseDate.getHours();
  const minutes = baseDate.getMinutes();

  let effectiveHour = currentHour;
  if (minutes < 15) {
    effectiveHour = currentHour - 1;
  }

  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];
  let bestTime = -1;

  if (effectiveHour < 2) {
    baseDate.setDate(baseDate.getDate() - 1);
    bestTime = 23;
  } else {
    for (let i = baseTimes.length - 1; i >= 0; i--) {
      if (baseTimes[i] <= effectiveHour) {
        bestTime = baseTimes[i];
        break;
      }
    }
  }

  return {
    base_date: formatDate(baseDate),
    base_time: bestTime.toString().padStart(2, "0") + "00",
  };
}

/**
 * 강수 형태(PTY)와 하늘 상태(SKY)를 기반으로 종합적인 하늘 상태를 판별하는 함수
 */
export const determineSkyState = (pty: string, sky: string): SkyStateType => {
  // 강수 형태(PTY)가 우선순위가 높음
  if (pty === "1") return "비";
  if (pty === "2") return "비/눈";
  if (pty === "3") return "눈";
  if (pty === "4") return "소나기";

  // 강수가 없을 경우 하늘 상태(SKY) 판별
  if (sky === "1") return "맑음";
  if (sky === "3") return "구름많음";
  if (sky === "4") return "흐림";

  return "맑음";
};
