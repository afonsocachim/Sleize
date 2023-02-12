import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { ProfilePage } from "./auth/ProfilePage";
import { CheckUser } from "./auth/CheckUser";
import { navStore } from "./store/navStore";

export const Router = () => {
  const nav = useNavigate();

  React.useEffect(() => {
    navStore.setState({ nav });
  }, [nav]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<CheckUser />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};
