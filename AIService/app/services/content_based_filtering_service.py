import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
from app.models.movie import Movie

class ContentBasedFilteringService:
    def __init__(self,logger):
        logger.info("Loading BERT model...")
        self.model = SentenceTransformer(
            "paraphrase-multilingual-MiniLM-L12-v2")
        self.embedding_cache = {}
        logger.info("BERT model loaded successfully")

    def get_text_embedding(self,text: str) ->np.ndarray:
        if text in self.embedding_cache:
            return self.embedding_cache[text]
        
        embedding = self.model.encode(text, convert_to_tensor=False)
        self.embedding_cache[text] = embedding
        return embedding
    
    def calculate_content_similarity(self, movie1: Movie, movie2: Movie)->float:
        scores = []
        weights = []
        if movie1.overview and movie2.overview:
            emb1 = self.get_text_embedding(movie1.overview).reshape(1,-1)
            emb2 = self.get_text_embedding(movie2.overview).reshape(1,-1)
            scores.append(float(cosine_similarity(emb1,emb2)[0][0]))
            weights.append(0.4)

        if movie1.genreIds and movie2.genreIds:
            g1,g2 = set(movie1.genreIds), set(movie2.genreIds)
            scores.append(len(g1 & g2) / len(g1 | g2))
            weights.append(0.25)

        if movie1.castIds and movie2.castIds:
            c1, c2 = set(movie1.castIds), set(movie2.castIds)
            scores.append(len(c1 & c2) / len(c1 | c2))
            weights.append(0.20)

        if movie1.voteAverage is not None and movie2.voteAverage is not None:
            diff = abs(movie1.voteAverage - movie2.voteAverage)
            scores.append(max(0, 1 - diff / 10.0))
            weights.append(0.10)

        if movie1.releaseDate and movie2.releaseDate:
            try:
                d1 = datetime.strptime(movie1.releaseDate, "%Y-%m-%d")
                d2 = datetime.strptime(movie2.releaseDate, "%Y-%m-%d")
                years = abs((d1 - d2).days) / 365.0
                scores.append(max(0, 1 - years / 5.0))
                weights.append(0.05)
            except:
                pass

        if not scores:
            return 0.0
        
        return sum(s * w for s,w in zip(scores,weights)) / len(weights)



    def get_recommendations(self, target_movie_id, all_movies, limit):
        target_movie = next((m for m in all_movies if m.id == target_movie_id), None)
        if not target_movie:
            raise ValueError("Movie Not Found")
        
        results = []
        for movie in all_movies:
            if movie.id == target_movie_id:
                continue
            sim = self.calculate_content_similarity(target_movie,movie)
            results.append({
                "movieId": movie.id,
                "title": movie.title,
                "similarity": sim,
                "overview": movie.overview,
                "voteAverage": movie.voteAverage,
                "releaseDate": movie.releaseDate,
            })

        results.sort(key=lambda x:x["similarity"],reverse=True)
        return results[:limit]
