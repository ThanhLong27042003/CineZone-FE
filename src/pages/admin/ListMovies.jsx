// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   setMovies,
//   setMoviesLoading,
//   setMoviesError,
// } from "../../redux/reducer/AdminReducer";
// import Title from "../../components/admin/Title";
// import { toast } from "react-hot-toast";
// import {
//   deleteMovie,
//   getAllMoviesForAdmin,
// } from "../../service/admin/MovieService";
// import { motion } from "framer-motion";
// import {
//   FaFilm,
//   FaStar,
//   FaClock,
//   FaCalendar,
//   FaSearch,
//   FaFilter,
//   FaEdit,
//   FaTrash,
//   FaPlus,
// } from "react-icons/fa";
// import Loading from "../../components/Loading";

// const ListMovies = () => {
//   const dispatch = useDispatch();
//   const {
//     data: movies,
//     loading,
//     currentPage,
//     totalPages,
//   } = useSelector((state) => state.admin.movies);
//   const [page, setPage] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     fetchMovies();
//   }, [page, searchTerm]);

//   const fetchMovies = async () => {
//     try {
//       dispatch(setMoviesLoading(true));
//       const response = await getAllMoviesForAdmin(page, 10, searchTerm);
//       dispatch(setMovies(response));
//     } catch (error) {
//       dispatch(setMoviesError(error.message));
//       toast.error("Failed to fetch movies");
//     }
//   };

//   const handleDelete = async (movieId) => {
//     if (window.confirm("Are you sure you want to delete this movie?")) {
//       try {
//         await deleteMovie(movieId);
//         toast.success("Movie deleted successfully");
//         fetchMovies();
//       } catch (error) {
//         toast.error("Failed to delete movie");
//       }
//     }
//   };

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });
//   };

//   return !loading ? (
//     <div className="space-y-6">
//       <Title text1="List" text2="Movies" icon={FaFilm} />

//       {/* Search and Add Button Bar */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="flex flex-col sm:flex-row gap-4 mb-6"
//       >
//         <div className="relative flex-1">
//           <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search movies..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800
//                      border-2 border-gray-200 dark:border-gray-700
//                      focus:border-purple-500 transition-all outline-none shadow-lg
//                      text-gray-900 dark:text-white"
//           />
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => (window.location.href = "/admin/movies/create")}
//           className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
//                    text-white font-medium shadow-lg hover:shadow-xl transition-all
//                    flex items-center gap-2 justify-center whitespace-nowrap"
//         >
//           <FaPlus /> Add New Movie
//         </motion.button>
//       </motion.div>

//       {/* Stats Cards */}
//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
//       >
//         {[
//           {
//             label: "Total Movies",
//             value: movies.length,
//             icon: FaFilm,
//             color: "from-blue-500 to-cyan-500",
//           },
//           {
//             label: "Total Runtime",
//             value: `${movies.reduce(
//               (acc, m) => acc + (m.runtime || 0),
//               0
//             )} min`,
//             icon: FaClock,
//             color: "from-purple-500 to-pink-500",
//           },
//           {
//             label: "Avg Rating",
//             value:
//               movies.length > 0
//                 ? (
//                     movies.reduce((acc, m) => acc + (m.voteAverage || 0), 0) /
//                     movies.length
//                   ).toFixed(1)
//                 : "0.0",
//             icon: FaStar,
//             color: "from-green-500 to-emerald-500",
//           },
//           {
//             label: "Total Votes",
//             value: movies.reduce((acc, m) => acc + (m.voteCount || 0), 0),
//             icon: FaCalendar,
//             color: "from-orange-500 to-red-500",
//           },
//         ].map((stat, idx) => (
//           <motion.div
//             key={idx}
//             variants={item}
//             whileHover={{ scale: 1.05, y: -5 }}
//             className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
//           >
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">
//                   {stat.label}
//                 </p>
//                 <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                   {stat.value}
//                 </p>
//               </div>
//               <div
//                 className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
//               >
//                 <stat.icon
//                   className={`text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
//                 />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </motion.div>

//       {/* Movies Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.3 }}
//         className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
//       >
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                 <th className="px-6 py-4 text-left font-semibold">
//                   Movie Details
//                 </th>
//                 <th className="px-6 py-4 text-left font-semibold">
//                   Release Date
//                 </th>
//                 <th className="px-6 py-4 text-left font-semibold">Duration</th>
//                 <th className="px-6 py-4 text-left font-semibold">Rating</th>
//                 <th className="px-6 py-4 text-left font-semibold">Genres</th>
//                 <th className="px-6 py-4 text-left font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {movies.map((movie, index) => (
//                 <motion.tr
//                   key={movie.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   className="border-b border-gray-200 dark:border-gray-700
//                            hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
//                 >
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-4">
//                       <img
//                         src={movie.posterPath || "/placeholder.jpg"}
//                         alt={movie.title}
//                         className="w-16 h-24 object-cover rounded-lg shadow-md"
//                         onError={(e) => {
//                           e.target.src = "/placeholder.jpg";
//                         }}
//                       />
//                       <div className="flex-1">
//                         <h3 className="font-bold text-gray-900 dark:text-white mb-1">
//                           {movie.title}
//                         </h3>
//                         <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
//                           {movie.overview || "No description available"}
//                         </p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
//                       <FaCalendar className="text-purple-500" />
//                       <span>{formatDate(movie.releaseDate)}</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
//                       <FaClock className="text-purple-500" />
//                       <span>
//                         {movie.runtime ? `${movie.runtime} min` : "N/A"}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <FaStar className="text-yellow-500" />
//                       <span className="font-bold text-gray-900 dark:text-white">
//                         {movie.voteAverage
//                           ? movie.voteAverage.toFixed(1)
//                           : "N/A"}
//                       </span>
//                       <span className="text-sm text-gray-500 dark:text-gray-400">
//                         ({movie.voteCount || 0})
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex flex-wrap gap-1">
//                       {movie.genres && movie.genres.length > 0 ? (
//                         movie.genres.slice(0, 2).map((genre) => (
//                           <span
//                             key={genre.id}
//                             className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30
//                                      text-purple-700 dark:text-purple-300 font-medium text-xs"
//                           >
//                             {genre.name}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-sm text-gray-500 dark:text-gray-400">
//                           No genres
//                         </span>
//                       )}
//                       {movie.genres && movie.genres.length > 2 && (
//                         <span
//                           className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700
//                                        text-gray-600 dark:text-gray-300 text-xs"
//                         >
//                           +{movie.genres.length - 2}
//                         </span>
//                       )}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex gap-2">
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() =>
//                           (window.location.href = `/admin/movies/edit/${movie.id}`)
//                         }
//                         className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600
//                                  flex items-center justify-center"
//                         title="Edit"
//                       >
//                         <FaEdit />
//                       </motion.button>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleDelete(movie.id)}
//                         className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600
//                                  flex items-center justify-center"
//                         title="Delete"
//                       >
//                         <FaTrash />
//                       </motion.button>
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </motion.div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="flex justify-center items-center gap-3 mt-6"
//         >
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setPage((p) => Math.max(0, p - 1))}
//             disabled={page === 0}
//             className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800
//                      border-2 border-gray-200 dark:border-gray-700
//                      text-gray-700 dark:text-white font-medium
//                      disabled:opacity-50 disabled:cursor-not-allowed
//                      hover:border-purple-500 transition-all shadow-lg"
//           >
//             Previous
//           </motion.button>

//           <div
//             className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
//                         text-white font-bold shadow-lg"
//           >
//             Page {page + 1} of {totalPages}
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
//             disabled={page >= totalPages - 1}
//             className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800
//                      border-2 border-gray-200 dark:border-gray-700
//                      text-gray-700 dark:text-white font-medium
//                      disabled:opacity-50 disabled:cursor-not-allowed
//                      hover:border-purple-500 transition-all shadow-lg"
//           >
//             Next
//           </motion.button>
//         </motion.div>
//       )}
//     </div>
//   ) : (
//     <Loading />
//   );
// };

// export default ListMovies;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMovies,
  setMoviesLoading,
  setMoviesError,
} from "../../redux/reducer/AdminReducer";
import Title from "../../components/admin/Title";
import { toast } from "react-hot-toast";
import {
  deleteMovie,
  getAllMoviesForAdmin,
} from "../../service/admin/MovieService";
import { motion } from "framer-motion";
import {
  FaFilm,
  FaStar,
  FaClock,
  FaCalendar,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

const ListMovies = () => {
  const dispatch = useDispatch();
  const {
    data: movies,
    loading,
    currentPage,
    totalPages,
  } = useSelector((state) => state.admin.movies);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term - chỉ update sau 1 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1 giây debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch movies khi debounced search term hoặc page thay đổi
  useEffect(() => {
    fetchMovies();
  }, [page, debouncedSearchTerm]);

  const fetchMovies = async () => {
    try {
      dispatch(setMoviesLoading(true));
      const response = await getAllMoviesForAdmin(
        page,
        10,
        debouncedSearchTerm || null
      );
      dispatch(setMovies(response));
    } catch (error) {
      dispatch(setMoviesError(error.message));
      toast.error("Failed to fetch movies");
    }
  };

  const handleDelete = async (movieId) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await deleteMovie(movieId);
        toast.success("Movie deleted successfully");
        fetchMovies();
      } catch (error) {
        toast.error("Failed to delete movie");
      }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Title text1="List" text2="Movies" icon={FaFilm} />

      {/* Search and Add Button Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800
                     border-2 border-gray-200 dark:border-gray-700
                     focus:border-purple-500 transition-all outline-none shadow-lg
                     text-gray-900 dark:text-white"
          />
          {searchTerm !== debouncedSearchTerm && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => (window.location.href = "/admin/create-movie")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                   text-white font-medium shadow-lg hover:shadow-xl transition-all
                   flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <FaPlus /> Add New Movie
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        {[
          {
            label: "Total Movies",
            value: movies?.length || 0,
            icon: FaFilm,
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Total Runtime",
            value: `${
              movies?.reduce((acc, m) => acc + (m.runtime || 0), 0) || 0
            } min`,
            icon: FaClock,
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "Avg Rating",
            value:
              movies && movies.length > 0
                ? (
                    movies.reduce((acc, m) => acc + (m.voteAverage || 0), 0) /
                    movies.length
                  ).toFixed(1)
                : "0.0",
            icon: FaStar,
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Total Votes",
            value: movies?.reduce((acc, m) => acc + (m.voteCount || 0), 0) || 0,
            icon: FaCalendar,
            color: "from-orange-500 to-red-500",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold mt-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}
              >
                <stat.icon
                  className={`text-2xl bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Movies Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-900 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <th className="px-6 py-4 text-left font-semibold">
                    Movie Details
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Release Date
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Rating</th>
                  <th className="px-6 py-4 text-left font-semibold">Genres</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, index) => (
                  <motion.tr
                    key={movie.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700
                             hover:bg-purple-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={movie.posterPath || "/placeholder.jpg"}
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                            {movie.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {movie.overview || "No description available"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaCalendar className="text-purple-500" />
                        <span>{formatDate(movie.releaseDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaClock className="text-purple-500" />
                        <span>
                          {movie.runtime ? `${movie.runtime} min` : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {movie.voteAverage
                            ? movie.voteAverage.toFixed(1)
                            : "N/A"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({movie.voteCount || 0})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres && movie.genres.length > 0 ? (
                          movie.genres.slice(0, 2).map((genre) => (
                            <span
                              key={genre.id}
                              className="px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30
                                       text-purple-700 dark:text-purple-300 font-medium text-xs"
                            >
                              {genre.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            No genres
                          </span>
                        )}
                        {movie.genres && movie.genres.length > 2 && (
                          <span
                            className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700
                                         text-gray-600 dark:text-gray-300 text-xs"
                          >
                            +{movie.genres.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            (window.location.href = `/admin/edit-movie/${movie.id}`)
                          }
                          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600
                                   flex items-center justify-center"
                          title="Edit"
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600
                                   flex items-center justify-center"
                          title="Delete"
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FaFilm className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No movies found
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center gap-3 mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Previous
          </motion.button>

          <div
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                        text-white font-bold shadow-lg"
          >
            Page {page + 1} of {totalPages}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-6 py-3 rounded-xl bg-white dark:bg-gray-800 
                     border-2 border-gray-200 dark:border-gray-700
                     text-gray-700 dark:text-white font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:border-purple-500 transition-all shadow-lg"
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ListMovies;
