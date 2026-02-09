// 공공데이터포털에서 날씨정보 가져오기
import {getCurrentTimeInfo, formatDate} from "@/entities/date-time/lib/dateTimeUtils";
import {
  convertLatLong,
  determineSkyState,
  getUltraSrtNcstBase,
  getVilageFcstBase,
} from "@/entities/weather/lib/weatherDataUtils";
import {type NcstItem, type FcstItem, type WeatherResponse} from "@/entities/weather/model/types";

const PUBLIC_GOV_DATA_PORTAL_KEY = process.env.PUBLIC_GOV_DATA_PORTAL_KEY || "";
const encodedKey = PUBLIC_GOV_DATA_PORTAL_KEY.includes("%")
  ? PUBLIC_GOV_DATA_PORTAL_KEY
  : encodeURIComponent(PUBLIC_GOV_DATA_PORTAL_KEY);

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const latStr = searchParams.get("lat");
  const longStr = searchParams.get("long");

  if (!latStr || !longStr) {
    return Response.json({error: "Latitude and longitude are required."}, {status: 400});
  }

  const lat = parseFloat(latStr);
  const long = parseFloat(longStr);

  try {
    const {x: nx, y: ny} = convertLatLong(lat, long);
    const now = getCurrentTimeInfo();
    const todayStr = formatDate(now);
    const currentHourStr = now.getHours().toString().padStart(2, "0") + "00";

    const {base_date: ncstDate, base_time: ncstTime} = getUltraSrtNcstBase(now);
    const {base_date: fcstDate, base_time: fcstTime} = getVilageFcstBase(now);

    const ncstUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${ncstDate}&base_time=${ncstTime}&nx=${nx}&ny=${ny}`;
    const fcstUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${fcstDate}&base_time=${fcstTime}&nx=${nx}&ny=${ny}`;

    const [ncstRes, fcstRes] = await Promise.all([fetch(ncstUrl), fetch(fcstUrl)]);

    const parseRes = async (res: Response, name: string) => {
      if (!res.ok) throw new Error(`${name} Fetch Failed: ${res.status}`);
      const text = await res.text();
      return JSON.parse(text);
    };

    const parsedNCSTResponse = await parseRes(ncstRes, "NCST");
    const parsedFCSTResponse = await parseRes(fcstRes, "FCST");

    const ncstItems: NcstItem[] = parsedNCSTResponse.response?.body?.items?.item || [];
    const fcstItems: FcstItem[] = parsedFCSTResponse.response?.body?.items?.item || [];

    // 1. 현재 기온 및 현재 강수형태(PTY) 추출 (실황)
    const t1h = ncstItems.find((item) => item.category === "T1H");
    const pty = ncstItems.find((item) => item.category === "PTY");
    const currentTemperature = t1h ? t1h.obsrValue : null;
    const currentPty = pty ? pty.obsrValue : "0";

    // 2. 단기예보 데이터 파싱 (시간대별로 데이터 그룹화)
    let minTemperature: string | null = null;
    let maxTemperature: string | null = null;
    const hourlyMap: Record<string, {temp?: string; sky?: string; pty?: string; date: string}> = {};

    fcstItems.forEach((item) => {
      if (item.fcstDate === todayStr) {
        if (item.category === "TMN") minTemperature = item.fcstValue;
        if (item.category === "TMX") maxTemperature = item.fcstValue;
      }

      // 시간대별 정보 수집 (오늘 이후 예보도 포함될 수 있음)
      const key = `${item.fcstDate}_${item.fcstTime}`;
      if (!hourlyMap[key]) {
        hourlyMap[key] = {date: item.fcstDate};
      }

      if (item.category === "TMP") hourlyMap[key].temp = item.fcstValue;
      if (item.category === "SKY") hourlyMap[key].sky = item.fcstValue;
      if (item.category === "PTY") hourlyMap[key].pty = item.fcstValue;
    });

    // 3. 현재 하늘상태(SKY) 추출 (예보 데이터 중 현재 시간과 일치하는 것 찾기)
    const currentFcstKey = `${todayStr}_${currentHourStr}`;
    const currentSky = hourlyMap[currentFcstKey]?.sky || "1";
    const currentSkyState = determineSkyState(currentPty, currentSky);

    // 4. 시간대별 예보 리스트 생성
    const hourlyForecast = Object.entries(hourlyMap)
      .map(([key, value]) => ({
        date: value.date,
        time: `${key.split("_")[1].substring(0, 2)}:00`,
        temp: value.temp || "",
        hourlySkyState: determineSkyState(value.pty || "0", value.sky || "1"),
      }))
      .filter((item) => item.date === todayStr) // 당일 데이터만 필터링 (필요시 제거 가능)
      .sort((a, b) => Number(a.date + a.time.replace(":", "")) - Number(b.date + b.time.replace(":", "")));

    if (!minTemperature || !maxTemperature) {
      const temps = hourlyForecast.map((t) => parseFloat(t.temp)).filter((t) => !isNaN(t));
      if (temps.length > 0) {
        minTemperature = Math.min(...temps).toString();
        maxTemperature = Math.max(...temps).toString();
      }
    }

    const responseData: WeatherResponse = {
      currentTemperature,
      currentSkyState,
      minTemperature,
      maxTemperature,
      hourlyForecast,
    };

    return Response.json(responseData);
  } catch (error: unknown) {
    console.error("Weather Route Error:", error);
    return Response.json({error: "Failed to fetch weather data"}, {status: 500});
  }
}
