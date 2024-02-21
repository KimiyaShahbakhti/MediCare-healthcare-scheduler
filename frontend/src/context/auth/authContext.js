import react, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = react.createContext();

const AuthContextProvider = (props) => {
  let navigate = useNavigate();

  const loginAdmin = (token) => {
    localStorage.setItem("token", token);
    navigate("/dashboardA/", { replace: true });
  };
  const loginUser = (token) => {
    localStorage.setItem("token", token);
    navigate("/dashboardU/", { replace: true });
  };
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/signup", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        loginAdmin,
        loginUser,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
