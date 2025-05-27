export interface HistoricalEvents {
  year: string;
  description: string
}

export interface TimePriod {
  label: string;
  category?: string;
  beginningTimePeriod: string;
  endTimePeriod: string;
  events: HistoricalEvents[];
}