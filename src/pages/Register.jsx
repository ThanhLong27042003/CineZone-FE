import React from "react";
import { register } from "../service/LoginService"; // Import register API
import { login, getMyInfo } from "../service/LoginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { setMyInfo } = useAuth();

  const handleRegister = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp! Vui lòng kiểm tra lại.");
      return;
    }

    // Chuẩn bị data theo format API yêu cầu
    const registerData = {
      userName: formData.get("email"), // Dùng email làm username
      password: password,
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      dob: formData.get("birthDate"), // API yêu cầu "dob" thay vì "birthDate"
    };

    try {
      // Gọi API đăng ký
      await register(registerData);

      alert("Đăng ký thành công ✅");

      // Sau khi đăng ký thành công, tự động đăng nhập
      const loginData = {
        userName: registerData.userName,
        passWord: registerData.password,
      };

      const accessToken = await login(loginData);
      sessionStorage.setItem("ACCESS_TOKEN", accessToken);
      const info = await getMyInfo();
      setMyInfo(info);

      navigate("/");
    } catch (error) {
      console.error("Register error:", error);
      alert(
        "Đăng ký thất bại ❌ " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[url('src/assets/login-background.jpg')] bg-cover bg-center">
      {/* Khung đăng ký chính */}
      <div className="flex flex-col items-center bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4">
        {/* Phần tiêu đề */}
        <div className="flex justify-center items-center py-4 border-gray-200 w-full mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Đăng ký</h1>
        </div>

        <form
          className="flex flex-col w-full gap-3 text-gray-700"
          onSubmit={handleRegister}
        >
          {/* Nhóm First Name */}
          <div className="flex flex-col">
            <label
              htmlFor="firstNameInput"
              className="text-sm font-medium mb-1"
            >
              Họ:
            </label>
            <input
              type="text"
              id="firstNameInput"
              name="firstName"
              placeholder="Nhập họ của bạn"
              required
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nhóm Last Name */}
          <div className="flex flex-col">
            <label htmlFor="lastNameInput" className="text-sm font-medium mb-1">
              Tên:
            </label>
            <input
              type="text"
              id="lastNameInput"
              name="lastName"
              placeholder="Nhập tên của bạn"
              required
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nhóm Ngày sinh */}
          <div className="flex flex-col">
            <label
              htmlFor="birthDateInput"
              className="text-sm font-medium mb-1"
            >
              Ngày sinh:
            </label>
            <input
              type="date"
              id="birthDateInput"
              name="birthDate"
              required
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nhóm Email */}
          <div className="flex flex-col">
            <label htmlFor="emailInput" className="text-sm font-medium mb-1">
              Email:
            </label>
            <input
              type="email"
              id="emailInput"
              name="email"
              placeholder="Nhập địa chỉ Email của bạn"
              required
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nhóm Mật khẩu */}
          <div className="flex flex-col">
            <label htmlFor="passwordInput" className="text-sm font-medium mb-1">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="passwordInput"
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              required
              minLength={6}
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nhóm Xác nhận mật khẩu */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPasswordInput"
              className="text-sm font-medium mb-1"
            >
              Xác nhận mật khẩu:
            </label>
            <input
              type="password"
              id="confirmPasswordInput"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu của bạn"
              required
              minLength={6}
              className="p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nút Đăng ký */}
          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Đăng ký
            </button>
          </div>
        </form>

        {/* Thêm phần tùy chọn khác */}
        <div className="mt-4 text-center text-gray-600">
          <p className="text-sm">
            Bạn đã có tài khoản?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Đăng nhập ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
