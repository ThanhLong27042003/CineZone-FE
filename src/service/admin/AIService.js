import { authHttp } from "../../../utils/baseUrl";

export const getAIServiceStatus = () => {
  return authHttp.get("/admin/ai/status").then((res) => res.data.result);
};

export const getAIAnalytics = () => {
  return authHttp
    .get("/admin/ai/analytics", { timeout: 80000 })
    .then((res) => res.data.result);
};

export const trainModel = () => {
  return authHttp
    .post("/admin/ai/train-model", {}, { timeout: 80000 })
    .then((res) => res.data.result);
};

export const optimizeSchedule = (rooms, dateRange, constraints) => {
  return authHttp
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
