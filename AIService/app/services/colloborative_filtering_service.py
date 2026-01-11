class CollaborativeFilteringService:
    def get_recommendations(self, target_movie_id, all_movies, user_history, limit):
        if not user_history or len(user_history) < 2:
            return []

        watched_genres = set()
        watched_casts = set()

        for movie in all_movies:
            if movie.id in user_history:
                watched_genres.update(movie.genreIds)
                watched_casts.update(movie.castIds)

        results = []
        for movie in all_movies:
            if movie.id == target_movie_id or movie.id in user_history:
                continue

            g = len(set(movie.genreIds) & watched_genres)
            c = len(set(movie.castIds) & watched_casts)
            score = g * 0.6 + c * 0.4

            results.append({
                "movieId": movie.id,
                "title": movie.title,
                "similarity": score / 10.0,
                "overview": movie.overview,
                "voteAverage": movie.voteAverage,
                "releaseDate": movie.releaseDate,
            })

        results.sort(key=lambda x: x["similarity"], reverse=True)
        return results[:limit]
