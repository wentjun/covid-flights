export interface Airport {
  icao: string;
  iata: string | null;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  elavation?: number;
  coordinates: number[];
  tz?: string;
}
