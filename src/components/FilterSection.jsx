import React, { useState, useEffect } from "react";
import { FilterIcon, XIcon } from "lucide-react";
import { getAllGenre } from "../service/GenreService";

const FilterSection = ({ onFilterChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    genre: "All",
    sortBy: "Latest",
  });

  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);

  // Fetch genres from database
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoadingGenres(true);
        const data = await getAllGenre();
        setGenres(data || []);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoadingGenres(false);
      }
    };

    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  const filterOptions = {
    sortBy: [
      { value: "Latest", label: "Mới nhất" },
      { value: "IMDb Rating", label: "Đánh giá cao" },
      { value: "Vote Count", label: "Lượt xem" },
    ],
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      genre: "All",
      sortBy: "Latest",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FilterIcon className="w-5 h-5" />
            Bộ lọc
          </h2>
          <button onClick={onToggle} className="text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Thể loại - Dynamic from DB */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Thể loại:
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {loadingGenres ? (
                <span className="text-gray-400 text-sm">Đang tải...</span>
              ) : (
                <>
                  <button
                    onClick={() => handleFilterChange("genre", "All")}
                    className={`px-3 py-1 text-sm rounded border ${
                      filters.genre === "All"
                        ? "bg-primary text-white border-primary-dull"
                        : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    Tất cả
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleFilterChange("genre", genre.name)}
                      className={`px-3 py-1 text-sm rounded border ${
                        filters.genre === genre.name
                          ? "bg-primary text-white border-primary-dull"
                          : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Sắp xếp */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Sắp xếp:
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.sortBy.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange("sortBy", option.value)}
                  className={`px-3 py-1 text-sm rounded border ${
                    filters.sortBy === option.value
                      ? "bg-primary text-white border-primary-dull"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition cursor-pointer"
          >
            Đặt lại
          </button>
          <button
            onClick={() => {
              onToggle();
              onFilterChange(filters);
            }}
            className="px-6 py-2 bg-primary text-white rounded hover:bg-primary transition flex items-center gap-2 cursor-pointer"
          >
            Lọc kết quả
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
