// import React, { useEffect, useState } from "react";
// import { dummyShowsData } from "../../assets/assets";
// import Loading from "../../components/Loading";
// import Title from "../../components/admin/Title";
// import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
// import { kConverter } from "../../../utils/kConverter";

// const AddShows = () => {
//   const currency = import.meta.env.VITE_CURRENCY;
//   const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [dateTimeSelection, setDateTimeSelection] = useState({});
//   const [dateTimeInput, setDateTimeInput] = useState("");
//   const [showPrice, setShowPrice] = useState("");

//   const fetchNowPlayingMovies = async () => {
//     setNowPlayingMovies(dummyShowsData);
//   };

//   const handleDateTimeAdd = () => {
//     if (!dateTimeInput) return;
//     const [date, time] = dateTimeInput.split("T");
//     if (!date || !time) return;

//     setDateTimeSelection((prev) => {
//       const times = prev[date] || [];
//       if (!times.includes(time)) {
//         return { ...prev, [date]: [...times, time] };
//       }
//       return prev;
//     });
//   };

//   const handleRemoveTime = (date, time) => {
//     setDateTimeSelection((prev) => {
//       const filteredTimes = prev[date].filter((t) => t !== time);
//       if (filteredTimes.length === 0) {
//         const { [date]: _, ...rest } = prev;
//         return rest;
//       }
//       return {
//         ...prev,
//         [date]: filteredTimes,
//       };
//     });
//   };
//   useEffect(() => {
//     fetchNowPlayingMovies();
//   }, []);
//   return nowPlayingMovies.length > 0 ? (
//     <>
//       <Title text1="Add" text2="Shows" />
//       <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
//       <div className="overflow-x-auto pb-4">
//         <div className="group flex flex-wrap gap-4 mt-4 w-max">
//           {nowPlayingMovies.map((movie) => (
//             <div
//               key={movie.id}
//               className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
//               onClick={() => setSelectedMovie(movie.id)}
//             >
//               <div className="relative rounded-lg overflow-hidden">
//                 <img
//                   src={movie.poster_path}
//                   alt=""
//                   className="w-full object-cover brightness-90"
//                 />
//                 <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
//                   <p className="flex items-center gap-1 text-gray-400">
//                     <StarIcon className="w-4 h-4 text-primary fill-primary" />
//                     {movie.vote_average.toFixed(1)}
//                   </p>
//                   <p className="text-gray-300">
//                     {kConverter(movie.vote_count)} Votes
//                   </p>
//                 </div>
//               </div>
//               {selectedMovie === movie.id && (
//                 <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
//                   <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
//                 </div>
//               )}
//               <p className="font-medium truncate">{movie.title}</p>
//               <p className="tex-gray-400 text-sm">{movie.release_date}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="mt-8">
//         <label className="block text-sm font-medium mb-2">Show Price</label>
//         <div className="inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md">
//           <p className="text-gray-400 text-sm">{currency}</p>
//           <input
//             min={0}
//             type="number"
//             value={showPrice}
//             onChange={(e) => setShowPrice(e.target.value)}
//             placeholder="Enter show price"
//             className="outline-none"
//           />
//         </div>
//       </div>

//       <div className="mt-6">
//         <label className="block text-sm font-medium mb-2">
//           Select Date and Time
//         </label>
//         <div className="inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg">
//           <p className="text-gray-400 text-sm">{currency}</p>
//           <input
//             type="datetime-local"
//             value={dateTimeInput}
//             onChange={(e) => setDateTimeInput(e.target.value)}
//             className="outline-none rounded-md"
//           />
//           <button
//             onClick={handleDateTimeAdd}
//             className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer"
//           >
//             Add Time
//           </button>
//         </div>
//       </div>

//       {Object.keys(dateTimeSelection).length > 0 && (
//         <div className="mt-6">
//           <h2 className="mb-2">Selected Date-time</h2>
//           <ul className="space-y-3">
//             {Object.entries(dateTimeSelection).map(([date, times]) => (
//               <li key={date}>
//                 <div className="font-medium">{date}</div>
//                 <div className="flex flex-wrap gap-2 mt-1 text-sm">
//                   {times.map((time) => (
//                     <div
//                       key={time}
//                       className="border border-primary px-2 py-1 flex items-center rounded"
//                     >
//                       <span>{time}</span>
//                       <DeleteIcon
//                         onClick={() => handleRemoveTime(date, time)}
//                         width={15}
//                         className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
//                       />
//                     </div>
//                   ))}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">
//         Add Show
//       </button>
//     </>
//   ) : (
//     <Loading />
//   );
// };

// export default AddShows;

import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilm,
  FaCheck,
  FaTimes,
  FaStar,
  FaCalendarAlt,
  FaDollarSign,
  FaPlus,
} from "react-icons/fa";
import { kConverter } from "../../../utils/kConverter";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
    setDateTimeInput("");
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  return nowPlayingMovies.length > 0 ? (
    <div className="space-y-8">
      <Title text1="Add" text2="Shows" icon={FaFilm} />

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4 mb-8"
      >
        {[
          { step: 1, label: "Select Movie", active: true },
          { step: 2, label: "Set Price", active: !!selectedMovie },
          { step: 3, label: "Schedule", active: !!showPrice },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                item.active
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {item.step}
            </motion.div>
            <span
              className={`font-medium ${
                item.active
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
            {idx < 2 && (
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-700" />
            )}
          </div>
        ))}
      </motion.div>

      {/* Movies Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Now Playing Movies
          </h2>
          <span className="px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">
            {nowPlayingMovies.length} Movies
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {nowPlayingMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -10 }}
              onClick={() => setSelectedMovie(movie.id)}
              className={`relative cursor-pointer group ${
                selectedMovie === movie.id
                  ? "ring-4 ring-purple-500 rounded-xl"
                  : ""
              }`}
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={movie.poster_path}
                  alt={movie.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm flex items-center gap-1">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-white text-sm font-bold">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>

                {/* Votes */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 backdrop-blur-sm">
                  <p className="text-white text-xs text-center">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>

                {/* Selected Check */}
                <AnimatePresence>
                  {selectedMovie === movie.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 left-2 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                               flex items-center justify-center shadow-lg"
                    >
                      <FaCheck className="text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-2">
                <p className="font-bold text-gray-800 dark:text-white truncate">
                  {movie.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {movie.release_date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Price Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800 dark:text-white">
          <FaDollarSign className="text-green-500" />
          Show Price
        </label>
        <div className="relative max-w-md">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            {currency}
          </span>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter show price"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-700 focus:border-purple-500 outline-none
                     text-lg font-medium transition-all"
          />
        </div>
      </motion.div>

      {/* DateTime Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <label className="flex items-center gap-2 text-lg font-bold mb-4 text-gray-800 dark:text-white">
          <FaCalendarAlt className="text-blue-500" />
          Select Date and Time
        </label>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="flex-1 px-4 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-700 focus:border-purple-500 outline-none
                     transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDateTimeAdd}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white font-bold shadow-lg hover:shadow-xl transition-all
                     flex items-center gap-2 justify-center"
          >
            <FaPlus /> Add Time
          </motion.button>
        </div>

        {/* Selected Times */}
        <AnimatePresence>
          {Object.keys(dateTimeSelection).length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <h3 className="font-bold text-gray-800 dark:text-white">
                Selected Show Times
              </h3>
              {Object.entries(dateTimeSelection).map(([date, times]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700"
                >
                  <div className="font-bold text-purple-700 dark:text-purple-300 mb-3">
                    📅 {date}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {times.map((time) => (
                      <motion.div
                        key={time}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg 
                                 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600 
                                 shadow-md group"
                      >
                        <span className="font-medium">⏰ {time}</span>
                        <motion.button
                          whileHover={{ rotate: 90 }}
                          onClick={() => handleRemoveTime(date, time)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTimes />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto px-12 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 
                 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all
                 flex items-center gap-3 justify-center mx-auto"
      >
        <FaCheck /> Add Show
      </motion.button>
    </div>
  ) : (
    <Loading />
  );
};

export default AddShows;
