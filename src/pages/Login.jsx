import React from "react";
import { login } from "../service/LoginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../service/ProfileService";
const Login = () => {
  const navigate = useNavigate();
  const { setMyInfo } = useAuth();
  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginData = {
      userName: formData.get("userName"),
      passWord: formData.get("passWord"),
    };

    try {
      const accessToken = await login(loginData);
      sessionStorage.setItem("ACCESS_TOKEN", accessToken);
      const info = await getMyInfo();
      setMyInfo(info);
      alert("Đăng nhập thành công ✅");
      navigate("/");
    } catch (error) {
      alert(
        "Đăng nhập thất bại ❌ Vui lòng kiểm tra lại tài khoản hoặc mật khẩu" +
          error
      );
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-[url('src/assets/login-background.jpg')] bg-cover bg-center">
      {/* Khung đăng nhập chính */}
      <div className="flex flex-col items-center bg-white bg-opacity-95 rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4">
        {/* Phần tiêu đề */}
        <div className="flex justify-center items-center py-6 border-gray-200 w-full mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Đăng nhập</h1>
        </div>

        <form
          className="flex flex-col w-full gap-6 text-gray-700"
          onSubmit={handleLogin}
        >
          {/* Nhóm Email */}
          <div className="flex flex-col">
            <label htmlFor="emailInput" className="text-lg font-medium mb-2">
              Email:
            </label>
            <input
              type="text"
              id="emailInput" // Thêm id để liên kết với label
              name="userName"
              placeholder="Nhập địa chỉ Email của bạn"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nhóm Mật khẩu */}
          <div className="flex flex-col">
            <label htmlFor="passwordInput" className="text-lg font-medium mb-2">
              Mật khẩu:
            </label>
            <input
              type="password"
              id="passwordInput"
              name="passWord"
              placeholder="Nhập mật khẩu của bạn"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          {/* Nút Đăng nhập */}
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        {/* Thêm phần tùy chọn khác (nếu có) */}
        <div className="mt-6 text-center text-gray-600">
          <p>
            Bạn chưa có tài khoản?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
