import { createContext, useEffect, useState } from "react";
import { makeRequest } from "../api.js";
import logger from "../helpers/logger.js";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [userUpdated, setUserUpdated] = useState(false);

  const register = async (inputs) => {
    await makeRequest.post("auth/register", inputs);
    const loginRes = await makeRequest.post("auth/login", {
      username: inputs.username,
      password: inputs.password,
    });

    setCurrentUser(loginRes.data);
  };

  const login = async (inputs) => {
    const res = await makeRequest.post("auth/login", inputs, {
      withCredentials: true,
    });

    setCurrentUser(res.data);
  };

  const logout = async () => {
    try {
      await makeRequest.post("auth/logout", {
        withCredentials: true,
      });
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (error) {
      logger.error(`Logout failed: ${error.message}`);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        register,
        userUpdated,
        setUserUpdated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
