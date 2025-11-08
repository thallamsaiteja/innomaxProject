import React, { useEffect, useState } from "react";
import { getAdminOverview } from "../../services/adminApi";

const StatsCards = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        getAdminOverview().then(setStats).catch(console.error);
    }, []);

    if (!stats) return <p>Loading stats...</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded p-4 text-center">
                <h3 className="text-gray-500">Total Clients</h3>
                <p className="text-2xl font-bold">{stats.totalClients}</p>
            </div>
            <div className="bg-white shadow rounded p-4 text-center">
                <h3 className="text-gray-500">Completed Risk Profiles</h3>
                <p className="text-2xl font-bold">{stats.riskProfilesCompleted}</p>
            </div>
            <div className="bg-white shadow rounded p-4 text-center">
                <h3 className="text-gray-500">Active SIPs</h3>
                <p className="text-2xl font-bold">{stats.activeSIPs}</p>
            </div>
        </div>
    );
};

export default StatsCards;
