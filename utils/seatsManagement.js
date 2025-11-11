import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { http } from "./baseUrl";

/**
 * ✅ THAY ĐỔI: Tách logic quản lý ghế ra hook riêng
 * - Giảm 100+ dòng code trong component
 * - Dễ test và reuse
 */
export const seatsManagement = (showId, myInfo) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [seatCountdowns, setSeatCountdowns] = useState({});

  const selectedSeatsRef = useRef([]);
  const countdownIntervalRef = useRef(null);

  // Sync ref with state

  useEffect(() => {
    selectedSeatsRef.current = selectedSeats;
  }, [selectedSeats]);

  // ==================== FETCH OCCUPIED SEATS ====================
  useEffect(() => {
    if (!showId) return;

    const fetchOccupied = async () => {
      try {
        const { data } = await http.get(`/seat/occupied/${showId}`);
        const seats = data.result || [];

        setOccupiedSeats(seats);

        const countdowns = {};
        const mySeats = [];

        seats.forEach((seat) => {
          if (seat.userId === myInfo?.id) {
            mySeats.push(seat);
            if (seat.status === "HELD") {
              countdowns[seat.seatNumber] = seat.expiresAt;
            }
          }
        });

        setSeatCountdowns(countdowns);
        setSelectedSeats(mySeats);
      } catch (error) {
        console.error("Error fetching occupied seats:", error);
      }
    };

    fetchOccupied();
  }, [showId, myInfo]);

  // ==================== COUNTDOWN INTERVAL ====================
  useEffect(() => {
    if (Object.keys(seatCountdowns).length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const newCountdowns = {};
      const expiredSeats = [];

      Object.entries(seatCountdowns).forEach(([seatNumber, expiresAt]) => {
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));

        if (remaining > 0) {
          newCountdowns[seatNumber] = expiresAt;
        } else {
          expiredSeats.push(seatNumber);
        }
      });

      setSeatCountdowns(newCountdowns);

      if (expiredSeats.length > 0) {
        expiredSeats.forEach(async (seatNumber) => {
          try {
            const { data } = await http.post("/seat/release", {
              showId: parseInt(showId),
              seatNumber,
              userId: myInfo?.id,
            });
            if (data.result.success) {
              toast.error(`⏰ Ghế ${seatNumber} đã được hết thời gian giữ!`);
            }
          } catch (err) {
            return;
          }
        });
      }
    }, 1000);

    countdownIntervalRef.current = interval;

    return () => clearInterval(interval);
  }, [seatCountdowns]);

  // ==================== WEBSOCKET UPDATE HANDLER ====================
  const handleSeatUpdate = (seatUpdate) => {
    const { userId, seatNumber, seatNumbers, status, expiresAt } = seatUpdate;

    // ✅ THAY ĐỔI: Sử dụng switch case thay vì if-else
    switch (status) {
      case "HELD":
        setOccupiedSeats((prev) => [
          ...prev.filter((s) => s.seatNumber !== seatNumber),
          { seatNumber, status, expiresAt },
        ]);

        if (userId === myInfo?.id) {
          // setSelectedSeats((prev) => [...prev, seatNumber]);
          setSelectedSeats((prev) => [
            ...prev.filter((s) => s.seatNumber !== seatNumber),
            { seatNumber, status, expiresAt },
          ]);
          setSeatCountdowns((prev) => ({
            ...prev,
            [seatNumber]: expiresAt,
          }));
          toast.success(`Giữ ghế ${seatNumber} thành công!`, {
            duration: 2000,
            icon: "🔒",
          });
        }
        break;

      case "BOOKED":
        setOccupiedSeats((prev) => [
          ...prev.filter((s) => !seatNumbers.includes(s.seatNumber)),
          ...seatNumbers.map((seatNumber) => ({
            seatNumber,
            status,
            expireAt: 0,
          })),
        ]);
        setSelectedSeats((prev) => {
          if (userId !== myInfo?.id) return;
          return [
            ...prev.filter((s) => !seatNumbers.includes(s.seatNumber)),
            ...seatNumbers.map((seatNumber) => ({
              seatNumber,
              status,
              expireAt: 0,
            })),
          ];
        });
        setSeatCountdowns([]);
        break;

      case "AVAILABLE":
        setOccupiedSeats((prev) =>
          prev.filter((s) => s.seatNumber !== seatNumber)
        );

        setSelectedSeats((prev) =>
          prev.filter((s) => s.seatNumber !== seatNumber)
        );
        setSeatCountdowns((prev) => {
          const { [seatNumber]: _, ...rest } = prev;
          return rest;
        });
        break;

      default:
        console.warn("Unknown seat status:", status);
    }
  };

  // ==================== SEAT CLICK HANDLER ====================
  const handleSeatClick = async (seatId) => {
    if (!myInfo) {
      toast.error("Vui lòng đăng nhập!");
      return false;
    }

    const isReleasing = selectedSeats.some(
      (seat) => seat.seatNumber === seatId
    );
    const endpoint = isReleasing ? "/seat/release" : "/seat/hold";

    try {
      const { data } = await http.post(endpoint, {
        showId: parseInt(showId),
        seatNumber: seatId,
        userId: myInfo?.id,
      });

      if (data.result.success) {
        return true;
      } else {
        toast.error(data.result.message);
        return false;
      }
    } catch (error) {
      toast.error(`Lỗi khi ${isReleasing ? "bỏ" : "giữ"} ghế!`);
      return false;
    }
  };

  // ==================== RELEASE ON TAB CLOSE ====================
  const releaseSeatWhenCloseTab = () => {
    selectedSeatsRef.current.forEach((seat) => {
      const blob = new Blob(
        [
          JSON.stringify({
            showId: parseInt(showId),
            seatNumber: seat.seatNumber,
            userId: myInfo?.id,
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon("http://localhost:8080/cinezone/seat/release", blob);
    });
  };

  return {
    selectedSeats,
    occupiedSeats,
    seatCountdowns,
    handleSeatUpdate,
    handleSeatClick,
    releaseSeatWhenCloseTab,
  };
};
