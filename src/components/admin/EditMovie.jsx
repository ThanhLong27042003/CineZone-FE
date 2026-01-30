import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import { getMovieByIdApi } from "../../redux/reducer/FilmReducer";
import { updateMovie } from "../../service/admin/MovieService";
import { getAllGenresForAdmin } from "../../service/admin/GenreService";
import { getAllCastsForAdmin } from "../../service/admin/CastService";
import { FaFilm, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const EditMovie = () => {
  const { movieId } = useParams();
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
    status: "",
  });
  const [genres, setGenres] = useState([]);
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  
  const [genreSearch, setGenreSearch] = useState("");
  const [castSearch, setCastSearch] = useState("");

  const { film } = useSelector((state) => state.FilmReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (movieId) {
      dispatch(getMovieByIdApi(movieId));
    }
  }, [movieId]);

  useEffect(() => {
    if (film) {
      setFormData({
        title: film.title || "",
        overview: film.overview || "",
        releaseDate: film.releaseDate || "",
        runtime: film.runtime || "",
        posterPath: film.posterPath || "",
        backdropPath: film.backdropPath || "",
        voteAverage: film.voteAverage || "",
        voteCount: film.voteCount || "",
        trailer: film.trailer || "",
        genreIds: film.genres?.map((g) => g.id) || [],
        castIds: film.casts?.map((c) => c.id) || [],
        status: film.status || "COMING_SOON",
      });
      setFetchLoading(false);
    }
  }, [film]);

  useEffect(() => {
    const fetchOthers = async () => {
      try {
        const [genresResponse, castsResponse] = await Promise.all([
          getAllGenresForAdmin(0, 1000, ""),
          getAllCastsForAdmin(0, 1000, ""),
        ]);

        setGenres(genresResponse.content || []);
        setCasts(castsResponse.content || []);
      } catch (err) {
        toast.error("Failed to fetch genres/casts");
      }
    };

    fetchOthers();
  }, []);

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
      await updateMovie(movieId, formData);
      toast.success("Movie updated successfully");
      navigate("/admin/list-movies");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update movie");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Title text1="Edit" text2="Movie" icon={FaFilm} />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-8 border border-gray-200"
      >
        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-900 rounded"></div>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="Enter movie title"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overview *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900 resize-none"
                placeholder="Enter movie overview/description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Runtime (minutes) *
              </label>
              <input
                type="number"
                name="runtime"
                value={formData.runtime}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date *
              </label>
              <input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
              >
                <option value="COMING_SOON">Coming Soon</option>
                <option value="NOW_SHOWING">Now Showing</option>
                <option value="STOPPED">Stopped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media & URLs */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-900 rounded"></div>
            Media & URLs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster Path
              </label>
              <input
                type="text"
                name="posterPath"
                value={formData.posterPath}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="/path/to/poster.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backdrop Path
              </label>
              <input
                type="text"
                name="backdropPath"
                value={formData.backdropPath}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="/path/to/backdrop.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trailer URL
              </label>
              <input
                type="url"
                name="trailer"
                value={formData.trailer}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-gray-900 rounded"></div>
            Ratings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="7.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vote Count
              </label>
              <input
                type="number"
                name="voteCount"
                value={formData.voteCount}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-200 
                         focus:border-gray-500 transition-all outline-none text-gray-900"
                placeholder="1234"
              />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-900 rounded"></div>
              Genres
            </h3>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Genres..."
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gray-500 outline-none text-gray-900"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {genres
              .filter((g) => g.name.toLowerCase().includes(genreSearch.toLowerCase()))
              .map((genre) => (
              <label
                key={genre.id}
                className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                  ${
                    formData.genreIds.includes(genre.id)
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <input
                  type="checkbox"
                  checked={formData.genreIds.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  className="hidden"
                />
                <span className="text-sm font-medium">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cast */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-1 h-6 bg-gray-900 rounded"></div>
              Cast Members
            </h3>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Cast..."
                value={castSearch}
                onChange={(e) => setCastSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:border-gray-500 outline-none text-gray-900"
              />
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto border-2 border-gray-200 rounded-lg p-4 custom-scrollbar">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {casts
                .filter((c) => c.name.toLowerCase().includes(castSearch.toLowerCase()))
                .map((cast) => (
                <label
                  key={cast.id}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all
                    ${
                      formData.castIds.includes(cast.id)
                        ? "bg-gray-100 border-2 border-gray-500"
                        : "bg-white border-2 border-transparent hover:border-gray-300"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.castIds.includes(cast.id)}
                    onChange={() => handleCastChange(cast.id)}
                    className="w-4 h-4 text-gray-900 rounded focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">
                    {cast.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/admin/list-movies")}
            className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 
                     font-medium hover:bg-gray-50 flex items-center gap-2 transition-all"
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium 
                     shadow-md hover:bg-gray-800 disabled:opacity-50 
                     disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <FaSave />
            {loading ? "Updating..." : "Update Movie"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMovie;
