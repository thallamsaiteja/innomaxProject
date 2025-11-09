import React from "react";
import {
    FaChartPie,
    FaUsers,
    FaFlag,
    FaShieldAlt,
    FaCoins,
    FaClipboardList,
    FaSignOutAlt,
} from "react-icons/fa";
import "../../styles/AdminDashboard.css";

const Sidebar = ({ active, setActive }) => {
    const menu = [
        { key: "charts", label: "Charts", icon: <FaChartPie /> },
        { key: "clients", label: "Clients", icon: <FaUsers /> },
        { key: "risks", label: "Risks", icon: <FaShieldAlt /> },
        { key: "goals", label: "Goals", icon: <FaFlag /> },
        { key: "sips", label: "SIPs", icon: <FaCoins /> },
        { key: "investments", label: "Investments", icon: <FaClipboardList /> },
    ];

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Admin Panel</h2>
            <ul className="sidebar-menu">
                {menu.map((item) => (
                    <li
                        key={item.key}
                        className={`sidebar-item ${active === item.key ? "active" : ""}`}
                        onClick={() => setActive(item.key)}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </li>
                ))}
            </ul>
            <button className="logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
            </button>
        </div>
    );
};

export default Sidebar;
