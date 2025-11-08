import React, { useState } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import Profile from "./Profile";
import Goals from "./Goals";
import Liabilities from "./Liabilities";
import SIPs from "./SIPs";
import RiskProfile from "./RiskProfile";
import { useNavigate } from "react-router-dom";

export default function ClientLayout() {
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm px-4">
                <Navbar.Brand className="fw-semibold">Client Dashboard</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link onClick={() => setActiveTab("profile")}>Profile</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab("goals")}>Goals</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab("liabilities")}>Liabilities</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab("sips")}>SIPs</Nav.Link>
                    <Nav.Link onClick={() => setActiveTab("risk")}>Risk Profile</Nav.Link>
                    <Button variant="outline-dark" size="sm" className="ms-3" onClick={logout}>
                        Logout
                    </Button>
                </Nav>
            </Navbar>

            <Container className="py-4">
                {activeTab === "profile" && <Profile />}
                {activeTab === "goals" && <Goals />}
                {activeTab === "liabilities" && <Liabilities />}
                {activeTab === "sips" && <SIPs />}
                {activeTab === "risk" && <RiskProfile />}
            </Container>
        </>
    );
}
