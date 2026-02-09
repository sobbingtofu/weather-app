import {WeatherDetailPage} from "@/views/weather-detail";

interface Props {
  params: Promise<{locationId: string}>;
}

export default async function Page({params}: Props) {
  const {locationId} = await params;
  console.log("Location ID:", locationId);
  const [latStr, longStr] = locationId.split("-");
  const lat = parseFloat(latStr);
  const long = parseFloat(longStr);

  if (isNaN(lat) || isNaN(long)) {
    return <div>Invalid Location</div>;
  }

  return <WeatherDetailPage lat={lat} long={long} />;
}
