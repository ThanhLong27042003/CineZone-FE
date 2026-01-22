import React from "react";
import BlurCircle from "../components/BlurCircle";
import BookingHistory from "../components/BookingHistory";

const MyBookings = () => {
  return (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle top="0" left="600px" />
      </div>

      <BookingHistory />
    </div>
  );
};

export default MyBookings;
