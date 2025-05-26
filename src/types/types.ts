export interface HistoricalEvents {
  category?: string;
  year: string;
  description: string
}

export interface TimePriod {
  label: string;
  beginningTimePeriod: string;
  endTimePeriod: string;
  events: HistoricalEvents[];
}