import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyInfo } from "../service/ProfileService";
import { http } from "../../utils/baseUrl";

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [myInfo, setMyInfo] = useState(
    JSON.parse(sessionStorage.getItem("myInfo"))
  );
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        await http.post("/auth/refreshToken", null, {
          withCredentials: true,
        });
        await getMyInfo().then((info) => setMyInfo(info));
      } catch (err) {
        setMyInfo(null);
        sessionStorage.removeItem("myInfo");
      }
    };
    checkLoginStatus();
  }, []);
  const value = { myInfo, setMyInfo };
  sessionStorage.setItem("myInfo", JSON.stringify(myInfo));
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
