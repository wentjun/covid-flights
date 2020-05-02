export interface PanelFilterCount {
  name: string;
  icao: string;
  count: number;
  checked: boolean;
}

export interface FilterContext {
  selectedDate: number;
  removedAirlines: string[];
}
