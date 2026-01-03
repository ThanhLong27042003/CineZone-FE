import { http } from "../../utils/baseUrl";

/**
 * Get all statistics for home page
 */
export const getAllStats = async () => {
  try {
    const response = await http.get("/general/getAllStats");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw error;
  }
};

/**
 * Get cinema statistics only
 */
export const getCinemaStats = async () => {
  try {
    const response = await http.get("/general/cinema");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cinema stats:", error);
    throw error;
  }
};

/**
 * Get trending movies
 */
export const getTrendingMovies = async () => {
  try {
    const response = await http.get("/general/trending");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

/**
 * Get coming soon movies
 */
export const getComingSoonMovies = async () => {
  try {
    const response = await http.get("/general/coming-soon");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching coming soon movies:", error);
    throw error;
  }
};

/**
 * Get cinema info
 */
export const getCinemaInfo = async () => {
  try {
    const response = await http.get("/general/cinema-info");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching cinema info:", error);
    throw error;
  }
};
