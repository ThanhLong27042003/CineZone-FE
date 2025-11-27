import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { getFavoriteMovieApi } from "../redux/reducer/FilmReducer";
import { motion } from "framer-motion";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/ProfileTabs";
import ProfileInfo from "../components/ProfileInfo";
import BookingHistory from "../components/BookingHistory";
import Favorites from "../components/Favorites";
import Settings from "../components/Settings";
import ChangePasswordModal from "../components/ChangePasswordModal";

const Profile = () => {
  const { myInfo, setMyInfo } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const dispatch = useDispatch();
  const { favoriteFilms, loading } = useSelector((state) => state.FilmReducer);

  const [formData, setFormData] = useState({
    userName: myInfo?.userName || "",
    firstName: myInfo?.firstName || "",
    lastName: myInfo?.lastName || "",
    emailAddress: myInfo?.emailAddress || "",
    phoneNumber: myInfo?.phoneNumber || "",
    dob: myInfo?.dob || "",
    address: myInfo?.address || "",
    avatar: myInfo?.avatar || "",
  });

  useEffect(() => {
    if (myInfo?.id) {
      dispatch(getFavoriteMovieApi(myInfo.id));
    }
  }, [dispatch, myInfo?.id]);

  const bookingHistory = [
    {
      id: 1,
      movieTitle: "Venom: The Last Dance",
      poster: "https://placehold.co/100x150/1a1a1a/ffffff?text=V3",
      theater: "CineZone Theater - Screen 1",
      date: "Nov 10, 2024",
      time: "19:00",
      seats: "A5, A6",
      totalPrice: "$25.00",
      status: "Completed",
    },
    {
      id: 2,
      movieTitle: "Smile 2",
      poster: "https://placehold.co/100x150/1a1a1a/ffffff?text=S2",
      theater: "CineZone Theater - Screen 2",
      date: "Nov 08, 2024",
      time: "21:00",
      seats: "B10, B11",
      totalPrice: "$25.00",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 pt-24 pb-16">
      <div className="container mx-auto px-6 md:px-16 lg:px-24 xl:px-32">
        <ProfileHeader
          formData={formData}
          bookingHistory={bookingHistory}
          favoriteFilms={favoriteFilms}
        />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "profile" && (
            <ProfileInfo
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              myInfo={myInfo}
              setMyInfo={setMyInfo}
            />
          )}

          {activeTab === "bookings" && (
            <BookingHistory bookingHistory={bookingHistory} />
          )}

          {activeTab === "favorites" && (
            <Favorites favoriteFilms={favoriteFilms} loading={loading} />
          )}

          {activeTab === "settings" && (
            <Settings setShowChangePasswordModal={setShowChangePasswordModal} />
          )}
        </motion.div>
      </div>

      <ChangePasswordModal
        showModal={showChangePasswordModal}
        setShowModal={setShowChangePasswordModal}
        userName={formData.userName}
      />
    </div>
  );
};

export default Profile;
