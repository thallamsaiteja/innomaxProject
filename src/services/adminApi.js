import api from "./api";

// ✅ Get dashboard overview data
export const getAdminOverview = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/dashboard/admin/analytics/overview", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// ✅ Get all clients for the CustomersTable
export const getAllClients = async () => {
    const token = localStorage.getItem("token");
    const res = await api.get("/api/dashboard/admin/clients", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
