import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BlurCircle from "./BlurCircle";
import MovieCard from "./MovieCard";

const FeaturedSection = ({ title, arrFilm }) => {
  const [isChevron, setIsChevron] = useState(false);
  const [currentChevron, setCurrentChevron] = useState(0);

  const handleChevron = (isRight) => {
    setIsChevron(isRight);
    if (isRight && Math.abs(currentChevron) < arrFilm.length - 4) {
      setCurrentChevron((prev) => prev - 1);
    } else if (!isRight && currentChevron < 0) {
      setCurrentChevron((prev) => prev + 1);
    }
  };

  return (
    <div className="relative px-6 md:px-16 lg:px-24 xl:pr-15 xl:pl-66 xl:py-10 overflow-hidden">
      <div className="absolute left-3 top-30 flex items-center justify-between">
        <BlurCircle top="-50px" right="-10px" />
        <p className="text-3xl font-bold whitespace-pre-line">{title}</p>
      </div>

      <div className="overflow-hidden pt-3">
        <motion.div
          className="flex max-sm:justify-center gap-4 will-change-transform"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.15 }}
          animate={{ x: currentChevron * 304 }}
          layout="position"
        >
          {arrFilm.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ y: -5 }}
              layoutId={movie.id}
            >
              <MovieCard key={movie.id} movie={movie} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <button
        onClick={() => handleChevron(false)}
        className="absolute flex items-center justify-center left-60 bottom-30 h-12 w-12 rounded-full bg-gray-400/30 cursor-pointer"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={() => handleChevron(true)}
        className="absolute flex items-center justify-center right-10 bottom-30 h-12 w-12 rounded-full bg-gray-400/30 cursor-pointer"
      >
        <ChevronRight size={28} />
      </button>
    </div>
  );
};

export default FeaturedSection;
