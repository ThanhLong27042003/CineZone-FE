import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { createMovie } from "../../service/admin/MovieService";
import { getAllGenre } from "../../service/GenreService";
import { getAllCast } from "../../service/CastService";
import { motion } from "framer-motion";
import { FaFilm, FaSave, FaTimes } from "react-icons/fa";

const CreateMovie = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    releaseDate: "",
    runtime: "",
    posterPath: "",
    backdropPath: "",
    voteAverage: "",
    voteCount: "",
    trailer: "",
    genreIds: [],
    castIds: [],
  });
  const [genres, setGenres] = useState([]);
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [genresResponse, castsResponse] = await Promise.all([
        getAllGenre(),
        getAllCast(),
      ]);
      setGenres(genresResponse);
      setCasts(castsResponse);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreChange = (genreId) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  const handleCastChange = (castId) => {
    setFormData((prev) => ({
      ...prev,
      castIds: prev.castIds.includes(castId)
        ? prev.castIds.filter((id) => id !== castId)
        : [...prev.castIds, castId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMovie(formData);
      toast.success("Movie created successfully");
      navigate("/admin/list-movies");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create movie");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title text1="Create" text2="Movie" icon={FaFilm} />

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700"
      >
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="Enter movie title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overview *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white resize-none"
                placeholder="Enter movie overview/description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Runtime (minutes) *
              </label>
              <input
                type="number"
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Release Date *
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Media & URLs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Media & URLs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Poster Path
              </label>
              <input
                type="text"
                name="posterPath"
                value={formData.posterPath}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="/path/to/poster.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Backdrop Path
              </label>
              <input
                type="text"
                name="backdropPath"
                value={formData.backdropPath}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="/path/to/backdrop.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trailer URL
              </label>
              <input
                type="url"
                name="trailer"
                value={formData.trailer}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vote Average
              </label>
              <input
                type="number"
                name="voteAverage"
                value={formData.voteAverage}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="10"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="7.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vote Count
              </label>
              <input
                type="number"
                name="voteCount"
                value={formData.voteCount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 
                         border-2 border-gray-200 dark:border-gray-600 
                         focus:border-purple-500 transition-all outline-none
                         text-gray-900 dark:text-white"
                placeholder="1234"
              />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Genres
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {genres.map((genre) => (
              <motion.label
                key={genre.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all
                  ${
                    formData.genreIds.includes(genre.id)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.genreIds.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  className="hidden"
                />
                <span className="text-sm font-medium">{genre.name}</span>
              </motion.label>
            ))}
          </div>
        </div>

        {/* Cast */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded"></div>
            Cast Members
          </h3>
          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {casts.map((cast) => (
                <motion.label
                  key={cast.id}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                    ${
                      formData.castIds.includes(cast.id)
                        ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500"
                        : "bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.castIds.includes(cast.id)}
                    onChange={() => handleCastChange(cast.id)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {cast.name}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/admin/list-movies")}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700
                     flex items-center gap-2 transition-all"
          >
            <FaTimes /> Cancel
          </motion.button>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white font-medium shadow-lg hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center gap-2 transition-all"
          >
            <FaSave />
            {loading ? "Creating..." : "Create Movie"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateMovie;
