import { api } from "src/api/client";
import { AnalyticsCurrentEnvelopes, AnalyticsEnvelopesByYear, AnalyticsEnvelopesMonthOverview } from "src/types/Graph";

export const listAnalyticsCurrentEnvelopes = (year: number, month: number) =>
  api.get<AnalyticsCurrentEnvelopes>(`/graph/analytics-current-envelopes/${year}/${month}`);

export const listAnalyticsEnvelopesMonthOverview = (year: number, month: number) =>
  api.get<AnalyticsEnvelopesMonthOverview[]>(`/graph/analytics-envelopes-month-overview/${year}/${month}`);

export const listAnalyticsEnvelopesByYear = (year: number) =>
  api.get<AnalyticsEnvelopesByYear>(`/graph/analytics-envelopes-by-year/${year}`);

export const getGoalsCumulativeAmount = (year: number, month: number) =>
  api.get<number>(`/graph/goals-cumulative/${year}/${month}`);
