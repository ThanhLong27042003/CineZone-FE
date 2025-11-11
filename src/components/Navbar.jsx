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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { myInfo, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Movies", path: "/movies", icon: Film },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

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
                      alt={myInfo.hoTen}
                      className="w-9 h-9 rounded-full object-cover border-2 border-primary group-hover:border-primary-dull transition-colors"
                    />
                    <span className="hidden md:block font-medium text-white text-sm">
                      {myInfo.hoTen}
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
                        {/* User Info Header */}
                        <div className="px-4 py-3 bg-gradient-to-r from-primary/20 to-purple-500/20 border-b border-white/10">
                          <p className="text-sm font-semibold text-white">
                            {myInfo.hoTen}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {myInfo.email}
                          </p>
                        </div>

                        {/* Menu Items */}
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-zinc-950 border-l border-white/10 shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-purple-500/10">
            <img src={assets.logo} alt="CineZone" className="w-28 h-auto" />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <XIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Navigation Links */}
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

          {/* Mobile Search */}
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

          {/* User Info (Mobile) */}
          {myInfo && (
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-gradient-to-t from-zinc-950 to-zinc-900">
              <div className="flex items-center gap-3 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <img
                  src={myInfo.avatar}
                  alt={myInfo.hoTen}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {myInfo.hoTen}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {myInfo.email}
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
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for movies, actors, directors..."
                autoFocus
                className="w-full px-6 py-5 pl-16 pr-14 bg-zinc-900/90 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close search"
              >
                <XIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              Press{" "}
              <kbd className="px-2 py-1 bg-zinc-800 rounded text-gray-300">
                Esc
              </kbd>{" "}
              to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
