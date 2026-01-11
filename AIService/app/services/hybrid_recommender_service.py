from app.services.content_based_filtering_service import ContentBasedFilteringService
from app.services.colloborative_filtering_service import CollaborativeFilteringService

class HybridRecommenderService:
    def __init__(self, logger):
        self.content = ContentBasedFilteringService(logger)
        self.collab = CollaborativeFilteringService()

    def get_recommendations(
        self, movie_id, all_movies, limit, use_collaborative, user_history
    ):
        content_recs = self.content.get_recommendations(
            movie_id, all_movies, limit * 2
        )

        collab_recs = []
        if use_collaborative and user_history:
            collab_recs = self.collab.get_recommendations(
                movie_id, all_movies, user_history, limit * 2
            )

        if collab_recs:
            scores = {}
            for i, r in enumerate(content_recs):
                scores[r["movieId"]] = {
                    "score": r["similarity"] * 0.6,
                    "data": r,
                }

            for r in collab_recs:
                if r["movieId"] in scores:
                    scores[r["movieId"]]["score"] += r["similarity"] * 0.4
                else:
                    scores[r["movieId"]] = {
                        "score": r["similarity"] * 0.4,
                        "data": r,
                    }

            sorted_items = sorted(
                scores.values(), key=lambda x: x["score"], reverse=True
            )
            return [x["data"] for x in sorted_items[:limit]], "hybrid"

        return content_recs[:limit], "content-based (BERT)"
