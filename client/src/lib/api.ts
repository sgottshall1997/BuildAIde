import { apiRequest } from "./queryClient";
import type { InsertEstimate, InsertSchedule } from "@shared/schema";

export const api = {
  estimates: {
    list: () => fetch("/api/estimates").then(res => res.json()),
    create: (data: InsertEstimate) => apiRequest("POST", "/api/estimates", data),
  },
  schedules: {
    list: () => fetch("/api/schedules").then(res => res.json()),
    create: (data: InsertSchedule) => apiRequest("POST", "/api/schedules", data),
  },
  stats: {
    get: () => fetch("/api/stats").then(res => res.json()),
  },
};
