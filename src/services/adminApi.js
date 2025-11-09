// src/services/adminApi.js
import api from "./api";

// If your api instance already adds the token via interceptor, no headers are needed.
// Leaving headers here for clarity and to avoid confusion.

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Lists for tables
export const getAllClients = async () => {
    const res = await api.get("/api/dashboard/admin/clients", authHeader());
    return res.data;
};

export const getAllGoals = async () => {
    const res = await api.get("/api/dashboard/admin/goals", authHeader());
    return res.data;
};

export const getAllRisks = async () => {
    const res = await api.get("/api/dashboard/admin/risks", authHeader());
    return res.data;
};

export const getAllSIPs = async () => {
    const res = await api.get("/api/dashboard/admin/sips", authHeader());
    return res.data;
};


// 🟢 Dashboard Overview (Combined Summary)
export const getAdminOverview = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/dashboard/admin/analytics/overview", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// 🟢 Risk Stats
export const getRiskStats = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/dashboard/admin/analytics/risk-stats", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// 🟢 Goals and Liabilities
export const getGoalsLiabilities = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/dashboard/admin/analytics/goals-liabilities", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

