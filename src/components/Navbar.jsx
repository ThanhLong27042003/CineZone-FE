import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import {
  MenuIcon,
  SearchIcon,
  XIcon,
  User,
  LogOut,
  Film,
  Home,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { searchApi } from "../redux/reducer/GeneralReducer";
import { logOut } from "../service/LoginService";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { myInfo } = useAuth();

  const { dataSearch, loading } = useSelector((state) => state.GeneralReducer);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Close search on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        dispatch(searchApi(searchQuery.trim()));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Movies", path: "/movies", icon: Film },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    const res = await logOut({
      userName: myInfo.userName,
      passWord: myInfo.passWord,
    });
    sessionStorage.removeItem("ACCESS_TOKEN");
    sessionStorage.removeItem("myInfo");
    setDropdownOpen(false);
    toast.success(res);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSearchItemClick = (item) => {
    // Check if it's a movie or cast
    if (item.id) {
      navigate(`/movies/${item.id}`);
    }
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  // Check if result is string message
  const isNoResult = typeof dataSearch === "string";
  const isMovieList =
    Array.isArray(dataSearch) && dataSearch.length > 0 && dataSearch[0].title;
  const isCastList =
    Array.isArray(dataSearch) && dataSearch.length > 0 && dataSearch[0].name;

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-gradient-to-b from-black/80 to-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 z-50 group transition-transform hover:scale-105"
            >
              <img
                src={assets.logo}
                alt="CineZone"
                className="w-36 h-auto brightness-110"
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-primary text-white shadow-lg shadow-primary/50 scale-105"
                      : "text-gray-300 hover:text-white hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  {link.icon && <link.icon className="w-5 h-5" />}
                  <span className="text-[15px]">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 group hover:scale-110"
                aria-label="Search"
              >
                <SearchIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </button>

              {/* User Section */}
              {myInfo ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 group hover:scale-105"
                  >
                    <img
                      src={myInfo.avatar}
                      alt={myInfo.userName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary group-hover:border-primary-dull transition-colors"
                    />
                    <span className="hidden md:block font-medium text-white text-sm">
                      {myInfo.userName}
                    </span>
                    <ChevronDown
                      className={`hidden md:block w-4 h-4 text-gray-300 transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-3 w-56 bg-zinc-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 bg-gradient-to-r from-primary/20 to-purple-500/20 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">
                            {myInfo.userName}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {myInfo.emailAddress}
                          </p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="px-7 py-2.5 bg-gradient-to-r from-primary to-primary-dull hover:from-primary-dull hover:to-primary transition-all duration-300 rounded-full font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 hover:scale-110"
                aria-label="Menu"
              >
                <MenuIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Same as before */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-zinc-950 border-l border-white/10 shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-purple-500/10">
            <img src={assets.logo} alt="CineZone" className="w-28 h-auto" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-primary to-primary-dull text-white shadow-lg shadow-primary/30"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.icon && <link.icon className="w-6 h-6" />}
                <span className="text-base">{link.name}</span>
              </Link>
            ))}
          </div>
          <div className="px-6 pb-6">
            <button
              onClick={() => {
                setIsSearchOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all duration-300 border border-white/10"
            >
              <SearchIcon className="w-6 h-6" />
              <span className="font-medium text-base">Search Movies</span>
            </button>
          </div>
          {myInfo && (
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gradient-to-t from-zinc-950 to-zinc-900">
              <div className="flex items-center gap-3 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <img
                  src={myInfo.avatar}
                  alt={myInfo.userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {myInfo.userName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {myInfo.emailAddress}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col pt-16 px-4">
          <div
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={handleCloseSearch}
          />

          <div className="relative w-full max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="relative mb-4">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm phim, diễn viên, đạo diễn..."
                autoFocus
                className="w-full px-6 py-4 pl-16 pr-14 bg-zinc-900/90 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <button
                onClick={handleCloseSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <XIcon className="w-6 h-6 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Search Results */}
            {searchQuery.trim().length >= 2 && (
              <div className="bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[calc(100vh-200px)] overflow-y-auto shadow-2xl">
                {loading ? (
                  // Loading State
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="ml-3 text-gray-400">Đang tìm kiếm...</span>
                  </div>
                ) : isNoResult ? (
                  // No Results
                  <div className="py-12 text-center">
                    <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">{dataSearch}</p>
                  </div>
                ) : isMovieList ? (
                  // Movie Results
                  <div>
                    <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-primary/10 to-transparent">
                      <h3 className="text-white font-semibold text-lg">
                        Danh sách phim
                      </h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {dataSearch.map((movie) => (
                        <div
                          key={movie.id}
                          onClick={() => handleSearchItemClick(movie)}
                          className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl cursor-pointer transition-all duration-300 group"
                        >
                          <img
                            src={movie.posterPath}
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded-lg border border-white/10 group-hover:border-primary transition-colors"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                              {movie.title}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1">
                              {movie.originalTitle}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-sm">
                              <span className="text-gray-500">
                                {movie.certification || "T18"}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">
                                {movie.releaseDate
                                  ? new Date(movie.releaseDate).getFullYear()
                                  : "N/A"}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-500">
                                {movie.runtime
                                  ? `${Math.floor(movie.runtime / 60)}h ${
                                      movie.runtime % 60
                                    }m`
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isCastList ? (
                  // Cast Results
                  <div>
                    <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent">
                      <h3 className="text-white font-semibold text-lg">
                        Danh sách diễn viên
                      </h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {dataSearch.map((cast) => (
                        <div
                          key={cast.id}
                          className="flex items-center gap-4 p-3 hover:bg-white/10 rounded-xl transition-all duration-300 group"
                        >
                          <img
                            src={
                              cast.profilePath || "https://placehold.co/80x80"
                            }
                            alt={cast.name}
                            className="w-16 h-16 object-cover rounded-full border-2 border-white/10 group-hover:border-primary transition-colors"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold text-base group-hover:text-primary transition-colors">
                              {cast.name}
                            </h4>
                            <p className="text-gray-400 text-sm mt-1">
                              {cast.character || "Actor"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {/* Hint */}
            {searchQuery.trim().length === 0 && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Nhập ít nhất 2 ký tự để tìm kiếm
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
