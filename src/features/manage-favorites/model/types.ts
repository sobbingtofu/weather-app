export interface FavoriteLocation {
  id: string; // unique (e.g. lat-lon combo or random)
  name: string; // Original location name
  alias?: string; // User defined name
  lat: number;
  long: number;
}
