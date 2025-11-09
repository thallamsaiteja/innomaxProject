import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import StatsCards from "../../components/admin/StatsCards";
import CustomersTable from "../../components/admin/CustomersTable";
import Charts from "../../components/admin/Charts/Charts";
import "../../styles/AdminDashboard.css";
import GoalsTable from "../../components/admin/GoalsTable";
import RisksTable from "../../components/admin/RisksTable";
import SIPsTable from "../../components/admin/SIPsTable";

const AdminDashboard = () => {
    const [active, setActive] = useState("charts");
    const [menuOpen, setMenuOpen] = useState(false);

    const renderSection = () => {
        switch (active) {
            case "charts":
                return (
                    <div className="dashboard-section">
                        <div className="dashboard-card">
                            <h2>Overview Summary</h2>
                            <StatsCards />
                        </div>

                        <div className="dashboard-card">
                            <h2>Performance Charts</h2>
                            <Charts />
                        </div>
                    </div>
                );

            case "clients":
                return (
                    <div className="dashboard-card">
                        <h2>Client Information</h2>
                        <CustomersTable />
                    </div>
                );

            case "risks":
                return (
                    <div className="dashboard-card">
                        <h2>Risk Profiles</h2>
                        <RisksTable />
                    </div>
                );

            case "goals":
                return (
                    <div className="dashboard-card">
                        <h2>Goals Overview</h2>
                        <GoalsTable />
                    </div>
                );

            case "sips":
                return (
                    <div className="dashboard-card">
                        <h2>SIP Plans</h2>
                        <SIPsTable />
                    </div>
                );

            case "investments":
                return (
                    <div className="dashboard-card">
                        <h2>Investment Module</h2>
                        <p>📈 Coming soon...</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar */}
            <Sidebar active={active} setActive={setActive} />

            {/* Mobile Header */}
            <div className="mobile-header">
                <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </button>
                <h4>Admin Panel</h4>
            </div>

            {/* Mobile Sidebar */}
            {menuOpen && (
                <div
                    className="mobile-menu"
                    onClick={() => setMenuOpen(false)}
                >
                    <Sidebar
                        active={active}
                        setActive={(key) => {
                            setActive(key);
                            setMenuOpen(false);
                        }}
                    />
                </div>
            )}

            {/* Main Content */}
            <div className="main-content">
                <h1 className="page-title">
                    {active === "charts"
                        ? "Admin Dashboard Overview"
                        : active.charAt(0).toUpperCase() + active.slice(1)}
                </h1>
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminDashboard;
