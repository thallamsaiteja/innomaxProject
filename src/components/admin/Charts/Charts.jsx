import React, { useEffect, useState } from "react";
import { getAdminOverview } from "../../../services/adminApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Charts = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        getAdminOverview().then(setData);
    }, []);

    if (!data) return <p>Loading charts...</p>;

    const pieData = [
        { name: "Aggressive", value: 10 },
        { name: "Moderate", value: 7 },
        { name: "Conservative", value: 4 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg mb-2 font-semibold">Risk Profile Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" label outerRadius={80}>
                            {pieData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg mb-2 font-semibold">Client Growth Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={[{ month: "Oct", value: 5 }, { month: "Nov", value: 8 }]}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4F46E5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Charts;
