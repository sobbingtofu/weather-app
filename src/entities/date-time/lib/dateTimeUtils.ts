import {TimeThemeType} from "@/entities/date-time/model/type";

/**
 * 현재 시스템 시간을 기준으로 한국 표준시(KST) Date 객체를 반환하는 함수
 ** UTC 기반 환경(Vercel 등)에서도 정확한 KST(UTC+9) 시간을 계산하여 반환
 */
export function getCurrentTimeInfo() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const kstGap = 9 * 60 * 60 * 1000; // 9시간
  const kstDate = new Date(utc + kstGap);
  return kstDate;
}

/**
 * Date 객체를 YYYYMMDD 형식의 문자열로 변환하는 함수
 ** API 요청에 필요한 8자리 날짜 문자열(예: 20260209) 생성
 */
export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}${month}${day}`;
}

/**
 * 시간에 따른 테마 이름을 반환하는 함수
 * - dawn: 04:00 ~ 07:59
 * - morning: 08:00 ~ 10:59
 * - noon: 11:00 ~ 16:59
 * - twilight: 17:00 ~ 19:59
 * - night: 20:00 ~ 03:59
 */
export function getTimeTheme(date: Date): TimeThemeType {
  const hour = date.getHours();
  if (hour >= 4 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "noon";
  if (hour >= 17 && hour < 20) return "twilight";
  return "night";
}
