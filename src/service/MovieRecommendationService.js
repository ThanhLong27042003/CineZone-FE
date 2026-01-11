import { http } from "../../utils/baseUrl";


export const getMovieRecommendations = async (movieId, limit = 4) => {
  try {
    const response = await http.get(
      `/general/recommendations/${movieId}`,
      {
        params: { limit },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
