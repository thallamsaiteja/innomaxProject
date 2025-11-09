// src/pages/ClientDashboard.js
import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Spinner, Alert, ProgressBar, Table, Badge, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "../styles/ClientDashboard.css";

function KpiCard({ title, value, footer }) {
    return (
        <Card className="shadow-sm h-100">
            <Card.Body>
                <div className="text-muted small">{title}</div>
                <div className="display-6 fw-semibold mt-1">{value}</div>
                {footer && <div className="text-muted small mt-2">{footer}</div>}
            </Card.Body>
        </Card>
    );
}

export default function ClientDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [data, setData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/login", { replace: true });
    }, [navigate]);

    useEffect(() => {
        setLoading(true);
        setErr("");

        api
            .get("/api/dashboard/client")
            .then((res) => setData(res.data))
            .catch((e) => {
                const msg =
                    e?.response?.data?.message ||
                    e?.response?.data?.error ||
                    "Could not load dashboard. Please try again.";
                setErr(msg);
            })
            .finally(() => setLoading(false));
    }, []);

    const { name, email, totalAssets = 0, totalLiabilities = 0, netWorth = 0, goals = [], riskProfile = {} } = data || {};

    const fmtMoney = (n) =>
        typeof n === "number"
            ? n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
            : "-";

    const topGoal = useMemo(() => {
        if (!goals?.length) return null;
        return goals.slice().sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];
    }, [goals]);

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        delete api.defaults.headers.common.Authorization;
        navigate("/login", { replace: true });
    };

    const menuItems = [
        { label: "Profile", path: "/profile" },
        { label: "Goals", path: "/goals" },
        { label: "Liabilities", path: "/liabilities" },
        { label: "SIPs", path: "/sips" },
        { label: "Risk Profile", path: "/risk-profile" },
    ];

    return (
        <div className="client-dashboard">
            {/* Sidebar */}
            <aside className="client-sidebar">
                <h4 className="sidebar-title">Client Panel</h4>
                <nav>
                    {menuItems.map((item) => (
                        <div
                            key={item.path}
                            className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <Button variant="outline-light" size="sm" onClick={onLogout}>
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="client-content">
                <Container className="py-4">
                    <h3 className="fw-semibold mb-3">Client Dashboard</h3>
                    <div className="text-muted mb-4">
                        {name ? `${name}` : "Welcome"} {email ? `• ${email}` : ""}
                    </div>

                    {loading && (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" />
                        </div>
                    )}

                    {!loading && err && <Alert variant="danger">{err}</Alert>}

                    {!loading && !err && (
                        <>
                            {/* KPIs */}
                            <Row xs={1} md={3} className="g-3 mb-3">
                                <Col>
                                    <KpiCard title="Total Assets" value={fmtMoney(totalAssets)} footer="All investments & cash" />
                                </Col>
                                <Col>
                                    <KpiCard title="Total Liabilities" value={fmtMoney(totalLiabilities)} footer="Loans & dues" />
                                </Col>
                                <Col>
                                    <KpiCard title="Net Worth" value={fmtMoney(netWorth)} footer="Assets − Liabilities" />
                                </Col>
                            </Row>

                            {/* Goals & Risk */}
                            <Row className="g-3">
                                <Col lg={8}>
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Card.Title>Your Goals</Card.Title>
                                            {(!goals || goals.length === 0) && (
                                                <div className="text-muted text-center py-4">No goals yet.</div>
                                            )}
                                            {!!goals?.length && (
                                                <Table responsive hover className="align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>Goal</th>
                                                            <th className="text-end">Target</th>
                                                            <th className="text-end">Achieved</th>
                                                            <th style={{ width: 240 }}>Progress</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {goals.map((g, i) => {
                                                            const progress = Math.min(100, Math.max(0, Math.round(g.progress ?? 0)));
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{g.name || g.goalName}</td>
                                                                    <td className="text-end">{fmtMoney(g.target)}</td>
                                                                    <td className="text-end">{fmtMoney(g.achieved)}</td>
                                                                    <td>
                                                                        <ProgressBar now={progress} variant={progress < 40 ? "danger" : progress < 80 ? "warning" : "success"} />
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>

                                <Col lg={4}>
                                    <Card className="shadow-sm h-100">
                                        <Card.Body>
                                            <Card.Title>Risk Profile</Card.Title>
                                            {!riskProfile?.riskType ? (
                                                <div className="text-muted">No risk profile yet.</div>
                                            ) : (
                                                <>
                                                    <Badge bg="info" className="mb-3">{riskProfile.riskType}</Badge>
                                                    {riskProfile.recommendedPortfolio && (
                                                        <p className="small mb-1">
                                                            Recommended Portfolio: <strong>{riskProfile.recommendedPortfolio}</strong>
                                                        </p>
                                                    )}
                                                </>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </main>
        </div>
    );
}
