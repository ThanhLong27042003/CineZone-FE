import { http } from "../../../utils/baseUrl";

export const getAIServiceStatus = () => {
  return http.get("/admin/ai/status").then((res) => res.data.result);
};

export const getAIAnalytics = () => {
  return http
    .get("/admin/ai/analytics", { timeout: 80000 })
    .then((res) => res.data.result);
};

export const trainModel = () => {
  return http
    .post("/admin/ai/train-model", {}, { timeout: 80000 })
    .then((res) => res.data.result);
};

export const optimizeSchedule = (rooms, dateRange, constraints) => {
  return http
    .post(
      "/admin/ai/optimize-schedule",
      {
        rooms,
        dateRange,
        constraints,
      },
      { timeout: 300000 }
    )
    .then((res) => res.data.result);
};
