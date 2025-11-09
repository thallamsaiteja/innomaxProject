import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    CartesianGrid,
    Legend,
} from "recharts";
import { getAdminOverview } from "../../../services/adminApi";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

const Charts = () => {
    const [sipProgress, setSipProgress] = useState([]);
    const [goalDistribution, setGoalDistribution] = useState([]);
    const [customerGrowth, setCustomerGrowth] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartsData = async () => {
            try {
                const data = await getAdminOverview();

                // 🟢 Convert backend maps → arrays for recharts
                const sipData = Object.entries(data.sipProgress || {}).map(([key, val]) => ({
                    name: key,
                    value: val,
                }));

                const goalData = Object.entries(data.goalDistribution || {}).map(([key, val]) => ({
                    name: key,
                    value: val,
                }));

                const growthData = Object.entries(data.customerGrowth || {}).map(([month, val]) => ({
                    month,
                    clients: val,
                }));

                setSipProgress(sipData);
                setGoalDistribution(goalData);
                setCustomerGrowth(growthData);
            } catch (err) {
                console.error("Error fetching chart data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChartsData();
    }, []);

    if (loading) {
        return (
            <div className="p-5 bg-white rounded shadow-md text-center text-gray-600">
                Loading chart data...
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 📊 SIP Progress (Bar Chart) */}
            <div className="bg-white p-5 rounded shadow-md col-span-1">
                <h3 className="text-lg font-semibold mb-3">SIP Progress</h3>
                {sipProgress.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No data to display</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={sipProgress}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* 🎯 Goal Distribution (Pie Chart) */}
            <div className="bg-white p-5 rounded shadow-md col-span-1">
                <h3 className="text-lg font-semibold mb-3">Goal Distribution</h3>
                {goalDistribution.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No data to display</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={goalDistribution}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {goalDistribution.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* 📈 Customer Growth (Line Chart) */}
            <div className="bg-white p-5 rounded shadow-md col-span-1">
                <h3 className="text-lg font-semibold mb-3">Customer Growth</h3>
                {customerGrowth.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No data to display</p>
                ) : (
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={customerGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="clients"
                                stroke="#10B981"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default Charts;
