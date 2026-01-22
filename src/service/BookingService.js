import { authHttp } from "../../utils/baseUrl";

/**
 * Lấy danh sách booking của user hiện tại
 */
export const getMyBookings = async () => {
  try {
    const response = await authHttp.get("/booking/my-bookings");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching my bookings:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết 1 booking
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await authHttp.get(`/booking/${bookingId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching booking details:", error);
    throw error;
  }
};

/**
 * Hủy booking (nếu cho phép)
 */
export const cancelMyBooking = async (bookingId) => {
  try {
    const response = await authHttp.put(`/booking/${bookingId}/cancel`);
    return response.data.result;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    throw error;
  }
};
