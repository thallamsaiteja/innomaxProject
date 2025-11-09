import React, { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import Profile from "./Profile";
import Goals from "./Goals";
import Liabilities from "./Liabilities";
import SIPs from "./SIPs";
import RiskProfile from "./RiskProfile";
import { useNavigate } from "react-router-dom";
import "../../styles/ClientLayout.css";

export default function ClientLayout() {
    const [activeTab, setActiveTab] = useState("profile");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // For desktop: sidebar always open. For mobile: toggle.
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSidebarOpen(false); // close sidebar on tab selection on mobile
    };

    return (
        <div className="client-root-layout">
            {/* Hamburger for mobile */}
            <button
                className="client-hamburger"
                onClick={() => setSidebarOpen(o => !o)}
                aria-label="Toggle navigation"
                disabled={sidebarOpen}
            >
                <span></span><span></span><span></span>
            </button>

            {/* Sidebar */}
            <aside className={`client-sidebar${sidebarOpen ? " open" : ""}`}>
                <div className="sidebar-header">
                    <span className="fs-4 fw-bold">Client</span>
                    <span className="sidebar-brand text-muted d-block">Dashboard</span>
                </div>
                <Nav variant="pills" className="flex-column sidebar-nav">
                    <Nav.Link active={activeTab === "profile"} onClick={() => handleTabClick("profile")}>🧑 Profile</Nav.Link>
                    <Nav.Link active={activeTab === "goals"} onClick={() => handleTabClick("goals")}>🎯 Goals</Nav.Link>
                    <Nav.Link active={activeTab === "liabilities"} onClick={() => handleTabClick("liabilities")}>📉 Liabilities</Nav.Link>
                    <Nav.Link active={activeTab === "sips"} onClick={() => handleTabClick("sips")}>💰 SIPs</Nav.Link>
                    <Nav.Link active={activeTab === "risk"} onClick={() => handleTabClick("risk")}>⚠️ Risk Profile</Nav.Link>
                </Nav>
                <div className="mt-auto px-4 mb-3 w-100">
                    <Button variant="outline-light" size="sm" className="w-100" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main content */}
            <main className="client-content-main py-4 px-4">
                {activeTab === "profile" && <Profile />}
                {activeTab === "goals" && <Goals />}
                {activeTab === "liabilities" && <Liabilities />}
                {activeTab === "sips" && <SIPs />}
                {activeTab === "risk" && <RiskProfile />}
            </main>
        </div>
    );
}
