import React, { useEffect, useState } from "react";
import { FaDoorOpen, FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Title from "./Title";
import { getAllRooms, createRoom, updateRoom, deleteRoom } from "../../service/admin/RoomService";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    setSubmitting(true);
    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
        toast.success("Room updated successfully!");
      } else {
        await createRoom(formData);
        toast.success("Room created successfully!");
      }
      setShowModal(false);
      setFormData({ name: "", capacity: "", description: "" });
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save room");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room? Rooms with shows cannot be deleted.")) {
      return;
    }

    try {
      await deleteRoom(id);
      toast.success("Room deleted successfully!");
      fetchRooms();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete room. It may have associated shows.");
    }
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity || "",
      description: room.description || "",
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({ name: "", capacity: "", description: "" });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title text1="Room" text2="Management" icon={FaDoorOpen} />
        <button
          onClick={openCreateModal}
          className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium 
                   shadow-md flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <FaPlus /> Add Room
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Rooms Grid */}
          {rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg p-6 shadow-md border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-gray-900">
                      <FaDoorOpen className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {room.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Capacity: {room.capacity || "N/A"}
                      </p>
                    </div>
                  </div>

                  {room.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {room.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(room)}
                      className="flex-1 py-2 rounded-lg bg-blue-600 text-white
                               hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="flex-1 py-2 rounded-lg bg-red-600 text-white
                               hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
              <FaDoorOpen className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No rooms found</p>
              <p className="text-gray-400 text-sm mt-2">Click "Add Room" to create your first room</p>
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
                {editingRoom ? "Edit Room" : "Add Room"}
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
                  Room Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300
                           focus:border-gray-500 outline-none transition-colors text-gray-900"
                  placeholder="e.g., Room A, Cinema Hall 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  min="1"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300
                           focus:border-gray-500 outline-none transition-colors text-gray-900"
                  placeholder="Number of seats"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300
                           focus:border-gray-500 outline-none resize-none transition-colors text-gray-900"
                  placeholder="Optional description"
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
                  {submitting ? "Saving..." : editingRoom ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
