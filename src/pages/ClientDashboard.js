// src/pages/ClientDashboard.js
import { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Spinner, Alert, ProgressBar, Table, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

// Small card for KPIs
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
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [data, setData] = useState(null);

    // Format money nicely
    const fmtMoney = (n) =>
        typeof n === "number"
            ? n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
            : "-";

    // Simple guard: if no token, push to login
    useEffect(() => {
        const t = localStorage.getItem("token");
        if (!t) navigate("/login", { replace: true });
    }, [navigate]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setErr("");

        api
            .get("/api/dashboard/client")
            .then((res) => {
                if (!mounted) return;
                setData(res.data);
            })
            .catch((e) => {
                if (!mounted) return;
                const msg =
                    e?.response?.data?.message ||
                    e?.response?.data?.error ||
                    "Could not load dashboard. Please try again.";
                setErr(msg);
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    const {
        name,
        email,
        totalAssets = 0,
        totalLiabilities = 0,
        netWorth = 0,
        goals = [],
        riskProfile = {},
    } = data || {};

    const topGoal = useMemo(() => {
        if (!goals?.length) return null;
        // highest progress
        return goals
            .slice()
            .sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))[0];
    }, [goals]);

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        delete api.defaults.headers.common.Authorization;
        navigate("/login", { replace: true });
    };

    return (
        <Container className="py-4">
            <Row className="align-items-center mb-3">
                <Col>
                    <h3 className="mb-0">Client Dashboard</h3>
                    <div className="text-muted small">
                        {name ? <span>{name}</span> : "Welcome"} {email ? `• ${email}` : ""}
                    </div>
                </Col>
                <Col xs="auto">
                    <Button variant="outline-secondary" onClick={onLogout}>
                        Logout
                    </Button>
                </Col>
            </Row>

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

                    {/* Goals + Risk Profile */}
                    <Row className="g-3">
                        <Col lg={8}>
                            <Card className="shadow-sm">
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <Card.Title className="mb-0">Your Goals</Card.Title>
                                    </div>

                                    {(!goals || goals.length === 0) && (
                                        <div className="text-muted py-4 text-center">No goals yet. Add your first goal to get started.</div>
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
                                                            <td>
                                                                <div className="fw-semibold">{g.name || g.goalName}</div>
                                                                {g.timeline && <div className="small text-muted">{g.timeline}</div>}
                                                            </td>
                                                            <td className="text-end">{fmtMoney(g.target || g.targetAmount)}</td>
                                                            <td className="text-end">{fmtMoney(g.achieved || g.achievedAmount)}</td>
                                                            <td style={{ minWidth: 220 }}>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <div className="flex-grow-1">
                                                                        <ProgressBar
                                                                            now={progress}
                                                                            variant={progress < 40 ? "danger" : progress < 80 ? "warning" : "success"}
                                                                        />
                                                                    </div>
                                                                    <div className="small text-nowrap">{progress}%</div>
                                                                </div>
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
                                    {!riskProfile || (!riskProfile.riskType && !riskProfile.recommendedPortfolio) ? (
                                        <div className="text-muted">No risk profile yet.</div>
                                    ) : (
                                        <>
                                            <div className="mb-2">
                                                <div className="text-muted small">Risk Type</div>
                                                <div className="h5 mb-0">
                                                    <Badge bg={
                                                        /conservative/i.test(riskProfile.riskType)
                                                            ? "secondary"
                                                            : /moderate/i.test(riskProfile.riskType)
                                                                ? "info"
                                                                : "warning"
                                                    }>
                                                        {riskProfile.riskType}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {riskProfile.recommendedPortfolio && (
                                                <div className="mt-3">
                                                    <div className="text-muted small">Recommended Portfolio</div>
                                                    <div className="fw-semibold">{riskProfile.recommendedPortfolio}</div>
                                                </div>
                                            )}

                                            {topGoal && (
                                                <div className="mt-4">
                                                    <div className="text-muted small">Best Progress Goal</div>
                                                    <div className="fw-semibold">{topGoal.name || topGoal.goalName}</div>
                                                    <ProgressBar
                                                        className="mt-2"
                                                        now={Math.min(100, Math.max(0, Math.round(topGoal.progress ?? 0)))}
                                                    />
                                                </div>
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
    );
}
