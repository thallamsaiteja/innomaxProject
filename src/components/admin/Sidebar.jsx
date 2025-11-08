import React from "react";
import { FaChartPie, FaUsers, FaFlag, FaShieldAlt, FaCoins, FaClipboardList } from "react-icons/fa";

const Sidebar = ({ active, setActive }) => {
    const menu = [
        { key: "charts", label: "Charts", icon: <FaChartPie /> },
        { key: "clients", label: "Clients", icon: <FaUsers /> },
        { key: "risks", label: "Risks", icon: <FaShieldAlt /> },
        { key: "goals", label: "Goals", icon: <FaFlag /> },
        { key: "sips", label: "SIPs", icon: <FaCoins /> },
        { key: "investments", label: "Investments", icon: <FaClipboardList /> },
    ];

    return (
        <div className="bg-gray-900 text-white w-64 h-screen p-5 flex flex-col">
            <h2 className="text-xl font-semibold mb-6 text-center">Admin Panel</h2>
            <ul className="space-y-2">
                {menu.map((item) => (
                    <li
                        key={item.key}
                        onClick={() => setActive(item.key)}
                        className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-700 ${active === item.key ? "bg-blue-600" : ""
                            }`}
                    >
                        {item.icon} <span>{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
