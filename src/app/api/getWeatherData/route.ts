// 공공데이터포털에서 날씨정보 가져오기
import {getCurrentTimeInfo, formatDate} from "@/shared/lib/date";
import {convertLatLong, getUltraSrtNcstBase, getVilageFcstBase} from "@/entities/weather/lib/weatherDataUtils";
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
    // 1. 경도/위도를 기상청 격자 좌표로 변환
    const {x: nx, y: ny} = convertLatLong(lat, long);

    // 2. 현재 KST 시간 가져오기
    const now = getCurrentTimeInfo();

    // 3. API에 필요한 인자 준비
    // 초단기 실황에 필요한 데이터
    const {base_date: ncstDate, base_time: ncstTime} = getUltraSrtNcstBase(now);
    // 단기 예보에 필요한 데이터
    const {base_date: fcstDate, base_time: fcstTime} = getVilageFcstBase(now);

    const ncstUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${ncstDate}&base_time=${ncstTime}&nx=${nx}&ny=${ny}`;
    const fcstUrl = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${fcstDate}&base_time=${fcstTime}&nx=${nx}&ny=${ny}`;

    console.log(`[Weather] Fetching NCST: ${ncstDate} ${ncstTime} (nx:${nx}, ny:${ny})`);
    console.log(`[Weather] Fetching FCST: ${fcstDate} ${fcstTime} (nx:${nx}, ny:${ny})`);

    // 4. 병렬 Fetch API 호출
    const [ncstRes, fcstRes] = await Promise.all([fetch(ncstUrl), fetch(fcstUrl)]);

    // JSON/XML 응답을 parse하는 helper 함수
    const parseRes = async (res: Response, name: string) => {
      if (!res.ok) throw new Error(`${name} Fetch Failed: ${res.status} ${res.statusText}`);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        if (json.response?.header?.resultCode !== "00") {
          console.warn(`${name} API Warning:`, json.response?.header);
        }
        return json;
      } catch (error) {
        console.error(`${name} Parse Error. Body: ${text.substring(0, 100)}...`);
        console.error(error);
        throw new Error(`${name} returned invalid JSON/XML`);
      }
    };

    // 5. 응답 parse 실행
    const parsedNCSTResponse = await parseRes(ncstRes, "NCST");
    const parsedFCSTResponse = await parseRes(fcstRes, "FCST");

    // 6. 데이터 추출
    const ncstItems: NcstItem[] = parsedNCSTResponse.response?.body?.items?.item || [];
    const fcstItems: FcstItem[] = parsedFCSTResponse.response?.body?.items?.item || [];

    console.log("NCST Data Sample:", ncstItems.slice(0, 3));
    console.log("FCST Data Sample:", fcstItems.slice(0, 3));

    // 7. 현재 기온 데이터 추출
    const t1h = ncstItems.find((item) => item.category === "T1H");
    const currentTemperature = t1h ? t1h.obsrValue : null;

    // 8. 오늘의 최저/최고 기온 및 시간별 기온 리스트 추출
    const todayStr = formatDate(now);
    let minTemperature = null;
    let maxTemperature = null;
    const hourlyList: {date: string; time: string; temp: string}[] = [];

    fcstItems.forEach((item) => {
      if (item.fcstDate === todayStr) {
        if (item.category === "TMN") minTemperature = item.fcstValue;
        if (item.category === "TMX") maxTemperature = item.fcstValue;
        if (item.category === "TMP") {
          hourlyList.push({
            date: item.fcstDate,
            time: item.fcstTime,
            temp: item.fcstValue,
          });
        }
      }
    });

    // hourlyList를 날짜+시간 기준으로 정렬
    hourlyList.sort((a, b) => Number(a.date + a.time) - Number(b.date + b.time));

    const hourlyForecast = hourlyList.map((h) => ({
      date: h.date,
      time: `${h.time.substring(0, 2)}:00`,
      temp: h.temp,
    }));

    // 9. 최종 JSON응답 반환
    const responseData: WeatherResponse = {
      currentTemperature,
      minTemperature,
      maxTemperature,
      hourlyForecast,
    };

    return Response.json(responseData);
  } catch (error: unknown) {
    console.error("Weather Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather data";
    return Response.json({error: errorMessage}, {status: 500});
  }
}
