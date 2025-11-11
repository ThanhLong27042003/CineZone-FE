import React, { useState } from "react";
import BlurCircle from "./BlurCircle";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const DateSelect = ({ showDate, showsForDate, id }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [showIdSelected, setShowIdSelected] = useState(null);
  const onBookHandler = () => {
    if (!selected) {
      return toast("Please select a date");
    }
    navigate(`/movies/${id}/${showIdSelected}/${showDate}/${selected}`);
    scrollTo(0, 0);
  };
  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" left="0px" />
        <div className="">
          <p className="text-lg font-semibold">
            {showsForDate[0].showDate.split("-").reverse().join("-")}
          </p>
          <div className="flex items-center gap-6 text-sm mt-5">
            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {showsForDate.map((show) => (
                <button
                  onClick={() => {
                    setSelected(show.showTime);
                    setShowIdSelected(show.showId);
                  }}
                  key={show.showTime}
                  className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${
                    selected === show.showTime
                      ? "bg-primary text-white"
                      : "border border-primary/70"
                  }`}
                >
                  <span>{show.showTime?.slice(0, 5) || "1"}</span>
                </button>
              ))}
            </span>
          </div>
        </div>
        <button
          onClick={onBookHandler}
          className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
