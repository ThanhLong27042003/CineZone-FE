import { http } from "../../utils/baseUrl";

export const getAllStats = async () => {
  try {
    const response = await http.get("/general/getAllStats");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

export const getCinemaStats = async () => {
  try {
    const response = await http.get("/general/cinema");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cinema stats:", error);
    throw error;
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await http.get("/general/trending");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const getComingSoonMovies = async () => {
  try {
    const response = await http.get("/general/coming-soon");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching coming soon movies:", error);
    throw error;
  }
};

export const getCinemaInfo = async () => {
  try {
    const response = await http.get("/general/cinema-info");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cinema info:", error);
    throw error;
  }
};
