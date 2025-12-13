import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaDoorOpen, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Title from "./Title";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
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
      const response = await fetch("/api/admin/rooms");
      const data = await response.json();
      setRooms(data.result);
    } catch (error) {
      toast.error("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingRoom
        ? `/api/admin/rooms/${editingRoom.id}`
        : "/api/admin/rooms";

      const method = editingRoom ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingRoom ? "Room updated!" : "Room created!");
        setShowModal(false);
        setFormData({ name: "", capacity: "", description: "" });
        setEditingRoom(null);
        fetchRooms();
      } else {
        toast.error("Failed to save room");
      }
    } catch (error) {
      toast.error("Error saving room");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      const response = await fetch(`/api/admin/rooms/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Room deleted!");
        fetchRooms();
      } else {
        toast.error("Failed to delete room");
      }
    } catch (error) {
      toast.error("Error deleting room");
    }
  };

  const openEditModal = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      capacity: room.capacity,
      description: room.description,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title text1="Room" text2="Management" icon={FaDoorOpen} />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingRoom(null);
            setFormData({ name: "", capacity: "", description: "" });
            setShowModal(true);
          }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500
                   text-white font-medium shadow-lg flex items-center gap-2"
        >
          <FaPlus /> Add Room
        </motion.button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg
                     border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <FaDoorOpen className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Capacity: {room.capacity || "N/A"}
                </p>
              </div>
            </div>

            {room.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {room.description}
              </p>
            )}

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openEditModal(room)}
                className="flex-1 py-2 rounded-lg bg-blue-500 text-white
                         hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <FaEdit /> Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(room.id)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white
                         hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <FaTrash /> Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold mb-4">
              {editingRoom ? "Edit Room" : "Add Room"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
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
                           focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300
                           focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300
                           focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border-2 border-gray-300
                           hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500
                           text-white font-medium"
                >
                  {editingRoom ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
