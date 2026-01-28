import React, { useEffect, useState } from "react";
import { FaTags, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Title from "./Title";
import {
  getAllGenresForAdmin,
  createGenre,
  updateGenre,
  deleteGenre,
} from "../../service/admin/GenreService";

const GenreManagement = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const data = await getAllGenresForAdmin();
      setGenres(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch genres");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Genre name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingGenre) {
        await updateGenre(editingGenre.id, formData);
        toast.success("Genre updated successfully!");
      } else {
        await createGenre(formData);
        toast.success("Genre created successfully!");
      }
      setShowModal(false);
      setFormData({ name: "" });
      setEditingGenre(null);
      fetchGenres();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save genre");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this genre?")) {
      return;
    }

    try {
      await deleteGenre(id);
      toast.success("Genre deleted successfully!");
      fetchGenres();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete genre. It may be used in movies."
      );
    }
  };

  const openEditModal = (genre) => {
    setEditingGenre(genre);
    setFormData({
      name: genre.name,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingGenre(null);
    setFormData({ name: "" });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title text1="Genre" text2="Management" icon={FaTags} />
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium 
                   shadow-md flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <FaPlus /> Add Genre
        </button>
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
          {genres.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="px-6 py-4 text-left font-semibold">ID</th>
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genres.map((genre) => (
                      <tr
                        key={genre.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-500">#{genre.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {genre.name}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditModal(genre)}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 
                                       hover:bg-blue-200 transition-colors"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(genre.id)}
                              className="p-2 rounded-lg bg-red-100 text-red-600 
                                       hover:bg-red-200 transition-colors"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
              <FaTags className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No genres found</p>
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
                {editingGenre ? "Edit Genre" : "Add Genre"}
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
                  Genre Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300
                           focus:border-gray-500 outline-none transition-colors"
                  placeholder="e.g., Action, Comedy"
                />
              </div>

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
                  {submitting ? "Saving..." : editingGenre ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreManagement;
