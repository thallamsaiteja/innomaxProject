import React, { useEffect, useState } from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";
import { getAdminOverview, getAllClients } from "../../services/adminApi";
import { FaUsers, FaShieldAlt, FaCoins } from "react-icons/fa";
import "../../styles/AdminDashboard.css";

const StatsCards = () => {
    const [stats, setStats] = useState({
        totalClients: 0,
        riskProfilesCompleted: 0,
        activeSIPs: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const overview = await getAdminOverview().catch(() => ({}));
                const clients = await getAllClients().catch(() => []);

                setStats({
                    totalClients: clients.length || 0,
                    riskProfilesCompleted: overview?.riskProfilesCompleted || 0,
                    activeSIPs: overview?.activeSIPs || 0,
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );

    const cards = [
        {
            title: "Total Clients",
            value: stats.totalClients,
            icon: <FaUsers className="stats-icon users" />,
        },
        {
            title: "Completed Risk Profiles",
            value: stats.riskProfilesCompleted,
            icon: <FaShieldAlt className="stats-icon risks" />,
        },
        {
            title: "Active SIPs",
            value: stats.activeSIPs,
            icon: <FaCoins className="stats-icon sips" />,
        },
    ];

    return (
        <Row className="g-4 stats-row">
            {cards.map((card, index) => (
                <Col key={index} lg={4} md={6} sm={12}>
                    <Card className="stats-card">
                        <Card.Body className="d-flex align-items-center justify-content-between">
                            <div>
                                <Card.Title className="stats-title">{card.title}</Card.Title>
                                <Card.Text className="stats-value">{card.value}</Card.Text>
                            </div>
                            {card.icon}
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default StatsCards;
