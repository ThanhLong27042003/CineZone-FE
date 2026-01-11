package com.longtapcode.identity_service.controller;


import com.longtapcode.identity_service.dto.request.ApiResponse;
import com.longtapcode.identity_service.dto.response.CastResponse;
import com.longtapcode.identity_service.dto.response.MovieResponse;
import com.longtapcode.identity_service.entity.Movie;
import com.longtapcode.identity_service.service.AIRecommendationService;
import com.longtapcode.identity_service.service.CastService;
import com.longtapcode.identity_service.service.MovieService;
import com.longtapcode.identity_service.service.StatsService;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/general")
@AllArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE ,makeFinal= true)
public class GeneralController {
    MovieService movieService;
    CastService castService;
    AIRecommendationService aiRecommendationService;
    private final StatsService statsService;

    @GetMapping("search/{keyword}")
    public ApiResponse<?> search(@PathVariable String keyword){
        List<MovieResponse> movieResponse = movieService.searchMovies(keyword);
        List<CastResponse> castResponse = castService.searchCasts(keyword);
        if(!movieResponse.isEmpty()){
            return ApiResponse.<List<MovieResponse>>builder()
                    .result(movieResponse)
                    .build();
        } else if (!castResponse.isEmpty()) {
            return ApiResponse.<List<CastResponse>>builder()
                    .result(castResponse)
                    .build();
        }else{
            return ApiResponse.<String>builder()
                    .result("Không tìm thấy kết quả nào!!!")
                    .build();
        }
    }

    @GetMapping("/getAllStats")
    public ApiResponse<Map<String, Object>> getAllStats() {
        return ApiResponse.<Map<String, Object>>builder()
                .result(statsService.getAllStats())
                .build();
    }


    @GetMapping("/cinema")
    public ApiResponse<Map<String, Object>> getCinemaStats() {
        return ApiResponse.<Map<String, Object>>builder()
                .result(statsService.getCinemaStats())
                .build();
    }

    /**
     * Get trending movies
     */
    @GetMapping("/trending")
    public ApiResponse<Object> getTrendingMovies() {
        return ApiResponse.builder()
                .result(statsService.getTrendingMovies())
                .build();
    }

    /**
     * Get coming soon movies
     */
    @GetMapping("/coming-soon")
    public ApiResponse<Object> getComingSoonMovies() {
        return ApiResponse.builder()
                .result(statsService.getComingSoonMovies())
                .build();
    }

    /**
     * Get cinema info
     */
    @GetMapping("/cinema-info")
    public ApiResponse<Map<String, Object>> getCinemaInfo() {
        return ApiResponse.<Map<String, Object>>builder()
                .result(statsService.getCinemaInfo())
                .build();
    }

    public List<Movie> getRecommendedMovies(Long movieId, int limit) {
        log.info("🎯 Getting AI recommendations for movie: {}", movieId);
        return aiRecommendationService.getRecommendations(movieId, limit);
    }

    /**
     * ✅ Get AI recommendations with user history (hybrid approach)
     */
    public List<Movie> getRecommendedMoviesWithHistory(Long movieId, int limit, List<Integer> userHistory) {
        log.info("🎯 Getting AI hybrid recommendations for movie: {}, userHistory: {}",
                movieId, userHistory != null ? userHistory.size() : 0);
        return aiRecommendationService.getRecommendationsWithHistory(movieId, limit, userHistory);
    }
}
