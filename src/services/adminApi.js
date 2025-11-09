import api from "./api";

// Lists for tables
export const getAllClients = async () => {
    const res = await api.get("/api/dashboard/admin/clients");
    return res.data;
};

export const getTotalClients = async () => {
    const res = await api.get("/api/dashboard/admin/analytics/overview");
    return res.data.totalClients; // 👈 only total clients
};

export const getAllGoals = async () => {
    const res = await api.get("/api/dashboard/admin/goals");
    return res.data;
};

export const getAllRisks = async () => {
    const res = await api.get("/api/dashboard/admin/risks");
    return res.data;
};

export const getAllSIPs = async () => {
    const res = await api.get("/api/dashboard/admin/sips");
    return res.data;
};

// 🟢 Dashboard Overview (Combined Summary)
export const getAdminOverview = async () => {
    const res = await api.get("/api/dashboard/admin/analytics/overview");
    return res.data;
};

// 🟢 Risk Stats
export const getRiskStats = async () => {
    const res = await api.get("/api/dashboard/admin/analytics/risk-stats");
    return res.data;
};

// 🟢 Goals and Liabilities
export const getGoalsLiabilities = async () => {
    const res = await api.get("/api/dashboard/admin/analytics/goals-liabilities");
    return res.data;
};
