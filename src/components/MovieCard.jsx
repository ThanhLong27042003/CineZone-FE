import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StarIcon, Clock3Icon, TicketIcon } from "lucide-react";
import timeFormat from "../../utils/timeFormat";

const MovieCard = ({ movie = {} }) => {
  const navigate = useNavigate();

  const id = movie.id || movie._id || movie.movieId;
  const title = movie.title || movie.tenPhim || "Untitled";
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "";
  const runtime = movie.runtime ? timeFormat(movie.runtime) : "";
  const rating =
    typeof movie.voteAverage === "number"
      ? movie.voteAverage.toFixed(1)
      : movie.voteAverage || "—";
  const genres =
    Array.isArray(movie.genres) && movie.genres.length
      ? movie.genres.slice(0, 2).map((g) => g.name)
      : [];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="group w-72 min-w-[18rem] basis-72 flex-shrink-0"
    >
      {/* Gradient border wrapper */}
      <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-primary/60 via-fuchsia-500/40 to-cyan-400/40 hover:from-primary via-fuchsia-500 to-cyan-400 transition-colors">
        {/* Card body */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-900">
          {/* Poster */}
          <motion.img
            src={movie?.backdropPath?.replace("upload/", "upload/h_196,w_291/")}
            loading="lazy"
            alt={title}
            onError={(e) => {
              e.currentTarget.src =
                "https://media.dolenglish.vn/PUBLIC/MEDIA/2b2f1391-7dcd-4d41-b1eb-2273c8cd00de.jpg";
            }}
            className="h-48 w-full object-cover select-none will-change-transform"
            initial={{ scale: 1.02 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onClick={() => id && navigate(`/movies/${id}`)}
          />

          {/* Top badges */}
          <div className="pointer-events-none absolute inset-x-0 top-0 p-3 flex justify-between">
            <div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs text-amber-300">
              <StarIcon className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="font-semibold">{rating}</span>
            </div>
            {runtime && (
              <div className="flex items-center gap-1 rounded-full bg-black/60 backdrop-blur px-2.5 py-1 text-xs text-gray-200">
                <Clock3Icon className="w-4 h-4 text-primary" />
                <span>{runtime}</span>
              </div>
            )}
          </div>

          {/* Info glass overlay (always visible) */}
          <div className="absolute inset-x-0 bottom-0">
            <div className="bg-gradient-to-t from-black/85 via-black/50 to-transparent">
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">{title}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{year}</p>

                {/* Genres as chips */}
                {genres.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="text-[10px] tracking-wide px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-gray-200"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => id && navigate(`/movies/${id}`)}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dull text-white text-xs font-semibold px-3.5 py-2 shadow-lg shadow-primary/20"
                >
                  <TicketIcon className="w-4 h-4" />
                  Buy Tickets
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle card shadow */}
      <div className="h-3 rounded-b-2xl bg-gradient-to-t from-black/30 to-transparent" />
    </motion.div>
  );
};

export default MovieCard;
