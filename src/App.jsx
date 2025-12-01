import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Layout from "./pages/admin/Layout";
import AddShows from "./pages/admin/AddShows";
import ListShows from "./pages/admin/ListShows";
import ListBookings from "./pages/admin/ListBookings";
import DashBoard from "./pages/admin/DashBoard";
import Login from "./pages/Login";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import VNPayCallback from "./pages/VNPayCallback";
import PayPalCallback from "./pages/PayPalCallback";
import PaymentCancelled from "./pages/PaymentCancelled";

const App = () => {
  const isAdminLogin = useLocation().pathname.startsWith("/admin");
  const isCustomerLogin =
    useLocation().pathname.startsWith("/login") ||
    useLocation().pathname.startsWith("/register");
  return (
    <>
      {!isAdminLogin && !isCustomerLogin && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route
          path="/movies/:movieId/:showId/:date/:time"
          element={<SeatLayout />}
        />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/vnpay-callback" element={<VNPayCallback />} />
        <Route path="/payment/paypal-callback" element={<PayPalCallback />} />
        <Route path="/payment/cancelled" element={<PaymentCancelled />} />
        <Route path="/my_bookings" element={<MyBookings />} />
        <Route path="/admin/*" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
      {!isAdminLogin && !isCustomerLogin && <Footer />}
    </>
  );
};

export default App;
