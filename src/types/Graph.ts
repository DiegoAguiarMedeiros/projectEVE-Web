export interface AnalyticsCurrentEnvelopes {
  labels: string[];
  colors: string[];
  values: number[];
  subValues: number[];
  pureValues: number[];
}

export interface AnalyticsEnvelopesByYear {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

export interface AnalyticsEnvelopesMonthOverview {
  title: string;
  total: number;
  icon: "CallMadeIcon" | "SavingsIcon" | "SouthEastIcon" | "AttachMoneyIcon";
  color: "primary" | "secondary" | "info" | "warning" | "success" | "error";
}
