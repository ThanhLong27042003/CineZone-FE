import React, { useState } from "react";
import { FilterIcon, XIcon } from "lucide-react";

const FilterSection = ({ onFilterChange, isOpen, onToggle }) => {
  const [filters, setFilters] = useState({
    country: "All",
    genre: "All",
    sortBy: "Latest",
  });

  const filterOptions = {
    country: ["All", "US", "Korea", "China", "Japan", "Vietnam"],
    genre: [
      "All",
      "Action",
      "Adventure",
      "Animation",
      "Comedy",
      "Crime",
      "Documentary",
      "Drama",
      "Family",
      "Fantasy",
      "History",
      "Horror",
      "Music",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Thriller",
      "War",
    ],
    sortBy: ["Latest", "IMDb Rating", "Vote Count"],
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      country: "All",
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
          {/* Quốc gia */}
          <div>
            <label className="block text-sm font-medium mb-2 text-">
              Quốc gia:
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.country.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange("country", option)}
                  className={`px-3 py-1 text-sm rounded border ${
                    filters.country === option
                      ? "bg-primary text-white border-primary-dull"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Thể loại */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">
              Thể loại:
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {filterOptions.genre.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange("genre", option)}
                  className={`px-3 py-1 text-sm rounded border ${
                    filters.genre === option
                      ? "bg-primary text-white border-primary-dull"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500"
                  }`}
                >
                  {option}
                </button>
              ))}
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
                  key={option}
                  onClick={() => handleFilterChange("sortBy", option)}
                  className={`px-3 py-1 text-sm rounded border ${
                    filters.sortBy === option
                      ? "bg-primary text-white border-primary-dull"
                      : "bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-500"
                  }`}
                >
                  {option}
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
            Đóng
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
