import React, { useEffect, useState } from "react";
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Title from "./Title";
import {
  getAllCastsForAdmin,
  createCast,
  updateCast,
  deleteCast,
} from "../../service/admin/CastService";

const CastManagement = () => {
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCast, setEditingCast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    profilePath: "",
  });

  // Pagination and Search states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const pageSize = 12;

  useEffect(() => {
    fetchCasts();
  }, [currentPage, search]);

  const fetchCasts = async () => {
    try {
      setLoading(true);
      const data = await getAllCastsForAdmin(currentPage, pageSize, search);
      if (data) {
        setCasts(data.content || []);
        setTotalPages(data.totalPages || 0);
      } else {
        setCasts([]);
        setTotalPages(0);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch casts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Cast name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingCast) {
        await updateCast(editingCast.id, formData);
        toast.success("Cast updated successfully!");
      } else {
        await createCast(formData);
        toast.success("Cast created successfully!");
      }
      setShowModal(false);
      setFormData({ name: "", profilePath: "" });
      setEditingCast(null);
      fetchCasts();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save cast");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cast member?")) {
      return;
    }

    try {
      await deleteCast(id);
      toast.success("Cast deleted successfully!");
      fetchCasts();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete cast. It may be associated with movies.",
      );
    }
  };

  const openEditModal = (cast) => {
    setEditingCast(cast);
    setFormData({
      name: cast.name,
      profilePath: cast.profilePath || "",
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingCast(null);
    setFormData({ name: "", profilePath: "" });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Title text1="Cast" text2="Management" icon={FaUserTie} />
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search casts..."
              value={search}
              onChange={handleSearchChange}
              className="w-full sm:w-64 px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 outline-none transition-all text-gray-900"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium 
                     shadow-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <FaPlus /> Add Cast
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <>
          {casts.length > 0 ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {casts.map((cast) => (
                  <div
                    key={cast.id}
                    className="bg-white rounded-lg p-4 shadow-md border border-gray-200 flex flex-col items-center text-center"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                      {cast.profilePath ? (
                        <img
                          src={cast.profilePath}
                          alt={cast.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.jpg";
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML =
                              '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" class="text-gray-400 text-3xl"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>';
                          }}
                        />
                      ) : (
                        <FaUserTie className="text-gray-400 text-3xl" />
                      )}
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1">{cast.name}</h3>
                    <p className="text-xs text-gray-500 mb-4">ID: {cast.id}</p>

                    <div className="flex gap-2 w-full mt-auto">
                      <button
                        onClick={() => openEditModal(cast)}
                        className="flex-1 py-2 rounded-lg bg-blue-100 text-blue-600 
                                 hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cast.id)}
                        className="flex-1 py-2 rounded-lg bg-red-100 text-red-600 
                                 hover:bg-red-200 transition-colors flex items-center justify-center gap-1"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

               {/* Pagination Controls */}
              <div className="px-6 py-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
                             hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white 
                             hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
              <FaUserTie className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No cast members found matching your search</p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingCast ? "Edit Cast" : "Add Cast"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-black
                           focus:border-gray-500 outline-none transition-colors"
                  placeholder="Cast Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image URL
                </label>
                <input
                  type="text"
                  value={formData.profilePath}
                  onChange={(e) =>
                    setFormData({ ...formData, profilePath: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-black
                           focus:border-gray-500 outline-none transition-colors"
                  placeholder="https://image.tmdb.org/..."
                />
              </div>

              {formData.profilePath && (
                <div className="flex justify-center py-2">
                  <img
                    src={formData.profilePath}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border-2 border-gray-300
                           hover:bg-gray-50 font-medium text-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 rounded-lg bg-gray-900 text-white 
                           font-medium hover:bg-gray-800 disabled:opacity-50 
                           disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Saving..." : editingCast ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CastManagement;
