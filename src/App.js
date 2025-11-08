import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ClientLayout from "./pages/client/ClientLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {isAuthenticated && (
          <>
            <Route path="/clientDashboard" element={<ClientLayout />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
          </>
        )}

        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
